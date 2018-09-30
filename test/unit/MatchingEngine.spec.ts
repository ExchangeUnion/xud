import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import Logger, { Level } from '../../lib/Logger';
import MatchingEngine from '../../lib/orderbook/MatchingEngine';
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

let engine: MatchingEngine;

const isEmpty = (engine: MatchingEngine) => {
  expect(engine.ownOrders.buy).to.be.empty;
  expect(engine.ownOrders.sell).to.be.empty;
  expect(engine.queues.sell.isEmpty()).to.be.true;
};

const init = () => {
  engine = new MatchingEngine(loggers.orderbook, PAIR_ID);
  isEmpty(engine);
};

describe('MatchingEngine.getMatchingQuantity', () => {
  it('should not match buy order with a lower price then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5, 10, true),
      createOwnOrder(5.5, 10, false),
    );
    expect(res).to.equal(0);
  });

  it('should match buy order with a higher then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5.5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.equal(10);
  });

  it('should match buy order with an equal price to a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.equal(10);
  });

  it('should match with lowest quantity of both orders', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5, 5, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.equal(5);
  });
});

describe('MatchingEngine.getOrdersPriorityQueueComparator', () => {
  it('should prioritize lower price on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.Asc);
    const res = comparator(
      createOwnOrder(5, 10, true),
      createOwnOrder(5.5, 10, false),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize higher price on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.Asc);
    const res = comparator(
      createOwnOrder(5.5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.be.false;
  });

  it('should prioritize higher price on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.Desc);
    const res = comparator(
      createOwnOrder(5.5, 10, true),
      createOwnOrder(5, 10, false),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize lower price on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.Desc);
    const res = comparator(
      createOwnOrder(5, 10, true),
      createOwnOrder(5.5, 10, false),
    );
    expect(res).to.be.false;
  });

  it('should prioritize earlier createdAt when prices are equal on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.Asc);
    const res = comparator(
      createOwnOrder(5, 10, true, ms() - 1),
      createOwnOrder(5, 10, false, ms()),
    );
    expect(res).to.be.true;
  });

  it('should prioritize earlier createdAt when prices are equal on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.Desc);
    const res = comparator(
      createOwnOrder(5, 10, true, ms() - 1),
      createOwnOrder(5, 10, false, ms()),
    );
    expect(res).to.be.true;
  });
});

describe('MatchingEngine.splitOrderByQuantity', () => {
  it('should split buy orders properly', () => {
    const orderQuantity = 10;
    const matchingQuantity = 6;
    const { matched, remaining } = MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity, true),
      matchingQuantity,
    );
    expect(matched.quantity).to.equal(matchingQuantity);
    expect(remaining.quantity).to.equal(orderQuantity - matchingQuantity);
  });

  it('should split sell orders properly', () => {
    const orderQuantity = 10;
    const matchingQuantity = 4;
    const { matched, remaining } = MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity, false),
      matchingQuantity,
    );
    expect(matched.quantity).to.equal(matchingQuantity);
    expect(remaining.quantity).to.equal(orderQuantity - matchingQuantity);
  });

  it('should not work when matchingQuantity higher than quantity of order', () => {
    expect(() => MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, 5, true),
      10,
    )).to.throw('order quantity must be greater than matchingQuantity');
  });
});

describe('MatchingEngine.match', () => {
  beforeEach(init);

  it('should fully match with two maker orders', () => {
    engine.addPeerOrder(createPeerOrder(5, 5, false));
    engine.addPeerOrder(createPeerOrder(5, 5, false));
    const { remainingOrder } = engine['match'](createOwnOrder(5, 10, true));
    expect(remainingOrder).to.be.undefined;
  });

  it('should split taker order when makers are insufficient', () => {
    engine.addPeerOrder(createPeerOrder(5, 4, false));
    engine.addPeerOrder(createPeerOrder(5, 5, false));
    const matchAgainst = [engine.queues.sell];
    const { remainingOrder } = engine['match'](createOwnOrder(5, 10, true));
    expect(remainingOrder).to.not.be.undefined;
    expect(remainingOrder!.quantity).to.equal(1);
  });

  it('should split one maker order when taker is insufficient', () => {
    engine.addPeerOrder(createPeerOrder(5, 5, false));
    engine.addPeerOrder(createPeerOrder(5, 6, false));
    const matchAgainst = [engine.queues.sell];
    const { matches, remainingOrder } = engine['match'](createOwnOrder(5, 10, true));
    expect(remainingOrder).to.be.undefined;
    matches.forEach((match) => {
      expect(match.maker.quantity).to.equal(5);
    });
    const peekResult = engine.queues.sell.peek();
    expect(peekResult).to.not.be.undefined;
    expect(peekResult!.quantity).to.equal(1);
  });
});

describe('MatchingEngine.removeOwnOrder', () => {
  beforeEach(init);

  it('should add a new ownOrder and then remove it', async () => {
    const matchingResult = engine.matchOrAddOwnOrder(createOwnOrder(5, 5, false), false);
    expect(matchingResult.matches).to.be.empty;
    expect(matchingResult.remainingOrder).to.not.be.undefined;

    expect(engine.removeOwnOrder(uuidv1())).to.be.undefined;

    const removedOrder = engine.removeOwnOrder(matchingResult.remainingOrder!.id);
    expect(JSON.stringify(removedOrder)).to.equals(JSON.stringify(matchingResult.remainingOrder));
    isEmpty(engine);
  });
});

describe('MatchingEngine.removePeerOrders', () => {
  beforeEach(init);

  it('should add new peerOrders and then remove some of them', () => {
    const firstPeerPubKey = '026a848ebd1792001ff10c6e212f6077aec5669af3de890e1ae196b4e9730d75b9';
    const secondPeerPubKey = '029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345';

    const firstHostOrders = [createPeerOrder(100, 5, false, ms(), firstPeerPubKey),
      createPeerOrder(100, 5, false, ms(), firstPeerPubKey)];
    engine.addPeerOrder(firstHostOrders[0]);
    engine.addPeerOrder(firstHostOrders[1]);
    engine.addPeerOrder(createPeerOrder(100, 5, false, ms(), secondPeerPubKey));
    expect(engine.peerOrders.sell.size).to.equal(3);

    const removedOrders = engine.removePeerOrders(firstPeerPubKey);
    expect(removedOrders.length).to.equal(2);
    expect(JSON.stringify(removedOrders)).to.be.equals(JSON.stringify(firstHostOrders));
    expect(engine.queues.sell.size).to.equal(1);
    expect(engine.peerOrders.sell.size).to.equal(1);

    const matchingResult = engine.matchOrAddOwnOrder(createOwnOrder(100, 15, true), false);
    expect(matchingResult.remainingOrder).to.not.be.undefined;
    expect(matchingResult.remainingOrder!.quantity).to.equal(10);
  });

  it('should add a new peerOrder and then remove it partially', () => {
    const quantity = 5;
    const quantityToRemove = 3;

    const order = createPeerOrder(5, quantity, false);
    engine.addPeerOrder(order);

    let removedOrder = engine.removePeerOrderQuantity(order.id, quantityToRemove) as orders.StampedPeerOrder;
    expect(removedOrder.quantity).to.be.equal(quantityToRemove);

    removedOrder = engine.removePeerOrderQuantity(order.id) as orders.StampedPeerOrder;
    expect(removedOrder.quantity).to.be.equal(quantity - quantityToRemove);
  });
});

describe('MatchingEngine queues and lists integrity', () => {
  beforeEach(init);

  it('queue and list should both remove an own order', () => {
    const ownOrder = createOwnOrder(100, 10, false);
    engine.matchOrAddOwnOrder(ownOrder, false);
    expect(engine.ownOrders.sell.size).to.equal(1);
    expect(engine.queues.sell.size).to.be.equal(1);

    engine.removeOwnOrder(ownOrder.id);
    isEmpty(engine);
  });

  it('queue and list should both remove a peer order', () => {
    const peerOrder = createPeerOrder(100, 10, false);
    engine['addPeerOrder'](peerOrder);
    expect(engine.peerOrders.sell.size).to.equal(1);
    expect(engine.queues.sell.size).to.be.equal(1);

    engine['removePeerOrder'](peerOrder);
    expect(engine.peerOrders.sell).to.be.empty;
    expect(engine.queues.sell.isEmpty()).to.be.true;
  });

  it('queue and list should have the same order instance after a partial peer order removal', () => {
    const peerOrder = createPeerOrder(100, 10, false, ms());
    engine.addPeerOrder(peerOrder);
    expect(engine.peerOrders.sell.size).to.equal(1);

    const removedOrder = engine.removePeerOrderQuantity(peerOrder.id, 3);
    expect(removedOrder!.quantity).to.equal(3);
    expect(engine.peerOrders.sell.size).to.equal(1);

    const listRemainingOrder = engine.peerOrders.sell.get(peerOrder.id);
    const queueRemainingOrder = engine.queues.sell.peek();
    expect(listRemainingOrder && listRemainingOrder.quantity).to.equal(7);
    expect(listRemainingOrder).to.equal(queueRemainingOrder);
  });

  it('queue and list should have the same order instance after a partial match / maker order split', () => {
    const peerOrder = createPeerOrder(100, 10, false, ms());
    engine.addPeerOrder(peerOrder);
    expect(engine.peerOrders.sell.size).to.equal(1);

    const ownOrder = createOwnOrder(100, 3, true);
    const matchingResult = engine.matchOrAddOwnOrder(ownOrder, false);
    expect(matchingResult.remainingOrder).to.be.undefined;

    const listRemainingOrder = engine.peerOrders.sell.get(peerOrder.id);
    const queueRemainingOrder = engine.queues.sell.peek();
    expect(listRemainingOrder && listRemainingOrder.quantity).to.equal(7);
    expect(listRemainingOrder).to.equal(queueRemainingOrder);
  });

  it('queue and list should both have the maker order removed after a full match', () => {
    const peerOrder = createPeerOrder(100, 10, false, ms());
    engine.addPeerOrder(peerOrder);
    expect(engine.peerOrders.sell.size).to.equal(1);

    const ownOrder = createOwnOrder(100, 10, true);
    const matchingResult = engine.matchOrAddOwnOrder(ownOrder, false);
    expect(matchingResult.remainingOrder).to.be.undefined;

    const listRemainingOrder = engine.peerOrders.sell.get(peerOrder.id);
    const queueRemainingOrder = engine.queues.sell.peek();
    expect(listRemainingOrder).to.be.undefined;
    expect(queueRemainingOrder).to.be.undefined;
  });
});
