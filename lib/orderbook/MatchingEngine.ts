import assert from 'assert';
import FastPriorityQueue from 'fastpriorityqueue';

import { orders, matchingEngine } from '../types';
import enums from '../constants/enums';
import Logger from '../Logger';

type PriorityQueue = {
  add: Function;
  heapify: Function;
  peek: Function;
  poll: Function;
  trim: Function;
  isEmpty: Function;
  has: Function;
};

type PriorityQueues = {
  peerBuyOrders: PriorityQueue;
  peerSellOrders: PriorityQueue;
  ownBuyOrders: PriorityQueue;
  ownSellOrders: PriorityQueue;
};

type SplitOrder = {
  target: orders.StampedOrder;
  remaining: orders.StampedOrder;
};

class MatchingEngine {
  priorityQueues: PriorityQueues;
  logger: Logger = Logger.global;

  constructor(public pairId: string,
              private internalMatching: boolean,
              peerBuyOrders: orders.dbOrder[] = [],
              peerSellOrders: orders.dbOrder[] = [],
              ownBuyOrders: orders.dbOrder[] = [],
              ownSellOrders: orders.dbOrder[] = []) {
    this.priorityQueues = {
      peerBuyOrders: MatchingEngine.initPriorityQueue(peerBuyOrders, enums.orderingDirections.DESC),
      peerSellOrders: MatchingEngine.initPriorityQueue(peerSellOrders, enums.orderingDirections.ASC),
      ownBuyOrders: MatchingEngine.initPriorityQueue(ownBuyOrders, enums.orderingDirections.DESC),
      ownSellOrders: MatchingEngine.initPriorityQueue(ownSellOrders, enums.orderingDirections.ASC),
    };
  }

  private static initPriorityQueue(orders, orderingDirection): PriorityQueue {
    const priorityQueue = this.createPriorityQueue(orderingDirection);
    orders.forEach((order) => {
      priorityQueue.add(order);
    });
    return priorityQueue;
  }

  private static createPriorityQueue(orderingDirection): PriorityQueue {
    const comparator = this.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  }

  private static getOrdersPriorityQueueComparator(orderingDirection): Function {
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

  public addPeerOrder = (order: orders.StampedPeerOrder): void => {
    (order.quantity > 0
      ? this.priorityQueues.peerBuyOrders
      : this.priorityQueues.peerSellOrders
    ).add(order);
  }

  public matchOrAddOwnOrder = (order: orders.StampedOwnOrder): matchingEngine.MatchingResult => {
    const isBuyOrder = order.quantity > 0;
    const matchAgainst: PriorityQueue[] = [];
    let addTo: PriorityQueue|null = null;

    if (isBuyOrder) {
      matchAgainst.push(this.priorityQueues.peerSellOrders);
      if (this.internalMatching) {
        matchAgainst.push(this.priorityQueues.ownSellOrders);
        addTo = this.priorityQueues.ownBuyOrders;
      }
    } else {
      matchAgainst.push(this.priorityQueues.peerBuyOrders);
      if (this.internalMatching) {
        matchAgainst.push(this.priorityQueues.ownBuyOrders);
        addTo = this.priorityQueues.ownSellOrders;
      }
    }

    const matchingResult = this.match(order, matchAgainst);
    if (matchingResult.remainingOrder && addTo) {
      addTo.add(matchingResult.remainingOrder);
    }

    return matchingResult;
  }

  private match(order: orders.StampedOrder, matchAgainst: PriorityQueue[]): matchingEngine.MatchingResult {
    const isBuyOrder = order.quantity > 0;
    const matches: matchingEngine.OrderMatch[] = [];
    let remainingOrder: orders.StampedOrder|null = { ...order };

    const getMatchingUnits = (remainingOrder, oppositeOrder) => isBuyOrder
      ? this.getMatchingUnits(remainingOrder, oppositeOrder)
      : this.getMatchingUnits(oppositeOrder, remainingOrder);

    matchAgainst.forEach((priorityQueue) => {
      while (remainingOrder && !priorityQueue.isEmpty()) {
        const oppositeOrder = priorityQueue.peek();
        const mUnits = getMatchingUnits(remainingOrder, oppositeOrder);

        if (mUnits <= 0) {
          break;
        } else {
          const oppositeOrder = priorityQueue.poll();
          const oppositeOrderAbsQuantity = Math.abs(oppositeOrder.quantity);
          const remainingOrderAbsQuantity = Math.abs(remainingOrder.quantity);

          if (oppositeOrderAbsQuantity === mUnits && remainingOrderAbsQuantity === mUnits) { // order quantities are fully matching
            matches.push({ maker: oppositeOrder, taker: remainingOrder });
            remainingOrder = null;
          } else if (remainingOrderAbsQuantity === mUnits) {  // maker order quantity is not sufficient. taker order will split
            const splitOrder = this.splitOrderByUnits(oppositeOrder, mUnits);
            matches.push({ maker: splitOrder.target, taker: remainingOrder });
            priorityQueue.add(splitOrder.remaining);
            remainingOrder = null;
          } else if (oppositeOrderAbsQuantity === mUnits) { // taker order quantity is not sufficient. maker order will split
            const splitOrder = this.splitOrderByUnits(remainingOrder, mUnits);
            matches.push({ maker: oppositeOrder, taker: splitOrder.target });
            remainingOrder = splitOrder.remaining;
          } else {
            assert(false, 'mUnits should not be lower than both orders quantity values');
          }
        }
      }
    });

    return {
      matches,
      remainingOrder,
    };
  }

  private splitOrderByUnits = (order: orders.StampedOrder, targetUnits: number): SplitOrder => {
    const { quantity } =  order;
    const absQuantity = Math.abs(quantity);
    assert(absQuantity > targetUnits, 'order abs quantity should be higher than targetUnits');

    const direction = quantity / absQuantity;
    return {
      target: { ...order, quantity: targetUnits * direction },
      remaining: { ...order, quantity: quantity - (targetUnits * direction) },
    };
  }

  private getMatchingUnits = (buyOrder: orders.StampedOrder, sellOrder: orders.StampedOrder): number => {
    if (buyOrder.price >= sellOrder.price) {
      return Math.min(buyOrder.quantity, sellOrder.quantity * -1);
    } else {
      return 0;
    }
  }
}

export default MatchingEngine;
