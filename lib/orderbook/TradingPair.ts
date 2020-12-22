import assert from 'assert';
import { EventEmitter } from 'events';
import FastPriorityQueue from 'fastpriorityqueue';
import { OrderingDirection } from '../constants/enums';
import Logger from '../Logger';
import errors from './errors';
import { isOwnOrder, MatchingResult, Order, OrderMatch, OwnOrder, PeerOrder } from './types';

/** A map between orders and their order ids. */
type OrderMap<T extends Order> = Map<string, T>;

type OrderSidesMaps<T extends Order> = {
  buyMap: OrderMap<T>;
  sellMap: OrderMap<T>;
};

type OrderSidesArrays<T extends Order> = {
  buyArray: T[];
  sellArray: T[];
};

type OrderSidesQueues = {
  buyQueue: FastPriorityQueue<Order>;
  sellQueue: FastPriorityQueue<Order>;
};

interface TradingPair {
  /** Adds a listener to be called when a local order was fully removed. */
  on(event: 'ownOrder.fullyRemoved', listener: (order: OwnOrder) => void): this;

  /** Notifies listeners that a local order was fully removed. */
  emit(event: 'ownOrder.fullyRemoved', order: OwnOrder): boolean;
}

/**
 * Represents a single trading pair in the order book. Responsible for managing all active orders
 * and for matching orders according to their price and quantity.
 */
class TradingPair extends EventEmitter {
  /** A pair of priority queues for the buy and sell sides of this trading pair */
  public queues?: OrderSidesQueues;
  /** A pair of maps between active own orders ids and orders for the buy and sell sides of this trading pair. */
  public ownOrders: OrderSidesMaps<OwnOrder>;
  /** A map between peerPubKey and a pair of maps between active peer orders ids and orders for the buy and sell sides of this trading pair. */
  public peersOrders: Map<string, OrderSidesMaps<PeerOrder>>;

  /** The minimum quantity for both sides of a trade that is considered swappable and not dust. */
  public static QUANTITY_DUST_LIMIT = 100;

  constructor(private logger: Logger, public pairId: string, private nomatching = false) {
    super();

    if (!nomatching) {
      this.queues = {
        buyQueue: TradingPair.createPriorityQueue(OrderingDirection.Desc),
        sellQueue: TradingPair.createPriorityQueue(OrderingDirection.Asc),
      };
    }

    this.ownOrders = {
      buyMap: new Map<string, OwnOrder>(),
      sellMap: new Map<string, OwnOrder>(),
    };

    this.peersOrders = new Map<string, OrderSidesMaps<PeerOrder>>();
  }

  private static createPriorityQueue = (orderingDirection: OrderingDirection): FastPriorityQueue<Order> => {
    const comparator = TradingPair.getOrdersPriorityQueueComparator(orderingDirection);
    return new FastPriorityQueue(comparator);
  };

  public static getOrdersPriorityQueueComparator = (orderingDirection: OrderingDirection) => {
    const directionComparator =
      orderingDirection === OrderingDirection.Asc ? (a: number, b: number) => a < b : (a: number, b: number) => a > b;

    return (a: Order, b: Order) => {
      if (a.price === b.price) {
        if (isOwnOrder(a) && !isOwnOrder(b)) {
          return true;
        } else if (!isOwnOrder(a) && isOwnOrder(b)) {
          return false;
        } else {
          return a.createdAt < b.createdAt;
        }
      } else {
        return directionComparator(a.price, b.price);
      }
    };
  };

  /**
   * Gets the quantity that can be matched between two orders.
   * @returns the smaller of the quantity between the two orders if their price matches, 0 otherwise
   */
  private static getMatchingQuantity = (order1: Order, order2: Order): number => {
    assert(order1.isBuy !== order2.isBuy, 'cannot get matching quantity from orders that are both sells or both buys');
    let buyOrder: Order;
    let sellOrder: Order;
    if (order1.isBuy) {
      buyOrder = order1;
      sellOrder = order2;
    } else {
      buyOrder = order2;
      sellOrder = order1;
    }

    if (buyOrder.price >= sellOrder.price) {
      return Math.min(buyOrder.quantity, sellOrder.quantity);
    } else {
      return 0;
    }
  };

  /**
   * Splits an order by quantity into a matched portion and subtracts the matched quantity from the original order.
   * @param order the order that is being split
   * @param matchingQuantity the quantity for the split order and to subtract from the original order
   * @returns the split portion of the order with the matching quantity
   */
  private static splitOrderByQuantity = <T extends Order>(order: T, matchingQuantity: number): T => {
    assert(order.quantity > matchingQuantity, 'order quantity must be greater than matchingQuantity');

    order.quantity -= matchingQuantity;
    const matchedOrder = { ...order, quantity: matchingQuantity };
    return matchedOrder;
  };

  /**
   * Adds a peer order for this trading pair.
   * @returns `true` if the order was added, `false` if it could not be added because there
   * already exists an order with the same order id
   */
  public addPeerOrder = (order: PeerOrder): boolean => {
    let peerOrdersMaps = this.peersOrders.get(order.peerPubKey);
    if (!peerOrdersMaps) {
      peerOrdersMaps = {
        buyMap: new Map<string, PeerOrder>(),
        sellMap: new Map<string, PeerOrder>(),
      };
      this.peersOrders.set(order.peerPubKey, peerOrdersMaps);
    }

    return this.addOrder(order, peerOrdersMaps);
  };

  /**
   * Adds an own order for this trading pair.
   * @returns `true` if the order was added, `false` if it could not be added because there
   * already exists an order with the same order id
   */
  public addOwnOrder = (order: OwnOrder): boolean => {
    return this.addOrder(order, this.ownOrders);
  };

  /**
   * Attempts to add an order for this trading pair.
   * @returns `true` if the order was added, `false` if it could not be added because there
   * already exists an order with the same order id
   */
  private addOrder = (order: Order, maps: OrderSidesMaps<Order>): boolean => {
    const map = order.isBuy ? maps.buyMap : maps.sellMap;
    if (map.has(order.id)) {
      return false;
    }

    map.set(order.id, order);
    this.logger.trace(`order added: ${JSON.stringify(order)}`);

    if (!this.nomatching) {
      const queue = order.isBuy ? this.queues!.buyQueue : this.queues!.sellQueue;
      queue.add(order);
    }

    return true;
  };

  /**
   * Removes all of a peer's orders.
   * @param peerPubKey the node pub key of the peer
   */
  public removePeerOrders = (peerPubKey?: string): PeerOrder[] => {
    // if incoming peerPubKey is undefined or empty, don't even try to find it in order queues
    if (!peerPubKey) return [];

    const peerOrders = this.peersOrders.get(peerPubKey);
    if (!peerOrders) return [];

    if (!this.nomatching) {
      const callback = (order: Order) => (order as PeerOrder).peerPubKey === peerPubKey;
      this.queues!.buyQueue.removeMany(callback);
      this.queues!.sellQueue.removeMany(callback);
    }

    this.peersOrders.delete(peerPubKey);
    return [...peerOrders.buyMap.values(), ...peerOrders.sellMap.values()];
  };

  /**
   * Removes all or part of a peer order.
   * @param quantityToRemove the quantity to remove, if undefined or if greater than or equal to the available
   * quantity then the entire order is removed
   * @returns the portion of the order that was removed, and a flag indicating whether the entire order was removed
   */
  public removePeerOrder = (orderId: string, peerPubKey?: string, quantityToRemove?: number): PeerOrder => {
    let peerOrdersMaps: OrderSidesMaps<PeerOrder> | undefined;

    if (peerPubKey) {
      peerOrdersMaps = this.peersOrders.get(peerPubKey);
    } else {
      // if not given a peerPubKey, we must check all peer order maps for the specified orderId
      for (const orderSidesMaps of this.peersOrders.values()) {
        if (orderSidesMaps.buyMap.has(orderId) || orderSidesMaps.sellMap.has(orderId)) {
          peerOrdersMaps = orderSidesMaps;
          break;
        }
      }
    }

    if (!peerOrdersMaps) {
      throw errors.ORDER_NOT_FOUND(orderId);
    }
    return this.removeOrder(orderId, peerOrdersMaps, quantityToRemove);
  };

  /**
   * Removes all or part of an own order.
   * @param quantityToRemove the quantity to remove, if undefined or if greater than or equal to the available
   * quantity then the entire order is removed
   * @returns the portion of the order that was removed, and a flag indicating whether the entire order was removed
   */
  public removeOwnOrder = (orderId: string, quantityToRemove?: number): OwnOrder => {
    return this.removeOrder(orderId, this.ownOrders, quantityToRemove);
  };

  /**
   * Removes all or part of an order.
   * @param quantityToRemove the quantity to remove, if undefined or if greater than or equal to the available
   * quantity then the entire order is removed
   * @returns the portion of the order that was removed, and a flag indicating whether the entire order was removed
   */
  private removeOrder = <T extends Order>(
    orderId: string,
    maps: OrderSidesMaps<Order>,
    quantityToRemove?: number,
  ): T => {
    assert(quantityToRemove === undefined || quantityToRemove > 0, 'quantityToRemove cannot be 0 or negative');
    const order = maps.buyMap.get(orderId) || maps.sellMap.get(orderId);
    if (!order) {
      throw errors.ORDER_NOT_FOUND(orderId);
    }

    if (quantityToRemove && quantityToRemove < order.quantity) {
      const remainingQuantity = order.quantity - quantityToRemove;
      if (
        remainingQuantity < TradingPair.QUANTITY_DUST_LIMIT ||
        remainingQuantity * order.price < TradingPair.QUANTITY_DUST_LIMIT
      ) {
        // the remaining quantity doesn't meet the dust limit, so we remove the entire order
        this.logger.trace(`removing entire order ${orderId} because remaining quantity does not meet dust limit`);
      } else {
        // if quantityToRemove is below the order quantity but above dust limit, reduce the order quantity
        if (isOwnOrder(order)) {
          assert(
            quantityToRemove <= order.quantity - order.hold,
            'cannot remove more than available quantity after holds',
          );
        }
        order.quantity -= quantityToRemove;
        this.logger.trace(`order quantity reduced by ${quantityToRemove}: ${orderId}`);
        return { ...order, quantity: quantityToRemove } as T;
      }
    }

    // otherwise, remove the order entirely
    if (isOwnOrder(order)) {
      assert(order.hold === 0, 'cannot remove an order with a hold');
      this.emit('ownOrder.fullyRemoved', order);
    }

    const startingQuantity = order.quantity;
    order.quantity = 0;
    const map = order.isBuy ? maps.buyMap : maps.sellMap;
    map.delete(order.id);

    if (!this.nomatching) {
      const queue = order.isBuy ? this.queues!.buyQueue : this.queues!.sellQueue;
      queue.remove(order);
    }

    this.logger.trace(`order removed: ${orderId}`);
    return { ...order, quantity: startingQuantity } as T;
  };

  private getOrderMap = (order: Order): OrderMap<Order> | undefined => {
    if (isOwnOrder(order)) {
      return order.isBuy ? this.ownOrders.buyMap : this.ownOrders.sellMap;
    } else {
      const peerOrdersMaps = this.peersOrders.get(order.peerPubKey);
      if (!peerOrdersMaps) {
        return undefined;
      }
      return order.isBuy ? peerOrdersMaps.buyMap : peerOrdersMaps.sellMap;
    }
  };

  private getOrders = <T extends Order>(lists: OrderSidesMaps<T>): OrderSidesArrays<T> => {
    return {
      buyArray: Array.from(lists.buyMap.values()),
      sellArray: Array.from(lists.sellMap.values()),
    };
  };

  public getPeersOrders = (): OrderSidesArrays<PeerOrder> => {
    const res: OrderSidesArrays<PeerOrder> = { buyArray: [], sellArray: [] };
    this.peersOrders.forEach((peerOrders) => {
      const peerOrdersArrs = this.getOrders(peerOrders);
      res.buyArray = res.buyArray.concat(peerOrdersArrs.buyArray);
      res.sellArray = res.sellArray.concat(peerOrdersArrs.sellArray);
    });

    return res;
  };

  public getOwnOrders = (): OrderSidesArrays<OwnOrder> => {
    return this.getOrders(this.ownOrders);
  };

  public getOwnOrder = (orderId: string): OwnOrder => {
    const order = this.getOrder(orderId, this.ownOrders);
    if (!order) {
      throw errors.ORDER_NOT_FOUND(orderId);
    }

    return order;
  };

  public getPeerOrder = (orderId: string, peerPubKey: string): PeerOrder => {
    const peerOrders = this.peersOrders.get(peerPubKey);
    if (!peerOrders) {
      throw errors.ORDER_NOT_FOUND(orderId, peerPubKey);
    }

    const order = this.getOrder(orderId, peerOrders);
    if (!order) {
      throw errors.ORDER_NOT_FOUND(orderId, peerPubKey);
    }

    return order;
  };

  private getOrder = <T extends Order>(orderId: string, maps: OrderSidesMaps<T>): T | undefined => {
    return maps.buyMap.get(orderId) || maps.sellMap.get(orderId);
  };

  public addOrderHold = (orderId: string, holdAmount?: number) => {
    const order = this.getOwnOrder(orderId);
    if (holdAmount === undefined) {
      if (order.hold > 0) {
        // we can't put an entire order on hold if part of it is already on hold
        throw errors.QUANTITY_ON_HOLD(order.localId, order.hold);
      }
      order.hold = order.quantity;
      this.logger.trace(`placed entire order ${orderId} on hold`);
    } else {
      assert(holdAmount > 0);
      assert(
        order.hold + holdAmount <= order.quantity,
        'the amount of an order on hold cannot exceed the available quantity',
      );
      order.hold += holdAmount;
      this.logger.trace(`added hold of ${holdAmount} on order ${orderId}`);
    }
  };

  public removeOrderHold = (orderId: string, holdAmount?: number) => {
    const order = this.getOwnOrder(orderId);
    if (holdAmount === undefined) {
      assert(order.hold > 0);
      order.hold = 0;
      this.logger.trace(`removed entire hold on order ${orderId}`);
    } else {
      assert(holdAmount > 0);
      assert(order.hold >= holdAmount, 'cannot remove more than is currently on hold for an order');
      order.hold -= holdAmount;
      this.logger.trace(`removed hold of ${holdAmount} on order ${orderId}`);
    }
  };

  public quoteBid = () => {
    return this.queues?.buyQueue.peek()?.price ?? 0;
  };

  public quoteAsk = () => {
    return this.queues?.sellQueue.peek()?.price ?? Number.POSITIVE_INFINITY;
  };

  /**
   * Matches an order against its opposite queue. Matched maker orders are removed immediately.
   * @returns a [[MatchingResult]] with the matches as well as the remaining, unmatched portion of the order
   */
  public match = (takerOrder: OwnOrder): MatchingResult => {
    assert(!this.nomatching);

    const matches: OrderMatch[] = [];
    /** The unmatched remaining taker order, if there is still leftover quantity after matching is complete it will enter the queue. */
    let remainingOrder: OwnOrder | undefined = { ...takerOrder };

    const queue = takerOrder.isBuy ? this.queues!.sellQueue : this.queues!.buyQueue;
    const queueRemovedOrdersWithHold: OwnOrder[] = [];

    // as long as we have remaining quantity to match and orders to match against, keep checking for matches
    while (remainingOrder && !queue.isEmpty()) {
      // get the best available maker order from the top of the queue
      const makerOrder = queue.peek()!;
      const makerAvailableQuantityOrder = isOwnOrder(makerOrder)
        ? {
            ...makerOrder,
            quantity: makerOrder.quantity - makerOrder.hold,
            hold: 0,
          }
        : makerOrder;

      const matchingQuantity = TradingPair.getMatchingQuantity(remainingOrder, makerAvailableQuantityOrder);
      if (matchingQuantity * makerOrder.price < TradingPair.QUANTITY_DUST_LIMIT) {
        // there's no match with the best available maker order OR there's a match
        // but it doesn't meet the dust minimum on both sides of the trade
        if (isOwnOrder(makerOrder) && makerOrder.hold > 0) {
          // part of this order is on hold, so put it aside and try to match the next order
          assert(queue.poll() === makerOrder);
          queueRemovedOrdersWithHold.push(makerOrder);
        } else {
          // there's no hold, so end the matching routine
          break;
        }
        break;
      } else {
        /** Whether the maker order is fully matched and should be removed from the queue. */
        const makerFullyMatched = makerOrder.quantity === matchingQuantity;
        const makerAvailableQuantityFullyMatched = makerAvailableQuantityOrder.quantity === matchingQuantity;
        const remainingFullyMatched = remainingOrder.quantity === matchingQuantity;

        if (makerFullyMatched && remainingFullyMatched) {
          // maker & taker order quantities equal and fully matching
          matches.push({ maker: makerOrder, taker: remainingOrder });
        } else if (remainingFullyMatched) {
          // taker order quantity is not sufficient. maker order will split
          const matchedMakerOrder = TradingPair.splitOrderByQuantity(makerOrder, matchingQuantity);
          this.logger.debug(
            `reduced order ${makerOrder.id} by ${matchingQuantity} quantity while matching order ${takerOrder.id}`,
          );
          matches.push({ maker: matchedMakerOrder, taker: remainingOrder });
        } else if (makerAvailableQuantityFullyMatched) {
          // maker order quantity is not sufficient. taker order will split
          const matchedTakerOrder = TradingPair.splitOrderByQuantity(remainingOrder, matchingQuantity);
          matches.push({
            maker: makerAvailableQuantityOrder,
            taker: matchedTakerOrder,
          });
        } else {
          assert(false, 'matchingQuantity should not be lower than both orders available quantity values');
        }

        if (remainingFullyMatched) {
          remainingOrder = undefined;
        }

        if (makerFullyMatched) {
          // maker order is fully matched, so remove it from the queue and map
          assert(queue.poll() === makerOrder);
          const map = this.getOrderMap(makerOrder)!;
          map.delete(makerOrder.id);
          this.logger.debug(`fully removed order ${makerOrder.id} while matching order ${takerOrder.id}`);
          if (isOwnOrder(makerOrder)) {
            this.emit('ownOrder.fullyRemoved', makerOrder);
          }
        } else if (makerAvailableQuantityFullyMatched) {
          // only an own order can be fully matched for available quantity, but not fully matched in the overall
          assert(isOwnOrder(makerOrder));

          assert(queue.poll() === makerOrder);
          queueRemovedOrdersWithHold.push(makerOrder);
        } else {
          // we must make sure that we don't leave an order that is too small to swap in the order book
          const makerLeftoverAvailableQuantity = isOwnOrder(makerOrder)
            ? makerOrder.quantity - makerOrder.hold
            : makerOrder.quantity;

          if (
            makerLeftoverAvailableQuantity < TradingPair.QUANTITY_DUST_LIMIT ||
            makerLeftoverAvailableQuantity * makerOrder.price < TradingPair.QUANTITY_DUST_LIMIT
          ) {
            if (isOwnOrder(makerOrder)) {
              this.removeOwnOrder(makerOrder.id);
            } else {
              this.removePeerOrder(makerOrder.id, makerOrder.peerPubKey);
            }
          }
        }
      }
    }

    // return the removed orders with hold to the queue.
    // their hold quantity might be released later
    queueRemovedOrdersWithHold.forEach((order) => queue.add(order));

    return { matches, remainingOrder };
  };
}

export default TradingPair;
export { OrderSidesArrays };
