import assert from 'assert';
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

interface OrderBook {
  on(event: 'peerOrder.incoming', listener: (order: orders.StampedPeerOrder) => void): this;
  on(event: 'peerOrder.invalidation', listener: (order: orders.OrderIdentifier) => void): this;
  emit(event: 'peerOrder.incoming', order: orders.StampedPeerOrder): boolean;
  emit(event: 'peerOrder.invalidation', order: orders.OrderIdentifier): boolean;
}

/** A class representing an orderbook containing all orders for all active trading pairs. */
class OrderBook extends EventEmitter {
  /** An array of supported pair instances for the orderbook. */
  public pairs: db.PairInstance[] = [];
  /** An array of supported pair ids for the orderbook. */
  public pairIds: string[] = [];
  /** A map between active trading pair ids and matching engines. */
  public matchingEngines = new Map<string, MatchingEngine>();
  /** A map between own orders local id and their global id. */
  private localIdMap: Map<string, string> = new Map<string, string>();

  private repository: OrderBookRepository;

  private matchesProcessor: MatchesProcessor;

  constructor(private logger: Logger, models: Models, private pool?: Pool, private lndClient?: LndClient, private raidenClient?: RaidenClient) {
    super();

    this.matchesProcessor = new MatchesProcessor(logger, pool, raidenClient);

    this.repository = new OrderBookRepository(logger, models);
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

  public init = async () => {
    this.pairs = await this.repository.getPairs();

    this.pairs.forEach((pair) => {
      this.pairIds.push(pair.id);
      this.matchingEngines.set(pair.id, new MatchingEngine(this.logger, pair.id));
    });
  }

  /**
   * Get lists of buy and sell orders of peers.
   */
  public getPeerOrders = (pairId: string, limit: number) => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(pairId);
    }

    return matchingEngine.getPeerOrders(limit);
  }

  /**
   * Get lists of this node's own buy and sell orders.
   */
  public getOwnOrders = (pairId: string, limit?: number) => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(pairId);
    }

    return matchingEngine.getOwnOrders(limit);
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
      });
    }
    if (remainingOrder && !discardRemaining) {
      this.localIdMap.set(remainingOrder.localId, remainingOrder.id);
      this.broadcastOrder(remainingOrder);
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

    if (!matchingEngine.addPeerOrder(stampedOrder)) {
      this.logger.debug(`incoming peer order is duplicated: ${order.id}`);
      // TODO: penalize peer
      return false;
    }

    this.logger.debug(`order added: ${JSON.stringify(stampedOrder)}`);
    this.emit('peerOrder.incoming', stampedOrder);

    return true;
  }

  public removeOwnOrderByLocalId = (pairId: string, localId: string): { removed: boolean, globalId?: string } => {
    const orderId = this.localIdMap.get(localId);

    if (orderId === undefined) {
      return { removed: false, globalId: orderId };
    } else {
      return {
        removed: this.removeOwnOrder(orderId, pairId),
        globalId: orderId,
      };
    }
  }

  private removeOwnOrder = (orderId: string, pairId: string): boolean => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      this.logger.warn(`invalid pairId: ${pairId}`);
      return false;
    }

    const order = matchingEngine.removeOwnOrder(orderId);
    if (!order) {
      this.logger.warn(`invalid orderId: ${pairId}`);
      return false;
    }

    this.localIdMap.delete(order.localId);
    this.logger.debug(`order removed: ${JSON.stringify(orderId)}`);
    return true;
  }

  private removePeerOrder = (orderId: string, pairId: string, quantityToDecrease?: number): orders.StampedPeerOrder | undefined => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      this.logger.warn(`incoming order invalidation: invalid pairId (${pairId})`);
      return;
    }
    const order = matchingEngine.removePeerOrderQuantity(orderId, quantityToDecrease);
    if (!order) {
      this.logger.warn(`incoming order invalidation: invalid orderId (${orderId})`);
      return;
    } else {
      assert(order.quantity === quantityToDecrease, 'order quantity must equal quantityToDecrease');
      this.emit('peerOrder.invalidation', { orderId, pairId, quantity: order.quantity });
      return order;
    }
  }

  private removePeerOrders = async (peer: Peer): Promise<void> => {
    this.matchingEngines.forEach((matchingEngine) => {
      const orders = matchingEngine.removePeerOrders(peer.nodePubKey!);

      orders.forEach((order) => {
        this.emit('peerOrder.invalidation', {
          orderId: order.id,
          pairId: order.pairId,
        });
      });
    });
  }

  /**
   * Send all local orders to a given peer in an [[OrdersPacket].
   * @param reqId the request id of a [[GetOrdersPacket]] packet that this method is responding to
   */
  private sendOrders = async (peer: Peer, reqId: string) => {
    // TODO: just send supported pairs

    const outgoingOrders: orders.OutgoingOrder[] = [];
    this.matchingEngines.forEach((matchingEngine) => {
      const orders = matchingEngine.getOwnOrders();
      orders.buy.forEach(order => outgoingOrders.push(this.createOutgoingOrder(order)));
      orders.sell.forEach(order => outgoingOrders.push(this.createOutgoingOrder(order)));
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
    this.matchesProcessor.process(match);
  }

  private swapHandler = (order: orders.StampedOrder) => {
    if (order.quantity === 0) {
      // full order execution
      if (orders.isPeerOrder(order)) {
        this.removePeerOrder(order.id, order.pairId);
      } else {
        this.removeOwnOrder(order.id, order.pairId);
      }
    } else {
      // TODO: partial order execution, update existing order
    }
  }
}

export default OrderBook;
