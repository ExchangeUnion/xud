import assert from 'assert';
import FastPriorityQueue from '@exchangeunion/fastpriorityqueue';

import { matchingEngine } from '../types';
import { OrderingDirection } from '../types/enums';
import Logger from '../Logger';
import { StampedOrder, StampedOwnOrder, StampedPeerOrder } from '../types/orders';

type PriorityQueues = {
  buyOrders: FastPriorityQueue<StampedOrder>;
  sellOrders: FastPriorityQueue<StampedOrder>;
};

type SplitOrder = {
  target: StampedOrder;
  remaining: StampedOrder;
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

  private static createPriorityQueue(orderingDirection: OrderingDirection): FastPriorityQueue<StampedOrder> {
    const comparator = this.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  }

  public static getOrdersPriorityQueueComparator(orderingDirection: OrderingDirection) {
    const directionComparator = orderingDirection === OrderingDirection.ASC
      ? (a: number, b: number) => a < b
      : (a: number, b: number) => a > b;

    return (a: StampedOrder, b: StampedOrder) => {
      if (a.price === b.price) {
        return a.createdAt < b.createdAt;
      } else {
        return directionComparator(a.price, b.price);
      }
    };
  }

  public static getMatchingQuantity = (buyOrder: StampedOrder, sellOrder: StampedOrder): number => {
    if (buyOrder.price >= sellOrder.price) {
      return Math.min(buyOrder.quantity, sellOrder.quantity * -1);
    } else {
      return 0;
    }
  }

  public static splitOrderByQuantity = (order: StampedOrder, targetQuantity: number): SplitOrder => {
    const { quantity } = order;
    const absQuantity = Math.abs(quantity);
    assert(absQuantity > targetQuantity, 'order abs quantity should be higher than targetQuantity');

    const direction = quantity / absQuantity;
    return {
      target: { ...order, quantity: targetQuantity * direction },
      remaining: { ...order, quantity: quantity - (targetQuantity * direction) },
    };
  }

  public static match(order: StampedOwnOrder, matchAgainst: FastPriorityQueue<StampedOrder>[]): matchingEngine.MatchingResult {
    const isBuyOrder = order.quantity > 0;
    const matches: matchingEngine.OrderMatch[] = [];
    let remainingOrder: StampedOwnOrder | null = { ...order };

    const getMatchingQuantity = (remainingOrder: StampedOwnOrder, oppositeOrder: StampedOrder) => isBuyOrder
      ? MatchingEngine.getMatchingQuantity(remainingOrder, oppositeOrder)
      : MatchingEngine.getMatchingQuantity(oppositeOrder, remainingOrder);

    matchAgainst.forEach((priorityQueue) => {
      while (remainingOrder && !priorityQueue.isEmpty()) {
        const oppositeOrder = priorityQueue.peek();
        const matchingQuantity = getMatchingQuantity(remainingOrder, oppositeOrder!);
        if (matchingQuantity <= 0) {
          break;
        } else {
          const oppositeOrder = priorityQueue.poll()!;
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
            remainingOrder = splitOrder.remaining as StampedOwnOrder;
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

  public addPeerOrder = (order: StampedPeerOrder): void => {
    (order.quantity > 0
      ? this.priorityQueues.buyOrders
      : this.priorityQueues.sellOrders
    ).add(order);
  }

  public matchOrAddOwnOrder = (order: StampedOwnOrder, discardRemaining: boolean): matchingEngine.MatchingResult => {
    const isBuyOrder = order.quantity > 0;
    let matchAgainst: FastPriorityQueue<StampedOrder> | undefined ;
    let addTo: FastPriorityQueue<StampedOrder> | undefined;

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

  public removeOwnOrder = (orderId: string): StampedOwnOrder | undefined => {
    return this.removeOrder(orderId) as StampedOwnOrder | undefined;
  }

  public removePeerOrder = (orderId: string, quantityToDecrease?: number): StampedPeerOrder | undefined => {
    const order = this.removeOrder(orderId) as StampedPeerOrder | undefined;

    if (order && quantityToDecrease) {
      order.quantity = order.quantity - quantityToDecrease;
      this.addPeerOrder(order);

      // Return how much was removed
      return { ...order, quantity: quantityToDecrease };
    }

    return order;
  }

  public removePeerOrders = (peerId: string): StampedPeerOrder[] => {
    const callback = (order: StampedOrder) => {
      return (order as StampedPeerOrder).peerId === peerId;
    };

    return [
      ...this.priorityQueues.buyOrders.removeMany(callback),
      ...this.priorityQueues.sellOrders.removeMany(callback),
    ] as StampedPeerOrder[];
  }

  public isEmpty = (): boolean => {
    return this.priorityQueues.buyOrders.isEmpty() && this.priorityQueues.sellOrders.isEmpty();
  }

  private removeOrder = (orderId: string): StampedOrder | undefined => {
    return this.priorityQueues.buyOrders.removeOne(order => order.id === orderId) ||
      this.priorityQueues.sellOrders.removeOne(order => order.id === orderId);
  }
}

export default MatchingEngine;
