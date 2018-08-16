import assert from 'assert';
import FastPriorityQueue from 'fastpriorityqueue';
import { matchingEngine } from '../types';
import { OrderingDirection } from '../types/enums';
import Logger from '../Logger';
import { StampedOrder, StampedOwnOrder, StampedPeerOrder } from '../types/orders';

type SplitOrder = {
  matched: StampedOrder;
  remaining: StampedOrder;
};

/** A class to represent a matching engine responsible for matching orders for a given trading pair according to their price and quantity. */
class MatchingEngine {
  public buyOrders: FastPriorityQueue<StampedOrder>;
  public sellOrders: FastPriorityQueue<StampedOrder>;

  constructor(private logger: Logger, public pairId: string) {
    this.buyOrders = MatchingEngine.createPriorityQueue(OrderingDirection.DESC);
    this.sellOrders = MatchingEngine.createPriorityQueue(OrderingDirection.ASC);
  }

  private static createPriorityQueue = (orderingDirection: OrderingDirection): FastPriorityQueue<StampedOrder> => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  }

  public static getOrdersPriorityQueueComparator = (orderingDirection: OrderingDirection) => {
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

  /**
   * Get the matching quantity between two orders.
   * @returns the smaller of the quantity between the two orders if their price matches, 0 otherwise
   */
  public static getMatchingQuantity = (buyOrder: StampedOrder, sellOrder: StampedOrder): number => {
    if (buyOrder.price >= sellOrder.price) {
      return Math.min(buyOrder.quantity, sellOrder.quantity * -1);
    } else {
      return 0;
    }
  }

  /**
   * Split an order by quantity into a matched portion and a remaining portion.
   */
  public static splitOrderByQuantity = (order: StampedOrder, matchingQuantity: number): SplitOrder => {
    const { quantity } = order;
    const absQuantity = Math.abs(quantity);
    assert(absQuantity > matchingQuantity, 'order abs quantity must be greater than matchingQuantity');

    const direction = quantity / absQuantity;
    return {
      matched: { ...order, quantity: matchingQuantity * direction },
      remaining: { ...order, quantity: quantity - (matchingQuantity * direction) },
    };
  }

  /**
   * Match an order against its opposite queue, and optionally add the unmatched portion of the order to the queue.
   * @param discardRemaining whether to discard any unmatched portion of the order rather than add it to the queue
   * @returns a [[MatchingResult]] with the matches as well as the remaining, unmatched portion of the order
   */
  public matchOrAddOwnOrder = (order: StampedOwnOrder, discardRemaining: boolean): matchingEngine.MatchingResult => {
    const isBuyOrder = order.quantity > 0;
    const addTo = isBuyOrder ? this.buyOrders : this.sellOrders;

    const matchingResult = this.match(order);
    if (matchingResult.remainingOrder && !discardRemaining) {
      addTo.add(matchingResult.remainingOrder);
    }

    return matchingResult;
  }

  /**
   * Match an order against its opposite queue.
   * @returns a [[MatchingResult]] with the matches as well as the remaining, unmatched portion of the order
   */
  public match = (takerOrder: StampedOwnOrder): matchingEngine.MatchingResult => {
    const isBuyOrder = takerOrder.quantity > 0;
    const matches: matchingEngine.OrderMatch[] = [];
    /** The unmatched remaining taker order, if there is still leftover quantity after matching is complete it will enter the queue. */
    let remainingOrder: StampedOwnOrder | undefined = { ...takerOrder };

    const matchAgainst = isBuyOrder ? this.sellOrders : this.buyOrders;
    const getMatchingQuantity = (remainingOrder: StampedOwnOrder, oppositeOrder: StampedOrder) => isBuyOrder
      ? MatchingEngine.getMatchingQuantity(remainingOrder, oppositeOrder)
      : MatchingEngine.getMatchingQuantity(oppositeOrder, remainingOrder);

    // as long as we have remaining quantity to match and orders to match against, keep checking for matches
    while (remainingOrder && !matchAgainst.isEmpty()) {
      const oppositeOrder = matchAgainst.peek()!;
      const matchingQuantity = getMatchingQuantity(remainingOrder, oppositeOrder);
      if (matchingQuantity <= 0) {
        // there's no match with the best available maker order, so end the matching routine
        break;
      } else {
        const makerOrder = matchAgainst.poll()!;
        const makerOrderAbsQuantity = Math.abs(makerOrder.quantity);
        const remainingOrderAbsQuantity = Math.abs(remainingOrder.quantity);
        if (
          makerOrderAbsQuantity === matchingQuantity &&
          remainingOrderAbsQuantity === matchingQuantity
        ) { // order quantities are fully matching
          matches.push({ maker: makerOrder, taker: remainingOrder });
          remainingOrder = undefined;
        } else if (remainingOrderAbsQuantity === matchingQuantity) {  // maker order quantity is not sufficient. taker order will split
          const splitOrder = MatchingEngine.splitOrderByQuantity(makerOrder, matchingQuantity);
          matches.push({ maker: splitOrder.matched, taker: remainingOrder });
          matchAgainst.add(splitOrder.remaining);
          remainingOrder = undefined;
        } else if (makerOrderAbsQuantity === matchingQuantity) { // taker order quantity is not sufficient. maker order will split
          const splitOrder = MatchingEngine.splitOrderByQuantity(remainingOrder, matchingQuantity);
          matches.push({ maker: makerOrder, taker: splitOrder.matched });
          remainingOrder = splitOrder.remaining as StampedOwnOrder;
        } else {
          assert(false, 'matchingQuantity should not be lower than both orders quantity values');
        }
      }
    }

    return { matches, remainingOrder };
  }

  public addPeerOrder = (order: StampedPeerOrder): void => {
    (order.quantity > 0
      ? this.buyOrders
      : this.sellOrders
    ).add(order);
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

  /**
   * Remove all orders from the queue matching the given peer id.
   */
  public removePeerOrders = (peerPubKey: string): StampedPeerOrder[] => {
    const callback = (order: StampedOrder) => {
      return (order as StampedPeerOrder).peerPubKey === peerPubKey;
    };

    return [
      ...this.buyOrders.removeMany(callback),
      ...this.sellOrders.removeMany(callback),
    ] as StampedPeerOrder[];
  }

  /**
   * Check whether the matching queue is empty.
   * @returns true if both the buy orders and sell orders queues are empty, otherwise false
   */
  public isEmpty = (): boolean => {
    return this.buyOrders.isEmpty() && this.sellOrders.isEmpty();
  }

  private removeOrder = (orderId: string): StampedOrder | undefined => {
    return this.buyOrders.removeOne(order => order.id === orderId) ||
      this.sellOrders.removeOne(order => order.id === orderId);
  }
}

export default MatchingEngine;
