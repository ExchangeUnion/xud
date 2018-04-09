/* eslint-env mocha */
const { expect } = require('chai');
const MatchingEngine = require('../../lib/orderbook/MatchingEngine');
const enums = require('../../lib/constants/enums');

describe('MatchingEngine.match', () => {
  it('should not match buy order which is smaller then a sell order', () => {
    expect(MatchingEngine.isMatching({
      buyOrder: { price: 10 },
      sellOrder: { price: 11 },
    })).to.be.false;
  });

  it('should match buy order that is higher then a sell order', () => {
    expect(MatchingEngine.isMatching({
      buyOrder: { price: 11 },
      sellOrder: { price: 10 },
    })).to.be.true;
  });

  it('should match buy order that is equal to a sell order', () => {
    expect(MatchingEngine.isMatching({
      buyOrder: { price: 10 },
      sellOrder: { price: 10 },
    })).to.be.true;
  });
});


describe('MatchingEngine.getOrdersPriorityQueueComparator', () => {
  it('should prioritize lower price on ASC ordering direction', () => {
    const comparator = MatchingEngine
      .getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
    expect(comparator(
      { price: 10 },
      { price: 10.1 },
    )).to.be.true;
  });

  it('should not prioritize higher price on ASC ordering direction', () => {
    const comparator = MatchingEngine
      .getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
    expect(comparator(
      { price: 10.1 },
      { price: 10 },
    )).to.be.false;
  });

  it('should prioritize higher price on DESC ordering direction', () => {
    const comparator = MatchingEngine
      .getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
    expect(comparator(
      { price: 10.1 },
      { price: 10 },
    )).to.be.true;
  });

  it('should not prioritize lower price on DESC ordering direction', () => {
    const comparator = MatchingEngine
      .getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
    expect(comparator(
      { price: 10 },
      { price: 10.1 },
    )).to.be.false;
  });

  it('should prioritize lower localId when prices are equal on ASC ordering direction', () => {
    const comparator = MatchingEngine
      .getOrdersPriorityQueueComparator(enums.orderingDirections.ASC);
    expect(comparator(
      { price: 10, localId: 1 },
      { price: 10, localId: 2 },
    )).to.be.true;
  });

  it('should prioritize lower localId when prices are equal on DESC ordering direction', () => {
    const comparator = MatchingEngine
      .getOrdersPriorityQueueComparator(enums.orderingDirections.DESC);
    expect(comparator(
      { price: 10, localId: 1 },
      { price: 10, localId: 2 },
    )).to.be.true;
  });
});
