import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import { orders, matchingEngine, db } from '../types';
import Logger from '../Logger';
import LndClient from '../lndclient/LndClient';
import { ms } from '../utils/utils';
import { Models } from '../db/DB';
import RaidenClient from '../raidenclient/RaidenClient';

/** A mapping of a string (such as pairId) to an [[Orders]] object. */
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

class OrderBook extends EventEmitter {
  public pairs: db.PairInstance[] = [];
  public matchingEngines: { [ pairId: string ]: MatchingEngine } = {};

  private logger: Logger = Logger.orderbook;
  private repository: OrderBookRepository;
  private matchesProcessor: MatchesProcessor;

  private ownOrders: OrdersMap = new Map<string, Orders>();
  private peerOrders: OrdersMap = new Map<string, Orders>();

  /**
   * A map between an order's local id and global id
   */
  private localIdMap: Map<string, string> = new Map<string, string>();

  constructor(models: Models, private pool?: Pool, private lndClient?: LndClient, private raidenClient?: RaidenClient) {
    super();

    this.matchesProcessor = new MatchesProcessor(pool, raidenClient);

    this.repository = new OrderBookRepository(models);
    if (pool) {
      pool.on('packet.order', this.addPeerOrder);
      pool.on('packet.orderInvalidation', order => this.removePeerOrder(order.orderId, order.pairId, order.quantity));
      pool.on('packet.getOrders', this.sendOrders);
      pool.on('peer.close', this.removePeerOrders);
    }

    if (raidenClient) {
      raidenClient.on('swap', this.swapHandler);
    }
  }

  private swapHandler = (order: orders.StampedOrder) => {
    if (order.quantity === 0) {
      // full order execution
      if (orders.isPeerOrder(order)) {
        this.removeOrder(this.peerOrders, order.id, order.pairId);
      } else {
        this.removeOwnOrder(order.pairId, order.id);
      }
    } else {
      // TODO: partial order execution, update existing order
    }
  }

  public init = async () => {
    const pairs = await this.repository.getPairs();

    pairs.forEach((pair) => {
      this.matchingEngines[pair.id] = new MatchingEngine(pair.id);
      this.ownOrders.set(pair.id, this.initOrders());
      this.peerOrders.set(pair.id, this.initOrders());
    });

    this.pairs = pairs;
  }

  private initOrders = (): Orders => {
    return {
      buyOrders: new Map <string, orders.StampedOrder>(),
      sellOrders: new Map <string, orders.StampedOrder>(),
    };
  }

  /**
   * Get the list of available trading pairs.
   */
  public getPairs = (): Promise<db.PairInstance[]> => {
    return this.repository.getPairs();
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
    return this.addOwnOrder({ ...order, price }, true);
  }

  public removeOwnOrderByLocalId = (pairId: string, localId: string): { removed: boolean, globalId?: string } => {
    const id = this.localIdMap.get(localId);

    if (id === undefined) {
      return { removed: false, globalId: id };
    } else {
      this.localIdMap.delete(localId);
      return {
        removed: this.removeOwnOrder(pairId, id),
        globalId: id,
      };
    }
  }

  private removeOwnOrder = (pairId: string, orderId: string): boolean => {
    const matchingEngine = this.matchingEngines[pairId];
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
    const matchingEngine = this.matchingEngines[pairId];
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

  private addOwnOrder = (order: orders.OwnOrder, discardRemaining: boolean = false): matchingEngine.MatchingResult => {
    if (this.localIdMap.has(order.localId)) {
      throw errors.DUPLICATE_ORDER(order.localId);
    }

    const matchingEngine = this.matchingEngines[order.pairId];
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

  private addPeerOrder = (order: orders.PeerOrder) => {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      this.logger.debug(`incoming peer order invalid pairId: ${order.pairId}`);
      return;
    }

    const stampedOrder: orders.StampedPeerOrder = { ...order, createdAt: ms() };
    this.emit('peerOrder.incoming', stampedOrder);
    matchingEngine.addPeerOrder(stampedOrder);
    this.addOrder(this.peerOrders, stampedOrder);
    this.logger.debug(`order added: ${JSON.stringify(stampedOrder)}`);
  }

  private removePeerOrders = async (peer: Peer): Promise<void> => {
    this.pairs.forEach((pair) => {
      const orders = this.matchingEngines[pair.id].removePeerOrders(peer.id);

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

  private addOrder = (ordersMap: OrdersMap, order: orders.StampedOrder) => {
    if (this.isOwnOrdersMap(ordersMap)) {
      const { localId } = order as orders.StampedOwnOrder;
      this.localIdMap.set(localId, order.id);
    }

    this.getOrderMap(ordersMap, order).set(order.id, order);
  }

  private removeOrder = (ordersMap: OrdersMap, orderId: string, pairId: string): boolean => {
    const orders = ordersMap.get(pairId);

    if (!orders) {
      throw errors.INVALID_PAIR_ID(pairId);
    }
    if (orders.buyOrders.has(orderId)) {
      orders.buyOrders.delete(orderId);
      return true;
    } else if (orders.sellOrders.has(orderId)) {
      orders.sellOrders.delete(orderId);
      return true;
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

  private sendOrders = async (peer: Peer, reqId: string) => {
    // TODO: just send supported pairs
    const pairs = await this.getPairs();

    const promises: Promise<orders.OutgoingOrder | void>[] = [];
    for (const { id } of pairs) {
      const orders = await this.getOwnOrders(id, 0);
      orders['buyOrders'].forEach(order => promises.push(this.createOutgoingOrder(order as orders.StampedOwnOrder)));
      orders['sellOrders'].forEach(order => promises.push(this.createOutgoingOrder(order as orders.StampedOwnOrder)));
    }
    await Promise.all(promises).then((outgoingOrders) => {
      peer.sendOrders(outgoingOrders as orders.OutgoingOrder[], reqId);
    });
  }

  private broadcastOrder = async (order: orders.StampedOwnOrder): Promise<void> => {
    if (this.pool) {
      const outgoingOrder = await this.createOutgoingOrder(order);
      if (outgoingOrder) {
        this.pool.broadcastOrder(outgoingOrder);
      }
    }
  }

  private createOutgoingOrder = async (order: orders.StampedOwnOrder): Promise<orders.OutgoingOrder | void> => {
    const invoice = await this.createInvoice(order);

    if (!invoice) return;

    const { createdAt, localId, ...outgoingOrder } = { ...order, invoice };
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
    this.matchesProcessor.add(match);
  }

  public createInvoice = async (order: orders.StampedOwnOrder): Promise<string|void> => {
    if (!this.lndClient) {
      return;
    }

    if (this.lndClient.isDisabled()) {
      return 'dummyInvoice'; // temporarily testing invoices while lnd is not available
    } else {
      // temporary simple invoices until swaps are operational
      const invoice = await this.lndClient.addInvoice(order.price * Math.abs(order.quantity));
      return invoice.paymentRequest;
    }
  }
}

export default OrderBook;
export { Orders, OrderArrays };
