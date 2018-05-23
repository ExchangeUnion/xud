import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import MatchingEngine from '../../lib/orderbook/MatchingEngine';
import { orders } from '../../lib/types';
import enums from '../../lib/constants/enums';

const createOrder = (price: number, quantity: number, createdAt?: Date): orders.StampedOrder => ({
  id: uuidv1(),
  pairId: 'BTC/LTC',
  peerId: 1,
  quantity,
  price,
  createdAt: createdAt || new Date(),
});

describe('MatchingEngine.getMatchingQuantity', () => {
  it('should not match buy order with a lower price then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5, 10),
      createOrder(5.5, -10)
    );
    expect(res).to.be.equal(0);
  });


  it('should match buy order with a higher then a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5.5, 10),
      createOrder(5, -10)
    );
    expect(res).to.be.equal(10);
  });

  it('should match buy order with an equal price to a sell order', () => {
    const res = MatchingEngine.getMatchingQuantity(
      createOrder(5, 10),
      createOrder(5, -10)
    );
    expect(res).to.be.equal(10);
  });

  describe('MatchingEngine.getOrdersPriorityQueueComparator', () => {
    it('should prioritize lower price on ASC ordering direction', () => {
      const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
      const res = comparator(
        createOrder(5, 10),
        createOrder(5.5, -10)
      );
      expect(res).to.be.true;
    });

    it('should not prioritize higher price on ASC ordering direction', () => {
      const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
      const res = comparator(
        createOrder(5.5, 10),
        createOrder(5, -10)
      );
      expect(res).to.be.false;
    });

    it('should prioritize higher price on DESC ordering direction', () => {
      const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
      const res = comparator(
        createOrder(5.5, 10),
        createOrder(5, -10)
      );
      expect(res).to.be.true;
    });

    it('should not prioritize lower price on DESC ordering direction', () => {
      const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
      const res = comparator(
        createOrder(5, 10),
        createOrder(5.5, -10)
      );
      expect(res).to.be.false;
    });

    it('should prioritize earlier createdAt when prices are equal on ASC ordering direction', () => {
      const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
      const res = comparator(
        createOrder(5, 10, new Date(1)),
        createOrder(5, -10, new Date(2))
      );
      expect(res).to.be.true;
    });

    it('should prioritize earlier createdAt when prices are equal on DESC ordering direction', () => {
      const comparator = MatchingEngine.getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
      const res = comparator(
        createOrder(5, 10, new Date(1)),
        createOrder(5, -10, new Date(2))
      );
      expect(res).to.be.true;
    });
  })
});

