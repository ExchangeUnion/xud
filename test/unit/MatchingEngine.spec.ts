import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import MatchingEngine from '../../lib/orderbook/MatchingEngine';
import { orders } from '../../lib/types';
import enums from '../../lib/constants/enums';

const PAIR_ID = 'BTC/LTC';

const createOrder = (price: number, quantity: number, createdAt?: Date): orders.StampedOrder => ({
  quantity,
  price,
  id: uuidv1(),
  pairId: PAIR_ID,
  peerId: 1,
  createdAt: createdAt || new Date(),
});

const createDbOrder = (price: number, quantity: number) => {
  return createOrder(price, quantity) as orders.dbOrder;
};

describe('MatchingEngine.getMatchingQuantity', () => {
  it('should not match buy order with a lower price then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5, 10),
      createOrder(5.5, -10),
    );
    expect(res).to.be.equal(0);
  });

  it('should match buy order with a higher then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5.5, 10),
      createOrder(5, -10),
    );
    expect(res).to.be.equal(10);
  });

  it('should match buy order with an equal price to a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5, 10),
      createOrder(5, -10),
    );
    expect(res).to.be.equal(10);
  });

  it('should match with lowest quantity of both orders', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5, 5),
      createOrder(5, -10),
    );
    expect(res).to.be.equal(5);
  });
});

describe('MatchingEngine.getOrdersPriorityQueueComparator', () => {
  it('should prioritize lower price on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
    const res = comparator(
      createOrder(5, 10),
      createOrder(5.5, -10),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize higher price on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
    const res = comparator(
      createOrder(5.5, 10),
      createOrder(5, -10),
    );
    expect(res).to.be.false;
  });

  it('should prioritize higher price on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
    const res = comparator(
      createOrder(5.5, 10),
      createOrder(5, -10),
    );
    expect(res).to.be.true;
  });

  it('should not prioritize lower price on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
    const res = comparator(
      createOrder(5, 10),
      createOrder(5.5, -10),
    );
    expect(res).to.be.false;
  });

  it('should prioritize earlier createdAt when prices are equal on ASC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
    const res = comparator(
      createOrder(5, 10, new Date(1)),
      createOrder(5, -10, new Date(2)),
    );
    expect(res).to.be.true;
  });

  it('should prioritize earlier createdAt when prices are equal on DESC ordering direction', () => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
    const res = comparator(
      createOrder(5, 10, new Date(1)),
      createOrder(5, -10, new Date(2)),
    );
    expect(res).to.be.true;
  });
});

describe('MatchingEngine.splitOrderByQuantity', () => {
  it('should split buy orders properly', () => {
    const orderQuantity = 10;
    const targetQuantity = 6;
    const { target, remaining } = MatchingEngine.splitOrderByQuantity(
      createOrder(5, orderQuantity),
      targetQuantity,
    );
    expect(target.quantity).to.be.equal(targetQuantity);
    expect(remaining.quantity).to.be.equal(orderQuantity - targetQuantity);
  });

  it('should split sell orders properly', () => {
    const orderQuantity = -10;
    const targetQuantity = 4;
    const { target, remaining } = MatchingEngine.splitOrderByQuantity(
      createOrder(5, orderQuantity),
      targetQuantity,
    );
    expect(target.quantity).to.be.equal(targetQuantity * -1);
    expect(remaining.quantity).to.be.equal(orderQuantity + targetQuantity);
  });

  it('should not work when targetQuantity higher than quantity of order', () => {
    expect(() => MatchingEngine.splitOrderByQuantity(
      createOrder(5, 5),
      10,
    )).to.throw('order abs quantity should be higher than targetQuantity');
  });
});

describe('MatchingEngine.match', () => {
  it('should fully match with two maker orders', () => {
    const engine = new MatchingEngine(PAIR_ID, true, [], [
      createDbOrder(5, -5),
      createDbOrder(5, -5),
    ], [], []);
    const matchAgainst = [engine.priorityQueues.peerSellOrders];
    const { remainingOrder } = MatchingEngine.match(
      createOrder(5, 10),
      matchAgainst,
    );
    expect(remainingOrder).to.be.null;
  });

  it('should split taker order when makers are insufficient', () => {
    const engine = new MatchingEngine(PAIR_ID, true, [], [
      createDbOrder(5, -5),
      createDbOrder(5, -4),
    ], [], []);
    const matchAgainst = [engine.priorityQueues.peerSellOrders];
    const { remainingOrder } = MatchingEngine.match(
      createOrder(5, 10),
      matchAgainst,
    );
    expect(remainingOrder.quantity).to.be.equal(1);
  });

  it('should split one maker order when taker is insufficient', () => {
    const engine = new MatchingEngine(PAIR_ID, true, [], [
      createDbOrder(5, -5),
      createDbOrder(5, -6),
    ], [], []);
    const matchAgainst = [engine.priorityQueues.peerSellOrders];
    const { matches, remainingOrder } = MatchingEngine.match(
      createOrder(5, 10),
      matchAgainst,
    );
    expect(remainingOrder).to.be.null;
    matches.forEach((match) => {
      expect(match.maker.quantity).to.be.equal(-5);
    });
    expect(engine.priorityQueues.peerSellOrders.peek().quantity).to.be.equal(-1);
  });
});
