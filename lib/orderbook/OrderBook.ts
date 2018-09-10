import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import errors from './errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import { orders, matchingEngine, db } from '../types';
import Logger from '../Logger';
import { ms } from '../utils/utils';
import { Models } from '../db/DB';
import Swaps from '../swaps/Swaps';
import { SwapDealRole } from '../types/enums';

/** A mapping of strings (such as pair ids) to [[Orders]] objects. */
type OrdersMap = Map<string, Orders>;

/** A type containing two properties mapping order ids to orders for buy and sell orders. */
type Orders = {
  buyOrders: Map<string, orders.StampedOrder>;
  sellOrders: Map<string, orders.StampedOrder>;
};

interface OrderBook {
  on(event: 'peerOrder.incoming', listener: (order: orders.StampedPeerOrder) => void): this;
  on(event: 'peerOrder.invalidation', listener: (order: orders.OrderIdentifier) => void): this;
  emit(event: 'peerOrder.incoming', order: orders.StampedPeerOrder): boolean;
  emit(event: 'peerOrder.invalidation', order: orders.OrderIdentifier): boolean;
}

/** A type containing two arrays for buy and sell orders. */
type OrderArrays = {
  buyOrders: orders.StampedOrder[],
  sellOrders: orders.StampedOrder[],
};

/** A class representing an orderbook containing all orders for all active trading pairs. */
class OrderBook extends EventEmitter {
  /** An array of supported pair instances for the orderbook. */
  public pairs: db.PairInstance[] = [];
  /** An array of supported pair ids for the orderbook. */
  public pairIds: string[] = [];

  /** A map between active trading pair ids and matching engines. */
  public matchingEngines = new Map<string, MatchingEngine>();

  private repository: OrderBookRepository;
  /** A map between active trading pair ids and local buy and sell orders. */
  private ownOrders: OrdersMap = new Map<string, Orders>();
  /** A map between active trading pair ids and peer buy and sell orders. */
  private peerOrders: OrdersMap = new Map<string, Orders>();

  /** A map between an order's local id and its global id. */
  private localIdMap: Map<string, string> = new Map<string, string>();

  constructor(private logger: Logger, models: Models, private pool?: Pool, private swaps?: Swaps) {
    super();

    this.repository = new OrderBookRepository(logger, models);

    this.bindPool();
    this.bindSwaps();
  }

  private bindPool = () => {
    if (this.pool) {
      this.pool.on('packet.order', this.addPeerOrder);
      this.pool.on('packet.orderInvalidation', order => this.removePeerOrder(order.orderId, order.pairId, order.quantity));
      this.pool.on('packet.getOrders', this.sendOrders);
      this.pool.on('peer.close', this.removePeerOrders);
    }
  }

  private bindSwaps = () => {
    if (this.swaps) {
      this.swaps.on('swap.completed', (deal) => {
        if (deal.myRole === SwapDealRole.Maker) {
          // assume full order execution of an own order
          this.removeOwnOrder(deal.pairId, deal.orderId);

          // TODO: handle partial order execution, updating existing order
        }
      });
      // TODO: bind to other swap events
    }
  }

  public init = async () => {
    this.pairs = await this.repository.getPairs();

    this.pairs.forEach((pair) => {
      this.pairIds.push(pair.id);
      this.matchingEngines.set(pair.id, new MatchingEngine(this.logger, pair.id));
      this.ownOrders.set(pair.id, this.initOrders());
      this.peerOrders.set(pair.id, this.initOrders());
    });
  }

  private initOrders = (): Orders => {
    return {
      buyOrders: new Map <string, orders.StampedOrder>(),
      sellOrders: new Map <string, orders.StampedOrder>(),
    };
  }

  /**
   * Get lists of buy and sell orders of peers.
   */
  public getPeerOrders = (pairId: string, maxResults: number): OrderArrays => {
    return this.getOrders(pairId, maxResults, this.peerOrders);
  }

  /*
  * Get lists of this node's own buy and sell orders.
  */
  public getOwnOrders = (pairId: string, maxResults: number): OrderArrays => {
    return this.getOrders(pairId, maxResults, this.ownOrders);
  }

  private getOrders = (pairId: string, maxResults: number, ordersMap: OrdersMap): OrderArrays => {
    const orders = ordersMap.get(pairId);
    if (!orders) {
      throw errors.INVALID_PAIR_ID(pairId);
    }
    if (maxResults > 0) {
      return {
        buyOrders: Array.from(orders.buyOrders.values()).slice(0, maxResults),
        sellOrders: Array.from(orders.sellOrders.values()).slice(0, maxResults),
      };
    } else {
      return {
        buyOrders: Array.from(orders.buyOrders.values()),
        sellOrders: Array.from(orders.sellOrders.values()),
      };
    }
  }

  public addLimitOrder = (order: orders.OwnOrder): matchingEngine.MatchingResult => {
    return this.addOwnOrder(order);
  }

  public addMarketOrder = (order: orders.OwnMarketOrder): matchingEngine.MatchingResult => {
    const price = order.quantity > 0 ? Number.MAX_VALUE : 0;
    const result = this.addOwnOrder({ ...order, price }, true);
    delete result.remainingOrder;
    return result;
  }

  /**
   * Removes an order from the order book by its local id. Throws an error if the specified pairId
   * is not supported or if the order to cancel could not be found.
   */
  public removeOwnOrderByLocalId = (pairId: string, localId: string) => {
    const orderId = this.localIdMap.get(localId);

    if (orderId === undefined) {
      throw errors.INVALID_PAIR_ID(pairId);
    }

    if (this.removeOwnOrder(pairId, orderId)) {
      this.localIdMap.delete(localId);

      if (this.pool) {
        this.pool.broadcastOrderInvalidation({
          orderId,
          pairId,
        });
      }
    } else {
      throw errors.ORDER_NOT_FOUND(orderId);
    }
  }

  /**
   * Attempts to remove a local order from the order book.
   * @returns true if an order was removed, otherwise false
   */
  private removeOwnOrder = (pairId: string, orderId: string): boolean => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      this.logger.warn(`Invalid pairId: ${pairId}`);
      return false;
    }

    if (matchingEngine.removeOwnOrder(orderId)) {
      this.logger.debug(`order removed: ${JSON.stringify(orderId)}`);
      return this.removeOrder(this.ownOrders, orderId, pairId);
    } else {
      return false;
    }
  }

  private removePeerOrder = (orderId: string, pairId: string, quantityToDecrease?: number): boolean => {
    const matchingEngine = this.matchingEngines.get(pairId);
    const ordersMap = this.peerOrders.get(pairId);
    if (!matchingEngine || !ordersMap) {
      this.logger.warn(`Invalid pairId: ${pairId}`);
      return false;
    }

    const order = matchingEngine.removePeerOrder(orderId, quantityToDecrease);
    if (order) {
      let result;

      if (!quantityToDecrease || quantityToDecrease === 0) {
        result = this.removeOrder(this.peerOrders, orderId, pairId);
      } else {
        result = this.updateOrderQuantity(order, quantityToDecrease);
      }

      if (result) {
        this.emit('peerOrder.invalidation', { orderId, pairId, quantity: quantityToDecrease });
        return true;
      }
    }

    this.logger.warn(`Invalid orderId: ${orderId}`);
    return false;
  }

  private addOwnOrder = (order: orders.OwnOrder, discardRemaining = false): matchingEngine.MatchingResult => {
    if (order.localId === '') {
      // we were given a blank local id, so generate one
      order.localId = uuidv1();
    } else if (this.localIdMap.has(order.localId)) {
      throw errors.DUPLICATE_ORDER(order.localId);
    }

    const matchingEngine = this.matchingEngines.get(order.pairId);
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }

    const stampedOrder: orders.StampedOwnOrder = { ...order, id: uuidv1(), createdAt: ms() };
    const matchingResult = matchingEngine.matchOrAddOwnOrder(stampedOrder, discardRemaining);
    const { matches, remainingOrder } = matchingResult;

    if (matches.length > 0) {
      matches.forEach(({ maker, taker }) => {
        this.handleMatch({ maker, taker });
        this.updateOrderQuantity(maker, maker.quantity);
      });
    }
    if (remainingOrder && !discardRemaining) {
      this.broadcastOrder(remainingOrder);
      this.addOrder(this.ownOrders, remainingOrder);
      this.logger.debug(`order added: ${JSON.stringify(remainingOrder)}`);
    }

    return matchingResult;
  }

  /**
   * Add peer order
   * @returns false if it's a duplicated order or with an invalid pair id, otherwise true
   */
  private addPeerOrder = (order: orders.StampedPeerOrder): boolean => {
    const matchingEngine = this.matchingEngines.get(order.pairId);
    if (!matchingEngine) {
      this.logger.debug(`incoming peer order invalid pairId: ${order.pairId}`);
      // TODO: penalize peer
      return false;
    }

    const stampedOrder: orders.StampedPeerOrder = { ...order, createdAt: ms() };

    if (!this.addOrder(this.peerOrders, stampedOrder)) {
      this.logger.debug(`incoming peer order is duplicated: ${order.id}`);
      // TODO: penalize peer
      return false;
    }

    matchingEngine.addPeerOrder(stampedOrder);

    this.logger.debug(`order added: ${JSON.stringify(stampedOrder)}`);
    this.emit('peerOrder.incoming', stampedOrder);

    return true;
  }

  private removePeerOrders = async (peer: Peer): Promise<void> => {
    this.matchingEngines.forEach((matchingEngine) => {
      const orders = matchingEngine.removePeerOrders(peer.nodePubKey!);

      orders.forEach((order) => {
        this.removeOrder(this.peerOrders, order.id, order.pairId);
        this.emit('peerOrder.invalidation', {
          orderId: order.id,
          pairId: order.pairId,
        });
      });
    });
  }

  private updateOrderQuantity = (order: orders.StampedOrder, quantityToDecrease: number) => {
    const isOwnOrder = orders.isOwnOrder(order);
    const orderMap = this.getOrderMap(isOwnOrder ? this.ownOrders : this.peerOrders, order);

    const orderToUpdate = orderMap.get(order.id);
    if (!orderToUpdate) {
      return false;
    }
    orderToUpdate.quantity -= quantityToDecrease;
    if (orderToUpdate.quantity === 0) {
      if (isOwnOrder) {
        const { localId } = order as orders.StampedOwnOrder;
        this.localIdMap.delete(localId);
      }
      orderMap.delete(order.id);
    }

    return true;
  }

  /**
   * Add an order to an order map
   * @returns false if an order with the same id already exist, otherwise true
   */
  private addOrder = (ordersMap: OrdersMap, order: orders.StampedOrder) => {
    if (this.isOwnOrdersMap(ordersMap)) {
      const { localId } = order as orders.StampedOwnOrder;
      this.localIdMap.set(localId, order.id);
    }

    const orderMap = this.getOrderMap(ordersMap, order);
    if (orderMap.has(order.id)) {
      return false;
    } else {
      orderMap.set(order.id, order);
      return true;
    }
  }

  private removeOrder = (ordersMap: OrdersMap, orderId: string, pairId: string): boolean => {
    if (!this.pairIds.includes(pairId)) {
      throw errors.INVALID_PAIR_ID(pairId);
    }
    const orders = ordersMap.get(pairId);

    if (orders) {
      if (orders.buyOrders.has(orderId)) {
        orders.buyOrders.delete(orderId);
        return true;
      } else if (orders.sellOrders.has(orderId)) {
        orders.sellOrders.delete(orderId);
        return true;
      }
    }

    return false;
  }

  private getOrderMap = (ordersMap: OrdersMap, order: orders.StampedOrder): Map<string, orders.StampedOrder> => {
    const orders = ordersMap.get(order.pairId);
    if (!orders) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }
    if (order.quantity > 0) {
      return orders.buyOrders;
    } else {
      return orders.sellOrders;
    }
  }

  private isOwnOrdersMap = (ordersMap: OrdersMap) => {
    return ordersMap === this.ownOrders;
  }

  /**
   * Send all local orders to a given peer in an [[OrdersPacket].
   * @param reqId the request id of a [[GetOrdersPacket]] packet that this method is responding to
   */
  private sendOrders = async (peer: Peer, reqId: string) => {
    // TODO: just send supported pairs

    const outgoingOrders: orders.OutgoingOrder[] = [];
    this.pairIds.forEach((pairId) => {
      const orders = this.getOwnOrders(pairId, 0);
      orders['buyOrders'].forEach(order => outgoingOrders.push(this.createOutgoingOrder(order as orders.StampedOwnOrder)));
      orders['sellOrders'].forEach(order => outgoingOrders.push(this.createOutgoingOrder(order as orders.StampedOwnOrder)));
    });
    peer.sendOrders(outgoingOrders, reqId);
  }

  /**
   * Create an outgoing order and broadcast it to all peers.
   */
  private broadcastOrder =  (order: orders.StampedOwnOrder) => {
    if (this.pool) {
      const outgoingOrder = this.createOutgoingOrder(order);
      if (outgoingOrder) {
        this.pool.broadcastOrder(outgoingOrder);
      }
    }
  }

  private createOutgoingOrder = (order: orders.StampedOwnOrder): orders.OutgoingOrder => {
    const { createdAt, localId, ...outgoingOrder } = order;
    return outgoingOrder;
  }

  private handleMatch = (match: matchingEngine.OrderMatch): void => {
    this.logger.debug(`order match: ${JSON.stringify(match)}`);
    if (this.pool) {
      const { maker } = match;
      if (orders.isOwnOrder(maker)) {
        this.pool.broadcastOrderInvalidation({
          orderId: maker.id,
          pairId: maker.pairId,
          quantity: maker.quantity,
        });
      }
    }

    if (orders.isPeerOrder(match.maker)) {
      // we matched a remote order
      if (this.swaps) {
        // TODO: handle the resolution of the swap
        this.swaps.beginSwap(match.maker, match.taker as orders.StampedOwnOrder);
      }
    } else {
      // internal match
      // TODO: notify client
    }
  }
}

export default OrderBook;
export { Orders, OrderArrays };
