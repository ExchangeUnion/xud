import assert from 'assert';
import FastPriorityQueue from 'fastpriorityqueue';
import { matchingEngine, orders } from '../types';
import { OrderingDirection } from '../types/enums';
import Logger from '../Logger';
import { isOwnOrder, StampedOrder, StampedOwnOrder, StampedPeerOrder } from '../types/orders';

type SplitOrder = {
  matched: StampedOrder;
  remaining: StampedOrder;
};

type orderId = string;

type OrderList<T extends orders.StampedOrder> = Map<orderId, T>;

type OrderSidesLists<T extends orders.StampedOrder> = {
  buy: OrderList<T>,
  sell: OrderList<T>,
};

type OrderSidesArrays<T extends orders.StampedOrder> = {
  buy: T[],
  sell: T[],
};

type OrderSidesQueues = {
  buy: FastPriorityQueue<StampedOrder>,
  sell: FastPriorityQueue<StampedOrder>,
};

/** A class to represent a matching engine responsible for matching orders for a given trading pair according to their price and quantity. */
class MatchingEngine {
  /** A pair of priority queues for the buy and sell sides of this trading pair */
  public queues: OrderSidesQueues;
  /** a pair of maps between active own orders ids and orders for the buy and sell sides of this trading pair. */
  public ownOrders: OrderSidesLists<orders.StampedOwnOrder>;
  /** a pair of maps between active peer orders ids and orders for the buy and sell sides of this trading pair. */
  public peerOrders: OrderSidesLists<orders.StampedPeerOrder>;

  constructor(private logger: Logger, public pairId: string) {
    this.queues = {
      buy: MatchingEngine.createPriorityQueue(OrderingDirection.Desc),
      sell: MatchingEngine.createPriorityQueue(OrderingDirection.Asc),
    };

    this.ownOrders = {
      buy: new Map<orderId, StampedOwnOrder>(),
      sell: new Map<orderId, StampedOwnOrder>(),
    };

    this.peerOrders = {
      buy: new Map<orderId, StampedPeerOrder>(),
      sell: new Map<orderId, StampedPeerOrder>(),
    };
  }

  private static createPriorityQueue = (orderingDirection: OrderingDirection): FastPriorityQueue<StampedOrder> => {
    const comparator = MatchingEngine.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  }

  public static getOrdersPriorityQueueComparator = (orderingDirection: OrderingDirection) => {
    const directionComparator = orderingDirection === OrderingDirection.Asc
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
      return Math.min(buyOrder.quantity, sellOrder.quantity);
    } else {
      return 0;
    }
  }

  /**
   * Split an order by quantity into a matched portion and a remaining portion.
   */
  public static splitOrderByQuantity = (order: StampedOrder, matchingQuantity: number): SplitOrder => {
    const { quantity } = order;
    assert(quantity > matchingQuantity, 'order quantity must be greater than matchingQuantity');

    return {
      matched: { ...order, quantity: matchingQuantity },
      remaining: { ...order, quantity: quantity - matchingQuantity },
    };
  }

  /**
   * Add peer order
   * @returns false if it's a duplicated order, otherwise true
   */
  public addPeerOrder = (order: StampedPeerOrder): boolean => {
    return this.addOrder(order, this.peerOrders);
  }

  /**
   * Match an order against its opposite queue, and optionally add the unmatched portion of the order to the queue.
   * @param discardRemaining whether to discard any unmatched portion of the order rather than add it to the queue
   * @returns a [[MatchingResult]] with the matches as well as the remaining, unmatched portion of the order
   */
  public matchOrAddOwnOrder = (order: StampedOwnOrder, discardRemaining: boolean): matchingEngine.MatchingResult => {
    const matchingResult = this.match(order);
    if (matchingResult.remainingOrder && !discardRemaining) {
      this.addOwnOrder(matchingResult.remainingOrder);
    }

    return matchingResult;
  }

  private addOwnOrder = (order: StampedOwnOrder): boolean => {
    return this.addOrder(order, this.ownOrders);
  }

  private addOrder = (order: StampedOrder, lists: OrderSidesLists<StampedOrder>): boolean => {
    const list = order.isBuy ? lists.buy : lists.sell;
    const queue = order.isBuy ? this.queues.buy : this.queues.sell;

    if (list.has(order.id)) {
      return false;
    } else {
      list.set(order.id, order);
      queue.add(order);
      return true;
    }
  }

  /**
   * Removes a quantity from a peer order. If the entire quantity is met, the order will be removed entirely.
   * @param quantityToRemove the quantity to remove, if undefined or if greater than or equal to the available
   * quantity then the entire order is removed
   * @returns the removed order or order portion, otherwise undefined if the order wasn't found
   */
  public removePeerOrderQuantity = (orderId: string, quantityToRemove?: number): StampedPeerOrder | undefined => {
    const order = this.peerOrders.buy.get(orderId) || this.peerOrders.sell.get(orderId);
    if (!order) {
      return;
    }

    if (quantityToRemove && quantityToRemove < order.quantity) {
      // if quantityToRemove is below the order quantity, reduce the order quantity
      // and return a copy of the order with the quantity that was removed
      order.quantity = order.quantity - quantityToRemove;
      return { ...order, quantity: quantityToRemove };
    } else {
      // otherwise, remove the order entirely, and return it
      this.removePeerOrder(order);
      return order;
    }
  }

  /**
   * Remove all orders given a peer pubKey.
   */
  public removePeerOrders = (peerPubKey: string): StampedPeerOrder[] => {
    const callback = (order: StampedOrder) => (order as StampedPeerOrder).peerPubKey === peerPubKey;

    // remove from queues
    const removedOrders = [
      ...this.queues.buy.removeMany(callback),
      ...this.queues.sell.removeMany(callback),
    ] as StampedPeerOrder[];

    // remove from lists. for further optimization, we can maintain a separate list for each peer pubKey
    removedOrders.forEach((order: StampedPeerOrder) => {
      const list = order.isBuy ? this.peerOrders.buy : this.peerOrders.sell;
      list.delete(order.id);
    });

    return removedOrders;
  }

  /**
   * Removes an own order by its global order id.
   * @returns the removed order, or undefined if no order with the provided id could be found
   */
  public removeOwnOrder = (orderId: string): StampedOwnOrder | undefined => {
    const order = this.ownOrders.buy.get(orderId) || this.ownOrders.sell.get(orderId);
    if (!order) {
      return;
    }

    this.removeOrder(order, this.ownOrders);
    return order;
  }

  private removePeerOrder = (order: StampedPeerOrder) => {
    this.removeOrder(order, this.peerOrders);
  }

  private removeOrder = (order: StampedOrder, lists: OrderSidesLists<StampedOrder>) => {
    const list = order.isBuy ? lists.buy : lists.sell;
    const queue = order.isBuy ? this.queues.buy : this.queues.sell;

    list.delete(order.id);
    queue.remove(order);
  }

  private getOrderList = (order: StampedOrder): OrderList<StampedOrder> => {
    if (isOwnOrder(order)) {
      return order.isBuy ? this.ownOrders.buy : this.ownOrders.sell;
    } else {
      return order.isBuy ? this.peerOrders.buy : this.peerOrders.sell;
    }
  }

  private getOrders = <T extends orders.StampedOrder>(lists: OrderSidesLists<T>): OrderSidesArrays<T> => {
    return {
      buy: Array.from(lists.buy.values()),
      sell: Array.from(lists.sell.values()),
    };
  }

  public getPeerOrders = () => {
    return this.getOrders(this.peerOrders);
  }

  public getOwnOrders = () => {
    return this.getOrders(this.ownOrders);
  }

  /**
   * Match an order against its opposite queue.
   * @returns a [[MatchingResult]] with the matches as well as the remaining, unmatched portion of the order
   */
  private match = (takerOrder: StampedOwnOrder): matchingEngine.MatchingResult => {
    const matches: matchingEngine.OrderMatch[] = [];
    /** The unmatched remaining taker order, if there is still leftover quantity after matching is complete it will enter the queue. */
    let remainingOrder: StampedOwnOrder | undefined = { ...takerOrder };

    const queue = takerOrder.isBuy ? this.queues.sell : this.queues.buy;
    const getMatchingQuantity = (remainingOrder: StampedOwnOrder, oppositeOrder: StampedOrder) => takerOrder.isBuy
      ? MatchingEngine.getMatchingQuantity(remainingOrder, oppositeOrder)
      : MatchingEngine.getMatchingQuantity(oppositeOrder, remainingOrder);

    // as long as we have remaining quantity to match and orders to match against, keep checking for matches
    while (remainingOrder && !queue.isEmpty()) {
      const oppositeOrder = queue.peek()!;
      const matchingQuantity = getMatchingQuantity(remainingOrder, oppositeOrder);
      if (matchingQuantity <= 0) {
        // there's no match with the best available maker order, so end the matching routine
        break;
      } else {
        // get the order from the top of the queue, and remove its ref from the list as well
        const makerOrder = queue.poll()!;
        const list = this.getOrderList(makerOrder);
        list.delete(makerOrder.id);

        if (
          makerOrder.quantity === matchingQuantity &&
          remainingOrder.quantity === matchingQuantity
        ) { // order quantities are fully matching
          matches.push({ maker: makerOrder, taker: remainingOrder });

          remainingOrder = undefined;
        } else if (remainingOrder.quantity === matchingQuantity) {  // taker order quantity is not sufficient. maker order will split
          const splitOrder = MatchingEngine.splitOrderByQuantity(makerOrder, matchingQuantity);
          matches.push({ maker: splitOrder.matched, taker: remainingOrder });

          // add the remaining order to the queue and the list
          queue.add(splitOrder.remaining);
          list.set(splitOrder.remaining.id, splitOrder.remaining);

          remainingOrder = undefined;
        } else if (makerOrder.quantity === matchingQuantity) { // maker order quantity is not sufficient. taker order will split
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
}

export default MatchingEngine;
export { OrderSidesArrays };
