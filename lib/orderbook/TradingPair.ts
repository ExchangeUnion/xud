import assert from 'assert';
import FastPriorityQueue from 'fastpriorityqueue';
import { matchingEngine, orders } from '../types';
import { OrderingDirection } from '../types/enums';
import Logger from '../Logger';
import { isOwnOrder, StampedOrder, StampedOwnOrder, StampedPeerOrder } from '../types/orders';
import errors from './errors';

type SplitOrder = {
  matched: StampedOrder;
  remaining: StampedOrder;
};

type OrderMap<T extends orders.StampedOrder> = Map<string, T>;

type OrderSidesMaps<T extends orders.StampedOrder> = {
  buy: OrderMap<T>,
  sell: OrderMap<T>,
};

type OrderSidesArrays<T extends orders.StampedOrder> = {
  buy: T[],
  sell: T[],
};

type OrderSidesQueues = {
  buy: FastPriorityQueue<StampedOrder>,
  sell: FastPriorityQueue<StampedOrder>,
};

/**
 * A class to represent a trading pair.
 * responsible for managing all active orders, and for matching orders according to their price and quantity.
 */
class TradingPair {
  /** A pair of priority queues for the buy and sell sides of this trading pair */
  public queues?: OrderSidesQueues;
  /** A pair of maps between active own orders ids and orders for the buy and sell sides of this trading pair. */
  public ownOrders: OrderSidesMaps<orders.StampedOwnOrder>;
  /** A map between peerPubKey and a pair of maps between active peer orders ids and orders for the buy and sell sides of this trading pair. */
  public peersOrders: Map<string, OrderSidesMaps<StampedPeerOrder>>;

  constructor(private logger: Logger, public pairId: string, private nomatching = true) {
    if (!nomatching) {
      this.queues = {
        buy: TradingPair.createPriorityQueue(OrderingDirection.Desc),
        sell: TradingPair.createPriorityQueue(OrderingDirection.Asc),
      };
    }

    this.ownOrders = {
      buy: new Map<string, StampedOwnOrder>(),
      sell: new Map<string, StampedOwnOrder>(),
    };

    this.peersOrders = new Map<string, OrderSidesMaps<StampedPeerOrder>>();
  }

  private static createPriorityQueue = (orderingDirection: OrderingDirection): FastPriorityQueue<StampedOrder> => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(orderingDirection);
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
    let peerOrdersMaps = this.peersOrders.get(order.peerPubKey);
    if (!peerOrdersMaps) {
      peerOrdersMaps = {
        buy: new Map<string, StampedPeerOrder>(),
        sell: new Map<string, StampedPeerOrder>(),
      };
      this.peersOrders.set(order.peerPubKey, peerOrdersMaps);
    }

    return this.addOrder(order, peerOrdersMaps);
  }

  public addOwnOrder = (order: StampedOwnOrder): boolean => {
    return this.addOrder(order, this.ownOrders);
  }

  private addOrder = (order: StampedOrder, maps: OrderSidesMaps<StampedOrder>): boolean => {
    const map = order.isBuy ? maps.buy : maps.sell;
    if (map.has(order.id)) {
      return false;
    }

    map.set(order.id, order);

    if (!this.nomatching) {
      const queue = order.isBuy ? this.queues!.buy : this.queues!.sell;
      queue.add(order);
    }

    return true;
  }

  /**
   * Remove all orders given a peer pubKey.
   */
  public removePeerOrders = (peerPubKey: string): StampedPeerOrder[] => {
    // if incoming peerPubKey is undefined or empty, don't even try to find it in order queues
    if (!peerPubKey) return [];

    const peerOrders = this.peersOrders.get(peerPubKey);
    if (!peerOrders) return [];

    if (!this.nomatching) {
      const callback = (order: StampedOrder) => (order as StampedPeerOrder).peerPubKey === peerPubKey;
      this.queues!.buy.removeMany(callback);
      this.queues!.sell.removeMany(callback);
    }

    this.peersOrders.delete(peerPubKey);
    return [...peerOrders.buy.values(), ...peerOrders.sell.values()];
  }

  /**
   * Removes all or part of a peer order.
   * @param quantityToRemove the quantity to remove, if undefined or if greater than or equal to the available
   * quantity then the entire order is removed
   * @returns the removed order or order portion, otherwise undefined if the order wasn't found
   */
  public removePeerOrder = (orderId: string, peerPubKey: string, quantityToRemove?: number): { order: StampedPeerOrder, fullyRemoved: boolean} => {
    const peerOrdersMaps = this.peersOrders.get(peerPubKey);
    if (!peerOrdersMaps) {
      throw errors.ORDER_NOT_FOUND(orderId);
    }
    return this.removeOrder(orderId, peerOrdersMaps, quantityToRemove);
  }

  /**
   * Removes all or part of an own order.
   * @param quantityToRemove the quantity to remove, if undefined or if greater than or equal to the available
   * quantity then the entire order is removed
   * @returns true if the entire order was removed, or false if only part of the order was removed
   */
  public removeOwnOrder = (orderId: string, quantityToRemove?: number): { order: StampedOwnOrder, fullyRemoved: boolean} => {
    return this.removeOrder(orderId, this.ownOrders, quantityToRemove);
  }

  private removeOrder = <T extends StampedOrder>(orderId: string, maps: OrderSidesMaps<StampedOrder>, quantityToRemove?: number):
    { order: T, fullyRemoved: boolean } => {
    const order = maps.buy.get(orderId) || maps.sell.get(orderId);
    if (!order) {
      throw errors.ORDER_NOT_FOUND(orderId);
    }

    if (quantityToRemove && quantityToRemove < order.quantity) {
      // if quantityToRemove is below the order quantity, reduce the order quantity
      order.quantity = order.quantity - quantityToRemove;
      this.logger.debug(`order quantity reduced by ${quantityToRemove}: ${orderId}`);
      return { order: { ...order, quantity: quantityToRemove } as T, fullyRemoved: false } ;
    } else {
      // otherwise, remove the order entirely
      const list = order.isBuy ? maps.buy : maps.sell;
      list.delete(order.id);

      if (!this.nomatching) {
        const queue = order.isBuy ? this.queues!.buy : this.queues!.sell;
        queue.remove(order);
      }

      this.logger.debug(`order removed: ${orderId}`);
      return { order: order as T, fullyRemoved: true };
    }
  }

  private getOrderMap = (order: StampedOrder): OrderMap<StampedOrder> | undefined => {
    if (isOwnOrder(order)) {
      return order.isBuy ? this.ownOrders.buy : this.ownOrders.sell;
    } else {
      const peerOrdersMaps = this.peersOrders.get(order.peerPubKey);
      if (!peerOrdersMaps) return;
      return order.isBuy ? peerOrdersMaps.buy : peerOrdersMaps.sell;
    }
  }

  private getOrders = <T extends orders.StampedOrder>(lists: OrderSidesMaps<T>): OrderSidesArrays<T> => {
    return {
      buy: Array.from(lists.buy.values()),
      sell: Array.from(lists.sell.values()),
    };
  }

  public getPeersOrders = (): OrderSidesArrays<StampedPeerOrder> => {
    const res: OrderSidesArrays<StampedPeerOrder> = { buy: [], sell: [] };
    this.peersOrders.forEach((peerOrders) => {
      const peerOrdersArrs = this.getOrders(peerOrders);
      res.buy = res.buy.concat(peerOrdersArrs.buy);
      res.sell = res.sell.concat(peerOrdersArrs.sell);
    });

    return res;
  }

  public getOwnOrders = (): OrderSidesArrays<StampedOwnOrder> => {
    return this.getOrders(this.ownOrders);
  }

  public getOwnOrder = (orderId: string): StampedOwnOrder => {
    const order =  this.getOrder(orderId, this.ownOrders);
    if (!order) {
      throw errors.ORDER_NOT_FOUND(orderId);
    }

    return order;
  }

  public getPeerOrder = (orderId: string, peerPubKey: string): StampedPeerOrder => {
    const peerOrders = this.peersOrders.get(peerPubKey);
    if (!peerOrders) {
      throw errors.ORDER_NOT_FOUND(`${peerPubKey}/${orderId}`);
    }

    const order = this.getOrder(orderId, peerOrders);
    if (!order) {
      throw errors.ORDER_NOT_FOUND(`${peerPubKey}/${orderId}`);
    }

    return order;
  }

  private getOrder = <T extends StampedOrder>(orderId: string, maps: OrderSidesMaps<T>): T | undefined => {
    return maps.buy.get(orderId) || maps.sell.get(orderId);
  }

  /**
   * Match an order against its opposite queue. Matched maker orders will be removed from the repository
   * @returns a [[MatchingResult]] with the matches as well as the remaining, unmatched portion of the order
   */
  public match = (takerOrder: StampedOwnOrder): matchingEngine.MatchingResult => {
    assert(!this.nomatching);

    const matches: matchingEngine.OrderMatch[] = [];
    /** The unmatched remaining taker order, if there is still leftover quantity after matching is complete it will enter the queue. */
    let remainingOrder: StampedOwnOrder | undefined = { ...takerOrder };

    const queue = takerOrder.isBuy ? this.queues!.sell : this.queues!.buy;
    const getMatchingQuantity = (remainingOrder: StampedOwnOrder, oppositeOrder: StampedOrder) => takerOrder.isBuy
      ? TradingPair.getMatchingQuantity(remainingOrder, oppositeOrder)
      : TradingPair.getMatchingQuantity(oppositeOrder, remainingOrder);

    // as long as we have remaining quantity to match and orders to match against, keep checking for matches
    while (remainingOrder && !queue.isEmpty()) {
      const oppositeOrder = queue.peek()!;
      const matchingQuantity = getMatchingQuantity(remainingOrder, oppositeOrder);
      if (matchingQuantity <= 0) {
        // there's no match with the best available maker order, so end the matching routine
        break;
      } else {
        // get the order from the top of the queue, and remove its ref from the map as well
        const makerOrder = queue.poll()!;
        const map = this.getOrderMap(makerOrder);
        if (!map) break;
        map.delete(makerOrder.id);

        if (
          makerOrder.quantity === matchingQuantity &&
          remainingOrder.quantity === matchingQuantity
        ) { // order quantities are fully matching
          matches.push({ maker: makerOrder, taker: remainingOrder });

          remainingOrder = undefined;
        } else if (remainingOrder.quantity === matchingQuantity) {  // taker order quantity is not sufficient. maker order will split
          const splitOrder = TradingPair.splitOrderByQuantity(makerOrder, matchingQuantity);
          matches.push({ maker: splitOrder.matched, taker: remainingOrder });

          // add the remaining order to the queue and the list
          queue.add(splitOrder.remaining);
          map.set(splitOrder.remaining.id, splitOrder.remaining);

          remainingOrder = undefined;
        } else if (makerOrder.quantity === matchingQuantity) { // maker order quantity is not sufficient. taker order will split
          const splitOrder = TradingPair.splitOrderByQuantity(remainingOrder, matchingQuantity);
          matches.push({ maker: makerOrder, taker: splitOrder.matched as StampedOwnOrder });
          remainingOrder = splitOrder.remaining as StampedOwnOrder;
        } else {
          assert(false, 'matchingQuantity should not be lower than both orders quantity values');
        }
      }
    }

    return { matches, remainingOrder };
  }
}

export default TradingPair;
export { OrderSidesArrays };
