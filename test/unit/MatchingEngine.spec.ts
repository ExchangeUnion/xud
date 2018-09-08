import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import Logger, { Level } from '../../lib/Logger';
import MatchingEngine from '../../lib/orderbook/MatchingEngine';
import { orders } from '../../lib/types';
import { OrderingDirection } from '../../lib/types/enums';
import { ms } from '../../lib/utils/utils';

const PAIR_ID = 'LTC/BTC';
const loggers = Logger.createLoggers(Level.WARN);

const createOwnOrder = (price: number, quantity: number, createdAt = ms()): orders.StampedOwnOrder => ({
  price,
  quantity,
  createdAt,
  id: uuidv1(),
  localId: uuidv1(),
  pairId: PAIR_ID,
});

const createPeerOrder = (price: number, quantity: number, createdAt = ms(),
peerPubKey = '029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345'): orders.StampedPeerOrder => ({
  quantity,
  price,
  createdAt,
  peerPubKey,
  id: uuidv1(),
  pairId: PAIR_ID,
});

describe('MatchingEngine.getMatchingQuantity', () => {
  it('should not match buy order with a lower price then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5, 10),
      createOwnOrder(5.5, -10),
    );
    expect(res).to.equal(0);
  });

  it('should match buy order with a higher then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5.5, 10),
      createOwnOrder(5, -10),
    );
    expect(res).to.equal(10);
  });

  it('should match buy order with an equal price to a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5, 10),
      createOwnOrder(5, -10),
    );
    expect(res).to.equal(10);
  });

  it('should match with lowest quantity of both orders', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOwnOrder(5, 5),
      createOwnOrder(5, -10),
    );
    expect(res).to.equal(5);
  });
});

describe('MatchingEngine.getOrdersPriorityQueueComparator', () => {
  it('should prioritize lower price on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.ASC);
    const res = comparator(
      createOwnOrder(5, 10),
      createOwnOrder(5.5, -10),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize higher price on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.ASC);
    const res = comparator(
      createOwnOrder(5.5, 10),
      createOwnOrder(5, -10),
    );
    expect(res).to.be.false;
  });

  it('should prioritize higher price on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.DESC);
    const res = comparator(
      createOwnOrder(5.5, 10),
      createOwnOrder(5, -10),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize lower price on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.DESC);
    const res = comparator(
      createOwnOrder(5, 10),
      createOwnOrder(5.5, -10),
    );
    expect(res).to.be.false;
  });

  it('should prioritize earlier createdAt when prices are equal on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.ASC);
    const res = comparator(
      createOwnOrder(5, 10, ms() - 1),
      createOwnOrder(5, -10, ms()),
    );
    expect(res).to.be.true;
  });

  it('should prioritize earlier createdAt when prices are equal on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(OrderingDirection.DESC);
    const res = comparator(
      createOwnOrder(5, 10, ms() - 1),
      createOwnOrder(5, -10, ms()),
    );
    expect(res).to.be.true;
  });
});

describe('MatchingEngine.splitOrderByQuantity', () => {
  it('should split buy orders properly', () => {
    const orderQuantity = 10;
    const matchingQuantity = 6;
    const { matched, remaining } = MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity),
      matchingQuantity,
    );
    expect(matched.quantity).to.equal(matchingQuantity);
    expect(remaining.quantity).to.equal(orderQuantity - matchingQuantity);
  });

  it('should split sell orders properly', () => {
    const orderQuantity = -10;
    const matchingQuantity = 4;
    const { matched, remaining } = MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity),
      matchingQuantity,
    );
    expect(matched.quantity).to.equal(matchingQuantity * -1);
    expect(remaining.quantity).to.equal(orderQuantity + matchingQuantity);
  });

  it('should not work when matchingQuantity higher than quantity of order', () => {
    expect(() => MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, 5),
      10,
    )).to.throw('order abs quantity must be greater than matchingQuantity');
  });
});

describe('MatchingEngine.match', () => {
  it('should fully match with two maker orders', () => {
    const engine = new MatchingEngine(loggers.orderbook, PAIR_ID);
    engine.addPeerOrder(createPeerOrder(5, -5));
    engine.addPeerOrder(createPeerOrder(5, -5));
    const matchAgainst = [engine.sellOrders];
    const { remainingOrder } = engine.match(createOwnOrder(5, 10));
    expect(remainingOrder).to.be.undefined;
  });

  it('should split taker order when makers are insufficient', () => {
    const engine = new MatchingEngine(loggers.orderbook, PAIR_ID);
    engine.addPeerOrder(createPeerOrder(5, -4));
    engine.addPeerOrder(createPeerOrder(5, -5));
    const matchAgainst = [engine.sellOrders];
    const { remainingOrder } = engine.match(createOwnOrder(5, 10));
    expect(remainingOrder).to.not.be.undefined;
    expect(remainingOrder!.quantity).to.equal(1);
  });

  it('should split one maker order when taker is insufficient', () => {
    const engine = new MatchingEngine(loggers.orderbook, PAIR_ID);
    engine.addPeerOrder(createPeerOrder(5, -5));
    engine.addPeerOrder(createPeerOrder(5, -6));
    const matchAgainst = [engine.sellOrders];
    const { matches, remainingOrder } = engine.match(createOwnOrder(5, 10));
    expect(remainingOrder).to.be.undefined;
    matches.forEach((match) => {
      expect(match.maker.quantity).to.equal(-5);
    });
    const peekResult = engine.sellOrders.peek();
    expect(peekResult).to.not.be.undefined;
    expect(peekResult!.quantity).to.equal(-1);
  });
});

describe('MatchingEngine.removeOwnOrder', () => {
  it('should add a new ownOrder and then remove it', async () => {
    const engine = new MatchingEngine(loggers.orderbook, PAIR_ID);
    expect(engine.isEmpty()).to.be.true;

    const matchingResult = engine.matchOrAddOwnOrder(createOwnOrder(5, -5), false);
    expect(matchingResult.matches).to.be.empty;
    expect(matchingResult.remainingOrder).to.not.be.undefined;
    expect(engine.isEmpty()).to.be.false;

    expect(engine.removeOwnOrder(uuidv1())).to.be.undefined;
    expect(engine.isEmpty()).to.be.false;

    const removedOrder = engine.removeOwnOrder(matchingResult.remainingOrder!.id);
    expect(JSON.stringify(removedOrder)).to.equals(JSON.stringify(matchingResult.remainingOrder));
    expect(engine.isEmpty()).to.be.true;
  });
});

describe('MatchingEngine.removePeerOrders', () => {
  it('should add new peerOrders and then remove some of them', () => {
    const engine = new MatchingEngine(loggers.orderbook, PAIR_ID);

    const firstPeerPubKey = '026a848ebd1792001ff10c6e212f6077aec5669af3de890e1ae196b4e9730d75b9';
    const secondPeertPubKey = '029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345';

    expect(engine.isEmpty()).to.be.true;

    const firstHostOrders = [createPeerOrder(5, -5, ms(), firstPeerPubKey), createPeerOrder(5, -5, ms(), firstPeerPubKey)];
    engine.addPeerOrder(firstHostOrders[0]);
    engine.addPeerOrder(firstHostOrders[1]);
    engine.addPeerOrder(createPeerOrder(5, -5, ms(), secondPeertPubKey));

    const removedOrders = engine.removePeerOrders(firstPeerPubKey);
    expect(JSON.stringify(removedOrders)).to.be.equals(JSON.stringify(firstHostOrders));

    const matchingResult = engine.matchOrAddOwnOrder(createOwnOrder(5, 15), false);
    expect(matchingResult.remainingOrder).to.not.be.undefined;
    expect(matchingResult.remainingOrder!.quantity).to.equal(10);
  });

  it('should add a new peerOrder and then remove it partially', () => {
    const engine = new MatchingEngine(loggers.orderbook, PAIR_ID);
    expect(engine.isEmpty()).to.be.true;

    const quantity = -5;
    const decreasedQuantity = -3;

    const order = createPeerOrder(5, quantity);
    engine.addPeerOrder(order);

    let removedOrder = engine.removePeerOrder(order.id, decreasedQuantity) as orders.StampedPeerOrder;
    expect(removedOrder.quantity).to.be.equal(decreasedQuantity);

    removedOrder = engine.removePeerOrder(order.id) as orders.StampedPeerOrder;
    expect(removedOrder.quantity).to.be.equal(quantity - decreasedQuantity);
  });
});
