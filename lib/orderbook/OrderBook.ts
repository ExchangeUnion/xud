import assert from 'assert';
import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import errors from './errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import { orders, matchingEngine, db } from '../types';
import Logger from '../Logger';
import { ms, derivePairId } from '../utils/utils';
import { Models } from '../db/DB';
import Swaps from '../swaps/Swaps';
import { SwapDealRole } from '../types/enums';
import { CurrencyInstance, PairInstance, CurrencyFactory } from '../types/db';
import { Pair, OrderIdentifier } from '../types/orders';

interface OrderBook {
  on(event: 'peerOrder.incoming', listener: (order: orders.StampedPeerOrder) => void): this;
  on(event: 'peerOrder.invalidation', listener: (order: orders.OrderIdentifier) => void): this;
  emit(event: 'peerOrder.incoming', order: orders.StampedPeerOrder): boolean;
  emit(event: 'peerOrder.invalidation', order: orders.OrderIdentifier): boolean;
}

/** A class representing an orderbook containing all orders for all active trading pairs. */
class OrderBook extends EventEmitter {
  /** A map of supported currency tickers to currency instances. */
  public currencies = new Map<string, CurrencyInstance>();
  /** A map of supported trading pair tickers to pair instances. */
  public pairs = new Map<string, PairInstance>();

  /** A map between active trading pair ids and matching engines. */
  public matchingEngines = new Map<string, MatchingEngine>();
  /** A map between own orders local id and their global id. */
  private localIdMap = new Map<string, OrderIdentifier>();

  private repository: OrderBookRepository;

  /** Gets an iterable of supported pair ids. */
  public get pairIds() {
    return this.pairs.keys();
  }

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
      this.swaps.on('swap.paid', (deal) => {
        if (deal.myRole === SwapDealRole.Maker) {
          // assume full order execution of an own order
          this.removeOwnOrder(deal.orderId, deal.pairId);

          // TODO: handle partial order execution, updating existing order
        }
      });
      // TODO: bind to other swap events
    }
  }

  /** Loads the supported pairs and currencies from the database. */
  public init = async () => {
    const promises = [await this.repository.getPairs(), await this.repository.getCurrencies()];
    const results = await Promise.all(promises);
    const pairs = results[0] as db.PairInstance[];
    const currencies = results[1] as db.CurrencyInstance[];

    currencies.forEach(currency => this.currencies.set(currency.id, currency));
    pairs.forEach((pair) => {
      this.matchingEngines.set(pair.id, new MatchingEngine(this.logger, pair.id));
      this.pairs.set(pair.id, pair);
    });
  }

  /**
   * Get lists of buy and sell orders of peers.
   */
  public getPeerOrders = (pairId: string) => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
    }

    return matchingEngine.getPeerOrders();
  }

  /**
   * Get lists of this node's own buy and sell orders.
   */
  public getOwnOrders = (pairId: string) => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
    }

    return matchingEngine.getOwnOrders();
  }

  public addPair = async (pair: Pair) => {
    const pairId = derivePairId(pair);
    if (this.pairs.has(pairId)) {
      throw errors.PAIR_ALREADY_EXISTS(pairId);
    }
    if (!this.currencies.has(pair.baseCurrency)) {
      throw errors.CURRENCY_DOES_NOT_EXIST(pair.baseCurrency);
    }
    if (!this.currencies.has(pair.quoteCurrency)) {
      throw errors.CURRENCY_DOES_NOT_EXIST(pair.quoteCurrency);
    }

    const pairInstance = await this.repository.addPair(pair);
    this.pairs.set(pairInstance.id, pairInstance);
    this.matchingEngines.set(pairInstance.id, new MatchingEngine(this.logger, pairInstance.id));
    // TODO: update handshake state
    return pairInstance;
  }

  public addCurrency = async (currency: CurrencyFactory) => {
    if (this.currencies.has(currency.id)) {
      throw errors.CURRENCY_ALREADY_EXISTS(currency.id);
    }
    const currencyInstance = await this.repository.addCurrency({ ...currency, decimalPlaces: currency.decimalPlaces || 8 });
    this.currencies.set(currencyInstance.id, currencyInstance);
  }

  public removeCurrency = (currencyId: string) => {
    const currency = this.currencies.get(currencyId);
    if (currency) {
      for (const pair of this.pairs.values()) {
        if (currencyId === pair.baseCurrency || currencyId === pair.quoteCurrency) {
          throw errors.CURRENCY_CANNOT_BE_REMOVED(currencyId, pair.id);
        }
      }
      this.currencies.delete(currencyId);
      return currency.destroy();
    } else {
      throw errors.CURRENCY_DOES_NOT_EXIST(currencyId);
    }
  }

  public removePair = (pairId: string) => {
    const pair = this.pairs.get(pairId);
    if (pair) {
      this.pairs.delete(pairId);
      this.matchingEngines.delete(pairId);
      // TODO: invalidate all orders for this pair
      // TODO: update handshake state
      return pair.destroy();
    } else {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
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

  private addOwnOrder = (order: orders.OwnOrder, discardRemaining = false): matchingEngine.MatchingResult => {
    if (order.localId === '') {
      // we were given a blank local id, so generate one
      order.localId = uuidv1();
    } else if (this.localIdMap.has(order.localId)) {
      throw errors.DUPLICATE_ORDER(order.localId);
    }

    const matchingEngine = this.matchingEngines.get(order.pairId);
    if (!matchingEngine) {
      throw errors.PAIR_DOES_NOT_EXIST(order.pairId);
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
      this.localIdMap.set(remainingOrder.localId, {
        orderId: remainingOrder.id,
        pairId: remainingOrder.pairId,
      });
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

  /**
   * Removes an order from the order book by its local id. Throws an error if the specified pairId
   * is not supported or if the order to cancel could not be found.
   */
  public removeOwnOrderByLocalId = (localId: string) => {
    const order = this.localIdMap.get(localId);

    if (!order) {
      throw errors.ORDER_NOT_FOUND(localId);
    }

    this.removeOwnOrder(order.orderId, order.pairId);
  }

  /**
   * Attempts to remove a local order from the order book.
   * @returns true if an order was removed, otherwise false
   */
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

    if (this.pool) {
      this.pool.broadcastOrderInvalidation({
        orderId,
        pairId,
      });
    }

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
    // TODO: remove only from pairs which are supported by the peer
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
