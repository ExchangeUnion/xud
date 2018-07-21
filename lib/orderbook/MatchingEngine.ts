import assert from 'assert';
import FastPriorityQueue from 'fastpriorityqueue';

import { orders, matchingEngine, db } from '../types';
import { OrderingDirection } from '../types/enums';
import Logger, { Context } from '../Logger';

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
  public priorityQueues: PriorityQueues;
  private logger: Logger;

  constructor(instanceId: number,
              public pairId: string,
              private internalMatching: boolean) {

    this.priorityQueues = {
      peerBuyOrders: MatchingEngine.createPriorityQueue(OrderingDirection.DESC),
      peerSellOrders: MatchingEngine.createPriorityQueue(OrderingDirection.ASC),
      ownBuyOrders: MatchingEngine.createPriorityQueue(OrderingDirection.DESC),
      ownSellOrders: MatchingEngine.createPriorityQueue(OrderingDirection.ASC),
    };
    this.logger = new Logger({ instanceId, context: Context.ORDERBOOK });
  }

  private static createPriorityQueue(orderingDirection): PriorityQueue {
    const comparator = this.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  }

  public static getOrdersPriorityQueueComparator(orderingDirection): Function {
    const directionComparator = orderingDirection === OrderingDirection.ASC
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

  public static getMatchingQuantity = (buyOrder: orders.StampedOrder, sellOrder: orders.StampedOrder): number => {
    if (buyOrder.price >= sellOrder.price) {
      return Math.min(buyOrder.quantity, sellOrder.quantity * -1);
    } else {
      return 0;
    }
  }

  public static splitOrderByQuantity = (order: orders.StampedOrder, targetQuantity: number): SplitOrder => {
    const { quantity } =  order;
    const absQuantity = Math.abs(quantity);
    assert(absQuantity > targetQuantity, 'order abs quantity should be higher than targetQuantity');

    const direction = quantity / absQuantity;
    return {
      target: { ...order, quantity: targetQuantity * direction },
      remaining: { ...order, quantity: quantity - (targetQuantity * direction) },
    };
  }

  public static match(order: orders.StampedOrder, matchAgainst: PriorityQueue[]): matchingEngine.MatchingResult {
    const isBuyOrder = order.quantity > 0;
    const matches: matchingEngine.OrderMatch[] = [];
    let remainingOrder: orders.StampedOrder | null = { ...order };

    const getMatchingQuantity = (remainingOrder, oppositeOrder) => isBuyOrder
      ? MatchingEngine.getMatchingQuantity(remainingOrder, oppositeOrder)
      : MatchingEngine.getMatchingQuantity(oppositeOrder, remainingOrder);

    matchAgainst.forEach((priorityQueue) => {
      while (remainingOrder && !priorityQueue.isEmpty()) {
        const oppositeOrder = priorityQueue.peek();
        const matchingQuantity = getMatchingQuantity(remainingOrder, oppositeOrder);
        if (matchingQuantity <= 0) {
          break;
        } else {
          const oppositeOrder = priorityQueue.poll();
          const oppositeOrderAbsQuantity = Math.abs(oppositeOrder.quantity);
          const remainingOrderAbsQuantity = Math.abs(remainingOrder.quantity);

          if (
            oppositeOrderAbsQuantity === matchingQuantity &&
            remainingOrderAbsQuantity === matchingQuantity
          ) { // order quantities are fully matching
            matches.push({ maker: oppositeOrder, taker: remainingOrder });
            remainingOrder = null;
          } else if (remainingOrderAbsQuantity === matchingQuantity) {  // maker order quantity is not sufficient. taker order will split
            const splitOrder = this.splitOrderByQuantity(oppositeOrder, matchingQuantity);
            matches.push({ maker: splitOrder.target, taker: remainingOrder });
            priorityQueue.add(splitOrder.remaining);
            remainingOrder = null;
          } else if (oppositeOrderAbsQuantity === matchingQuantity) { // taker order quantity is not sufficient. maker order will split
            const splitOrder = this.splitOrderByQuantity(remainingOrder, matchingQuantity);
            matches.push({ maker: oppositeOrder, taker: splitOrder.target });
            remainingOrder = splitOrder.remaining;
          } else {
            assert(false, 'matchingQuantity should not be lower than both orders quantity values');
          }
        }
      }
    });

    return {
      matches,
      remainingOrder,
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
        matchAgainst.unshift(this.priorityQueues.ownSellOrders);
        addTo = this.priorityQueues.ownBuyOrders;
      }
    } else {
      matchAgainst.push(this.priorityQueues.peerBuyOrders);
      if (this.internalMatching) {
        matchAgainst.unshift(this.priorityQueues.ownBuyOrders);
        addTo = this.priorityQueues.ownSellOrders;
      }
    }

    const matchingResult = MatchingEngine.match(order, matchAgainst);
    if (matchingResult.remainingOrder && addTo) {
      addTo.add(matchingResult.remainingOrder);
    }

    return matchingResult;
  }
}

export default MatchingEngine;
