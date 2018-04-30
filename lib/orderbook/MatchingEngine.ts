import FastPriorityQueue from 'fastpriorityqueue';

import enums from 'lib/constants/enums';
import Logger from 'lib/Logger';

class MatchingEngine {
  pairId: any;
  priorityQueues: any;
  logger: any;
  isMatching: any;

  constructor(pairId, buyOrders = [], ownBuyOrders = [], sellOrders = [], ownSellOrders = []) {
    this.pairId = pairId;
    this.priorityQueues = {
      peersBuyOrders: MatchingEngine.initPriorityQueue(buyOrders, enums.orderingDirections.DESC),
      ownBuyOrders: MatchingEngine.initPriorityQueue(ownBuyOrders, enums.orderingDirections.DESC),
      peersSellOrders: MatchingEngine.initPriorityQueue(sellOrders, enums.orderingDirections.ASC),
      ownSellOrders: MatchingEngine.initPriorityQueue(ownSellOrders, enums.orderingDirections.ASC),
    };

    this.logger = Logger.global;

    this.addOrder = this.addOrder.bind(this);
    this.getAddOrderMethod = this.getAddOrderMethod.bind(this);
    this.addPeerBuyOrder = this.addPeerBuyOrder.bind(this);
    this.addPeerSellOrder = this.addPeerSellOrder.bind(this);
    this.addOwnBuyOrder = this.addOwnBuyOrder.bind(this);
    this.addOwnSellOrder = this.addOwnSellOrder.bind(this);
    this.getMatchesOrAdd = this.getMatchesOrAdd.bind(this);
  }

  static initPriorityQueue(orders, orderingDirection) {
    const priorityQueue = this.createPriorityQueue(orderingDirection);
    orders.forEach((order) => {
      priorityQueue.add(order);
    });
    return priorityQueue;
  }

  static createPriorityQueue(orderingDirection) {
    const comparator = this.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  }

  static getOrdersPriorityQueueComparator(orderingDirection) {
    const directionComparator = orderingDirection === enums.orderingDirections.ASC
      ? (a, b) => a < b
      : (a, b) => a > b;

    return (a, b) => {
      if (a.price === b.price) {
        return a.createdAt < b.createdAt;
      } else {
        return directionComparator(a.price, b.price);
      }
    };
  }

  static isMatching({ buyOrder, sellOrder }) {
    // TODO: verify quantities
    return buyOrder.price >= sellOrder.price;
  }

  addOrder(order) {
    return this.getAddOrderMethod(order)(order);
  }

  getAddOrderMethod(order) {
    if (order.peerId === null) {
      if (order.quantity > 0) {
        return this.addOwnBuyOrder;
      } else {
        return this.addOwnSellOrder;
      }
    } else if (order.quantity > 0) {
      return this.addPeerBuyOrder;
    } else {
      return this.addPeerSellOrder;
    }
  }


  addPeerBuyOrder(order) {
    return this.getMatchesOrAdd({
      order,
      matchAgainst: [this.priorityQueues.ownSellOrders],
      addTo: this.priorityQueues.peersBuyOrders,
    });
  }

  addPeerSellOrder(order) {
    return this.getMatchesOrAdd({
      order,
      matchAgainst: [this.priorityQueues.ownBuyOrders],
      addTo: this.priorityQueues.peersSellOrders,
    });
  }

  addOwnBuyOrder(order) {
    return this.getMatchesOrAdd({
      order,
      matchAgainst: [this.priorityQueues.peersSellOrders, this.priorityQueues.ownSellOrders],
      addTo: this.priorityQueues.ownBuyOrders,
    });
  }

  addOwnSellOrder(order) {
    return this.getMatchesOrAdd({
      order,
      matchAgainst: [this.priorityQueues.peersBuyOrders, this.priorityQueues.ownBuyOrders],
      addTo: this.priorityQueues.ownSellOrders,
    });
  }

  getMatchesOrAdd({
    order, matchAgainst, addTo,
  }) {
    // just a dummy solution for now. will be adjusted after further discussions
    const matches: any = [];
    matchAgainst.forEach((priorityQueue) => {
      if (!priorityQueue.isEmpty &&
        this.isMatching({
          [order.quantity > 0 ? 'buyOrder' : 'sellOrder']: order,
          [order.quantity > 0 ? 'sellOrder' : 'buyOrder']: priorityQueue.peek(),
        })
      ) {
        matches.push({ maker: matchAgainst.poll(), taker: order });
      }

      if (matches.size > 0) {
        return matches;
      } else {
        addTo.add(order);
        return null;
      }
    });
  }
}


export default MatchingEngine;
