import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import MatchingEngine from '../../lib/orderbook/MatchingEngine';
import { orders } from '../../lib/types';
import { OrderingDirection } from '../../lib/types/enums';
import { ms } from '../../lib/utils/utils';

const PAIR_ID = 'BTC/LTC';

const createOwnOrder = (price: number, quantity: number, createdAt = ms()): orders.StampedOwnOrder => ({
  price,
  quantity,
  createdAt,
  id: uuidv1(),
  localId: uuidv1(),
  pairId: PAIR_ID,
});

const createPeerOrder = (price: number, quantity: number, createdAt = ms(), hostId = 1): orders.StampedPeerOrder => ({
  quantity,
  price,
  createdAt,
  hostId,
  id: uuidv1(),
  pairId: PAIR_ID,
  invoice: '',
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
    const targetQuantity = 6;
    const { target, remaining } = MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity),
      targetQuantity,
    );
    expect(target.quantity).to.equal(targetQuantity);
    expect(remaining.quantity).to.equal(orderQuantity - targetQuantity);
  });

  it('should split sell orders properly', () => {
    const orderQuantity = -10;
    const targetQuantity = 4;
    const { target, remaining } = MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, orderQuantity),
      targetQuantity,
    );
    expect(target.quantity).to.equal(targetQuantity * -1);
    expect(remaining.quantity).to.equal(orderQuantity + targetQuantity);
  });

  it('should not work when targetQuantity higher than quantity of order', () => {
    expect(() => MatchingEngine.splitOrderByQuantity(
      createOwnOrder(5, 5),
      10,
    )).to.throw('order abs quantity should be higher than targetQuantity');
  });
});

describe('MatchingEngine.match', () => {
  it('should fully match with two maker orders', () => {
    const engine = new MatchingEngine(PAIR_ID);
    engine.addPeerOrder(createPeerOrder(5, -5));
    engine.addPeerOrder(createPeerOrder(5, -5));
    const matchAgainst = [engine.priorityQueues.sellOrders];
    const { remainingOrder } = MatchingEngine.match(
      createOwnOrder(5, 10),
      matchAgainst,
    );
    expect(remainingOrder).to.be.null;
  });

  it('should split taker order when makers are insufficient', () => {
    const engine = new MatchingEngine(PAIR_ID);
    engine.addPeerOrder(createPeerOrder(5, -4));
    engine.addPeerOrder(createPeerOrder(5, -5));
    const matchAgainst = [engine.priorityQueues.sellOrders];
    const { remainingOrder } = MatchingEngine.match(
      createOwnOrder(5, 10),
      matchAgainst,
    );
    expect(remainingOrder.quantity).to.equal(1);
  });

  it('should split one maker order when taker is insufficient', () => {
    const engine = new MatchingEngine(PAIR_ID);
    engine.addPeerOrder(createPeerOrder(5, -5));
    engine.addPeerOrder(createPeerOrder(5, -6));
    const matchAgainst = [engine.priorityQueues.sellOrders];
    const { matches, remainingOrder } = MatchingEngine.match(
      createOwnOrder(5, 10),
      matchAgainst,
    );
    expect(remainingOrder).to.be.null;
    matches.forEach((match) => {
      expect(match.maker.quantity).to.equal(-5);
    });
    expect(engine.priorityQueues.sellOrders.peek().quantity).to.equal(-1);
  });
});

describe('MatchingEngine.removeOwnOrder', () => {
  it('should add a new ownOrder and then remove it', async () => {
    const engine = new MatchingEngine(PAIR_ID);
    expect(engine.isEmpty()).to.be.true;

    const matchingResult = engine.matchOrAddOwnOrder(createOwnOrder(5, -5), false);
    expect(matchingResult.matches).to.be.empty;
    expect(engine.isEmpty()).to.be.false;

    expect(engine.removeOwnOrder(uuidv1())).to.be.null;
    expect(engine.isEmpty()).to.be.false;

    const removedOrder = engine.removeOwnOrder(matchingResult.remainingOrder.id);
    expect(JSON.stringify(removedOrder)).to.equals(JSON.stringify(matchingResult.remainingOrder));
    expect(engine.isEmpty()).to.be.true;
  });
});

describe('MatchingEngine.removePeerOrders', () => {
  it('should add a new peerOrders and then remove some of them', () => {
    const engine = new MatchingEngine(PAIR_ID);
    const firstHostId = 1;
    const secondHostId = 2;

    expect(engine.isEmpty()).to.be.true;
    expect(engine.removePeerOrders(() => true)).to.be.empty;

    const firstHostOrders = [createPeerOrder(5, -5, ms(), firstHostId), createPeerOrder(5, -5, ms(), firstHostId)];
    engine.addPeerOrder(firstHostOrders[0]);
    engine.addPeerOrder(firstHostOrders[1]);
    engine.addPeerOrder(createPeerOrder(5, -5, ms(), secondHostId));

    const removedOrders = engine.removePeerOrders(order => order.hostId === firstHostId);
    expect(JSON.stringify(removedOrders)).to.be.equals(JSON.stringify(firstHostOrders));

    const matchingResult = engine.matchOrAddOwnOrder(createOwnOrder(5, 15), false);
    expect(matchingResult.remainingOrder.quantity).to.equal(10);
  });
});
