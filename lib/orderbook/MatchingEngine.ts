import assert from 'assert';
import FastPriorityQueue from 'fastpriorityqueue';

import { orders, matchingEngine } from '../types';
import { OrderingDirection } from '../types/enums';
import Logger from '../Logger';

type PriorityQueue = {
  add: Function;
  removeOne: Function;
  removeMany: Function;
  heapify: Function;
  peek: Function;
  poll: Function;
  trim: Function;
  isEmpty: Function;
  has: Function;
};

type PriorityQueues = {
  buyOrders: PriorityQueue;
  sellOrders: PriorityQueue;
};

type SplitOrder = {
  target: orders.StampedOrder;
  remaining: orders.StampedOrder;
};

class MatchingEngine {
  public priorityQueues: PriorityQueues;
  private logger: Logger = Logger.orderbook;

  constructor(public pairId: string) {
    this.priorityQueues = {
      buyOrders: MatchingEngine.createPriorityQueue(OrderingDirection.DESC),
      sellOrders: MatchingEngine.createPriorityQueue(OrderingDirection.ASC),
    };
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
      ? this.priorityQueues.buyOrders
      : this.priorityQueues.sellOrders
    ).add(order);
  }

  public matchOrAddOwnOrder = (order: orders.StampedOwnOrder, discardRemaining: boolean): matchingEngine.MatchingResult => {
    const isBuyOrder = order.quantity > 0;
    let matchAgainst: PriorityQueue | null = null;
    let addTo: PriorityQueue | null = null;

    if (isBuyOrder) {
      matchAgainst = this.priorityQueues.sellOrders;
      addTo = this.priorityQueues.buyOrders;
    } else {
      matchAgainst = this.priorityQueues.buyOrders;
      addTo = this.priorityQueues.sellOrders;
    }

    const matchingResult = MatchingEngine.match(order, [matchAgainst]);
    if (matchingResult.remainingOrder && addTo && !discardRemaining) {
      addTo.add(matchingResult.remainingOrder);
    }

    return matchingResult;
  }

  public removeOwnOrder = (orderId: string): orders.StampedOwnOrder | null => {
    return this.priorityQueues.buyOrders.removeOne(order => order.id === orderId) ||
      this.priorityQueues.sellOrders.removeOne(order => order.id === orderId);
  }

  public isEmpty = (): boolean => {
    return this.priorityQueues.buyOrders.isEmpty() && this.priorityQueues.sellOrders.isEmpty();
  }
}

export default MatchingEngine;
