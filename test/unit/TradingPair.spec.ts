import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import Logger, { Level } from '../../lib/Logger';
import TradingPair from '../../lib/orderbook/TradingPair';
import { orders } from '../../lib/types';
import { OrderingDirection } from '../../lib/types/enums';
import { ms } from '../../lib/utils/utils';

const PAIR_ID = 'LTC/BTC';
const loggers = Logger.createLoggers(Level.Warn);

const createOwnOrder = (price: number, quantity: number, isBuy: boolean, createdAt = ms()): orders.StampedOwnOrder => ({
  price,
  quantity,
  isBuy,
  createdAt,
  id: uuidv1(),
  localId: uuidv1(),
  pairId: PAIR_ID,
});

const createPeerOrder = (
  price: number,
  quantity: number,
  isBuy: boolean,
  createdAt = ms(),
  peerPubKey = '029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345',
): orders.StampedPeerOrder => ({
  quantity,
  price,
  isBuy,
  createdAt,
  peerPubKey,
  id: uuidv1(),
  pairId: PAIR_ID,
});

let tp: TradingPair;

const isEmpty = (tp: TradingPair) => {
  expect(tp.ownOrders.buy).to.be.empty;
  expect(tp.ownOrders.sell).to.be.empty;
  expect(tp.queues!.buy.isEmpty()).to.be.true;
  expect(tp.queues!.sell.isEmpty()).to.be.true;
};

const init = () => {
  tp = new TradingPair(loggers.orderbook, PAIR_ID);
  isEmpty(tp);
};

describe('TradingPair.getMatchingQuantity', () => {
  it('should not match buy order with a lower price then a sell order', () => {
    const res = TradingPair.getMatchingQuantity(
      createOwnOrder(5, 10, true),
      createOwnOrder(5.5, 10, false),
    );
    expect(res).to.equal(0);
  });

  it('should match buy order with a higher then a sell order', () => {
    const res = TradingPair.getMatchingQuantity(
      createOwnOrder(5.5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.equal(10);
  });

  it('should match buy order with an equal price to a sell order', () => {
    const res = TradingPair.getMatchingQuantity(
      createOwnOrder(5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.equal(10);
  });

  it('should match with lowest quantity of both orders', () => {
    const res = TradingPair.getMatchingQuantity(
      createOwnOrder(5, 5, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.equal(5);
  });
});

describe('TradingPair.getOrdersPriorityQueueComparator', () => {
  it('should prioritize lower price on ASC ordering direction', () => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(OrderingDirection.Asc);
    const res = comparator(
      createOwnOrder(5, 10, true),
      createOwnOrder(5.5, 10, false),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize higher price on ASC ordering direction', () => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(OrderingDirection.Asc);
    const res = comparator(
      createOwnOrder(5.5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.be.false;
  });

  it('should prioritize higher price on DESC ordering direction', () => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(OrderingDirection.Desc);
    const res = comparator(
      createOwnOrder(5.5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize lower price on DESC ordering direction', () => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(OrderingDirection.Desc);
    const res = comparator(
      createOwnOrder(5, 10, true),
      createOwnOrder(5.5, 10, false),
    );
    expect(res).to.be.false;
  });

  it('should prioritize earlier createdAt when prices are equal on ASC ordering direction', () => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(OrderingDirection.Asc);
    const res = comparator(
      createOwnOrder(5, 10, true, ms() - 1),
      createOwnOrder(5, 10, false, ms()),
    );
    expect(res).to.be.true;
  });

  it('should prioritize earlier createdAt when prices are equal on DESC ordering direction', () => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(OrderingDirection.Desc);
    const res = comparator(
      createOwnOrder(5, 10, true, ms() - 1),
      createOwnOrder(5, 10, false, ms()),
    );
    expect(res).to.be.true;
  });
});

describe('TradingPair.splitOrderByQuantity', () => {
  it('should split buy orders properly', () => {
    const orderQuantity = 10;
    const matchingQuantity = 6;
    const { matched, remaining } = TradingPair.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity, true),
      matchingQuantity,
    );
    expect(matched.quantity).to.equal(matchingQuantity);
    expect(remaining.quantity).to.equal(orderQuantity - matchingQuantity);
  });

  it('should split sell orders properly', () => {
    const orderQuantity = 10;
    const matchingQuantity = 4;
    const { matched, remaining } = TradingPair.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity, false),
      matchingQuantity,
    );
    expect(matched.quantity).to.equal(matchingQuantity);
    expect(remaining.quantity).to.equal(orderQuantity - matchingQuantity);
  });

  it('should not work when matchingQuantity higher than quantity of order', () => {
    expect(() => TradingPair.splitOrderByQuantity(
      createOwnOrder(5, 5, true),
      10,
    )).to.throw('order quantity must be greater than matchingQuantity');
  });
});

describe('TradingPair.match', () => {
  beforeEach(init);

  it('should fully match with two maker orders', () => {
    tp.addPeerOrder(createPeerOrder(5, 5, false));
    tp.addPeerOrder(createPeerOrder(5, 5, false));
    const { remainingOrder } = tp.match(createOwnOrder(5, 10, true));
    expect(remainingOrder).to.be.undefined;
  });

  it('should split taker order when makers are insufficient', () => {
    tp.addPeerOrder(createPeerOrder(5, 4, false));
    tp.addPeerOrder(createPeerOrder(5, 5, false));
    const { remainingOrder } = tp.match(createOwnOrder(5, 10, true));
    expect(remainingOrder).to.not.be.undefined;
    expect(remainingOrder!.quantity).to.equal(1);
  });

  it('should split one maker order when taker is insufficient', () => {
    tp.addPeerOrder(createPeerOrder(5, 5, false));
    tp.addPeerOrder(createPeerOrder(5, 6, false));
    const { matches, remainingOrder } = tp.match(createOwnOrder(5, 10, true));
    expect(remainingOrder).to.be.undefined;
    matches.forEach((match) => {
      expect(match.maker.quantity).to.equal(5);
    });
    const peekResult = tp.queues!.sell.peek();
    expect(peekResult).to.not.be.undefined;
    expect(peekResult!.quantity).to.equal(1);
  });
});

describe('TradingPair.removeOwnOrder', () => {
  beforeEach(init);

  it('should add a new ownOrder and then remove it', async () => {
    const ownOrder = createOwnOrder(5, 5, false);
    tp.addOwnOrder(ownOrder);
    tp.removeOwnOrder(ownOrder.id);
    isEmpty(tp);
  });
});

describe('TradingPair.removePeerOrders', () => {
  beforeEach(init);

  it('should add new peerOrders and then remove some of them', () => {
    const firstPeerPubKey = '026a848ebd1792001ff10c6e212f6077aec5669af3de890e1ae196b4e9730d75b9';
    const secondPeerPubKey = '029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345';

    const firstHostOrders = [createPeerOrder(100, 5, false, ms(), firstPeerPubKey),
      createPeerOrder(100, 5, false, ms(), firstPeerPubKey)];
    tp.addPeerOrder(firstHostOrders[0]);
    tp.addPeerOrder(firstHostOrders[1]);
    tp.addPeerOrder(createPeerOrder(100, 5, false, ms(), secondPeerPubKey));
    expect(tp.getPeersOrders().sell.length).to.equal(3);

    const removedOrders = tp.removePeerOrders(firstPeerPubKey);
    expect(removedOrders.length).to.equal(2);
    expect(JSON.stringify(removedOrders)).to.be.equals(JSON.stringify(firstHostOrders));
    expect(tp.queues!.sell.size).to.equal(1);
    expect(tp.getPeersOrders().sell.length).to.equal(1);

    const matchingResult = tp.match(createOwnOrder(100, 15, true));
    expect(matchingResult.remainingOrder).to.not.be.undefined;
    expect(matchingResult.remainingOrder!.quantity).to.equal(10);
  });

  it('should add a new peerOrder and then remove it partially', () => {
    const quantity = 5;
    const quantityToRemove = 3;

    const order = createPeerOrder(5, quantity, false);
    tp.addPeerOrder(order);

    let removedOrder = tp.removePeerOrder(order.id, order.peerPubKey, quantityToRemove).order;
    expect(removedOrder.quantity).to.be.equal(quantityToRemove);

    removedOrder = tp.removePeerOrder(order.id, order.peerPubKey).order;
    expect(removedOrder.quantity).to.be.equal(quantity - quantityToRemove);
  });

  it('should not remove a peer order using the wrong peer pub key', () => {
    const quantity = 5;
    const otherPeerPubKey = 'other-peer-pubkey';

    const order = createPeerOrder(5, quantity, false);
    tp.addPeerOrder(order);

    expect(() => tp.removePeerOrder(
      order.id,
      otherPeerPubKey,
      quantity,
    )).to.throw(`order with id ${order.id} could not be found`);
  });

});

describe('MatchingEngine queues and maps integrity', () => {
  beforeEach(init);

  it('queue and map should both remove an own order', () => {
    const ownOrder = createOwnOrder(100, 10, false);
    tp.addOwnOrder(ownOrder);
    expect(tp.ownOrders.sell.size).to.equal(1);
    expect(tp.queues!.sell.size).to.be.equal(1);

    tp.removeOwnOrder(ownOrder.id);
    isEmpty(tp);
  });

  it('queue and map should both remove a peer order', () => {
    const peerOrder = createPeerOrder(100, 10, false);
    tp['addPeerOrder'](peerOrder);
    expect(tp.getPeersOrders().sell.length).to.equal(1);
    expect(tp.queues!.sell.size).to.be.equal(1);

    tp['removePeerOrder'](peerOrder.id, peerOrder.peerPubKey);
    expect(tp.getPeersOrders().sell).to.be.empty;
    expect(tp.queues!.sell.isEmpty()).to.be.true;
  });

  it('queue and map should have the same order instance after a partial peer order removal', () => {
    const peerOrder = createPeerOrder(100, 10, false, ms());
    tp.addPeerOrder(peerOrder);
    expect(tp.getPeersOrders().sell.length).to.equal(1);

    const removeResult = tp.removePeerOrder(peerOrder.id, peerOrder.peerPubKey, 3);
    expect(removeResult.order.quantity).to.equal(3);
    expect(tp.getPeersOrders().sell.length).to.equal(1);

    const listRemainingOrder = tp.getPeerOrder(peerOrder.id, peerOrder.peerPubKey);
    const queueRemainingOrder = tp.queues!.sell.peek();
    expect(listRemainingOrder && listRemainingOrder.quantity).to.equal(7);
    expect(listRemainingOrder).to.equal(queueRemainingOrder);
  });

  it('queue and map should have the same order instance after a partial match / maker order split', () => {
    const peerOrder = createPeerOrder(100, 10, false, ms());
    tp.addPeerOrder(peerOrder);
    expect(tp.getPeersOrders().sell.length).to.equal(1);

    const ownOrder = createOwnOrder(100, 3, true);
    const matchingResult = tp.match(ownOrder);
    expect(matchingResult.remainingOrder).to.be.undefined;

    const listRemainingOrder = tp.getPeerOrder(peerOrder.id, peerOrder.peerPubKey);
    const queueRemainingOrder = tp.queues!.sell.peek();
    expect(listRemainingOrder && listRemainingOrder.quantity).to.equal(7);
    expect(listRemainingOrder).to.equal(queueRemainingOrder);
  });

  it('queue and map should both have the maker order removed after a full match', () => {
    const peerOrder = createPeerOrder(100, 10, false, ms());
    tp.addPeerOrder(peerOrder);
    expect(tp.getPeersOrders().sell.length).to.equal(1);

    const ownOrder = createOwnOrder(100, 10, true);
    const matchingResult = tp.match(ownOrder);
    expect(matchingResult.remainingOrder).to.be.undefined;

    expect(() => tp.getPeerOrder(
      peerOrder.id,
      peerOrder.peerPubKey,
    )).to.throw(`order with id ${peerOrder.peerPubKey}/${peerOrder.id} could not be found`);
    const queueRemainingOrder = tp.queues!.sell.peek();
    expect(queueRemainingOrder).to.be.undefined;
  });
});
