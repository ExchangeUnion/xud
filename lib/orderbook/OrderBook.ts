import assert from 'assert';
import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import errors from './errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import { orders, db } from '../types';
import Logger from '../Logger';
import { ms, derivePairId } from '../utils/utils';
import { Models } from '../db/DB';
import Swaps from '../swaps/Swaps';
import { SwapDealRole } from '../types/enums';
import { CurrencyInstance, PairInstance, CurrencyFactory } from '../types/db';
import { Pair, OrderIdentifier, StampedOwnOrder, OrderPortion, StampedPeerOrder, OwnOrder } from '../types/orders';
import { PlaceOrderEvent, PlaceOrderEventCase, PlaceOrderResult } from '../types/orderBook';

interface OrderBook {
  /** Adds a listener to be called when a remote order was added. */
  on(event: 'peerOrder.incoming', listener: (order: orders.StampedPeerOrder) => void): this;
  /** Adds a listener to be called when all or part of a remote order was invalidated and removed */
  on(event: 'peerOrder.invalidation', listener: (order: orders.OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a remote order was filled and removed */
  on(event: 'peerOrder.filled', listener: (order: orders.OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a local order was swapped and removed, after it was filled and executed remotely */
  on(event: 'ownOrder.swapped', listener: (order: orders.OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a local order was filled and removed */
  on(event: 'ownOrder.filled', listener: (order: orders.OrderPortion) => void): this;
  /** Adds a listener to be called when a local order was added */
  on(event: 'ownOrder.added', listener: (order: orders.StampedOwnOrder) => void): this;

  /** Notifies listeners that a remote order was added */
  emit(event: 'peerOrder.incoming', order: orders.StampedPeerOrder): boolean;
  /** Notifies listeners that all or part of a remote order was invalidated and removed */
  emit(event: 'peerOrder.invalidation', order: orders.OrderPortion): boolean;
  /** Notifies listeners that all or part of a remote order was filled and removed */
  emit(event: 'peerOrder.filled', order: orders.OrderPortion): boolean;
  /** Notifies listeners that all or part of a local order was swapped and removed, after it was filled and executed remotely */
  emit(event: 'ownOrder.swapped', order: orders.OrderPortion): boolean;
  /** Notifies listeners that all or part of a local order was filled and removed */
  emit(event: 'ownOrder.filled', order: orders.OrderPortion): boolean;
  /** Notifies listeners that a local order was added */
  emit(event: 'ownOrder.added', order: orders.StampedOwnOrder): boolean;
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

  /** Max time for addOwnOrder iterations (due to swaps failures retries). */
  private static MAX_ADD_OWN_ORDER_ITERATIONS_TIME = 10000; // 10 sec

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
      this.swaps.on('swap.paid', (swapResult) => {
        if (swapResult.role === SwapDealRole.Maker) {
          const { orderId, pairId, quantity, peerPubKey } = swapResult;
          // assume full order execution of an own order
          this.removeOwnOrder(orderId, pairId, peerPubKey);
          this.emit('ownOrder.swapped', { orderId, pairId, quantity }); // quantity might not reflect partial order execution yet
          // TODO: handle partial order execution, updating existing order
        }
      });
      // TODO: bind to other swap events
    }
  }

  /** Loads the supported pairs and currencies from the database. */
  public init = async () => {
    const promises: PromiseLike<any>[] = [this.repository.getPairs(), this.repository.getCurrencies()];
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

  public addLimitOrder = async (order: orders.OwnOrder, onUpdate?: (e: PlaceOrderEvent) => void): Promise<PlaceOrderResult> => {
    const stampedOrder = this.stampOwnOrder(order);
    return this.addOwnOrder(stampedOrder, false, onUpdate, Date.now() + OrderBook.MAX_ADD_OWN_ORDER_ITERATIONS_TIME);
  }

  public addMarketOrder = async (order: orders.OwnMarketOrder, onUpdate?: (e: PlaceOrderEvent) => void): Promise<PlaceOrderResult> => {
    const stampedOrder = this.stampOwnOrder({ ...order, price: order.isBuy ? Number.MAX_VALUE : 0 });
    const result = await this.addOwnOrder(stampedOrder, true, onUpdate, Date.now() + OrderBook.MAX_ADD_OWN_ORDER_ITERATIONS_TIME);
    delete result.remainingOrder;
    return result;
  }

  private addOwnOrder = async (
    order: orders.StampedOwnOrder,
    discardRemaining = false,
    onUpdate?: (e: PlaceOrderEvent) => void,
    maxTime?: number,
  ): Promise<PlaceOrderResult> => {
    // this method can be called recursively on swap failures retries.
    // if max time exceeded, don't try to match
    if (maxTime && Date.now() > maxTime) {
      assert(discardRemaining, 'discardRemaining must be true on recursive calls where maxTime could exceed');
      this.logger.info(`addOwnOrder max time exceeded. order (${JSON.stringify(order)}) won't be matched`);

      // returning the remaining order to be rolled back and handled by the initial call
      return Promise.resolve({
        internalMatches: [],
        swapResults: [],
        remainingOrder: order,
      });
    }

    // fetch the current matchingEngine
    const matchingEngine = this.matchingEngines.get(order.pairId);
    if (!matchingEngine) {
      throw errors.PAIR_DOES_NOT_EXIST(order.pairId);
    }

    // perform match. maker orders will be removed from the repository
    const matchingResult = matchingEngine.match(order);

    // instantiate the final response object
    const result: PlaceOrderResult = {
      internalMatches: [],
      swapResults: [],
      remainingOrder: matchingResult.remainingOrder,
    };

    // instantiate a container for failed swaps, for retry purposes
    const swapFailures: StampedOwnOrder[] = [];

    // append the taker quantity to the remaining order, after making sure it's initialized.
    // if the maker is given, re-add it to the repository
    const rejectNonInternalMatch = (taker: StampedOwnOrder, maker?: StampedPeerOrder) => {
      result.remainingOrder = result.remainingOrder || { ...order, quantity: 0 };
      result.remainingOrder.quantity += taker.quantity;

      if (maker) {
        matchingEngine.addPeerOrder(maker);
      }
    };

    // iterate over the matches
    for (const { maker, taker } of matchingResult.matches) {
      const portion: OrderPortion = { orderId: maker.id, pairId: maker.pairId, quantity: maker.quantity };
      if (orders.isOwnOrder(maker)) {
        // internal match
        result.internalMatches.push(maker);
        this.emit('ownOrder.filled', portion);
        onUpdate && onUpdate({ case: PlaceOrderEventCase.InternalMatch, payload: maker });
      } else {
        // non-internal match
        if (!this.swaps || !this.swaps.verifyExecution(maker, taker)) {
          rejectNonInternalMatch(taker, maker);
          continue;
        }

        this.emit('peerOrder.filled', portion);
        try {
          const swapResult = await this.swaps.executeSwap(maker, taker);
          result.swapResults.push(swapResult);
          onUpdate && onUpdate({ case: PlaceOrderEventCase.SwapResult, payload: swapResult });
        } catch (err) {
          // we can either push to swapFailures, or reject in case of non-retry errors
          swapFailures.push(taker);
        }
      }
    }

    // if we have swap failures, attempt one retry for all available quantity. don't re-add the maker orders
    if (swapFailures.length > 0) {
      // aggregate failures quantities with the remaining order
      const remainingOrder: StampedOwnOrder = result.remainingOrder || { ...order, quantity: 0 };
      swapFailures.forEach(order => remainingOrder.quantity += order.quantity);

      // invoke addOwnOrder recursively, append matches/swaps and set the consecutive remaining order
      const remainingOrderResult = await this.addOwnOrder(remainingOrder, false, onUpdate, maxTime);
      result.internalMatches.push(...remainingOrderResult.internalMatches);
      result.swapResults.push(...remainingOrderResult.swapResults);
      result.remainingOrder = remainingOrderResult.remainingOrder;
    }

    const { remainingOrder } = result;
    if (remainingOrder && !discardRemaining) {
      matchingEngine.addOwnOrder(remainingOrder);
      this.localIdMap.set(remainingOrder.localId, { orderId: remainingOrder.id, pairId: remainingOrder.pairId });
      this.emit('ownOrder.added', remainingOrder);
      this.logger.debug(`order added: ${JSON.stringify(remainingOrder)}`);

      this.broadcastOrder(remainingOrder);
      onUpdate && onUpdate({ case: PlaceOrderEventCase.RemainingOrder, payload: remainingOrder });
    }

    return result;
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
   * @param takerPubKey the node pub key of the taker who filled this order, if applicable
   * @returns true if an order was removed, otherwise false
   */
  private removeOwnOrder = (orderId: string, pairId: string, takerPubKey?: string): boolean => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      this.logger.warn(`invalid pairId: ${pairId}`);
      return false;
    }

    const removedOrder = matchingEngine.removeOwnOrder(orderId);
    if (!removedOrder) {
      this.logger.warn(`invalid orderId: ${pairId}`);
      return false;
    }

    this.localIdMap.delete(removedOrder.localId);
    this.logger.debug(`order removed: ${JSON.stringify(orderId)}`);

    if (this.pool) {
      this.pool.broadcastOrderInvalidation({
        orderId,
        pairId,
        quantity: removedOrder.quantity,
      }, takerPubKey);
    }

    return true;
  }

  private removePeerOrder = (orderId: string, pairId: string, quantityToRemove?: number): orders.StampedPeerOrder | undefined => {
    const matchingEngine = this.matchingEngines.get(pairId);
    if (!matchingEngine) {
      this.logger.warn(`incoming order invalidation: invalid pairId (${pairId})`);
      return;
    }
    const removedOrder = matchingEngine.removePeerOrderQuantity(orderId, quantityToRemove);
    if (!removedOrder) {
      this.logger.warn(`incoming order invalidation: invalid orderId (${orderId})`);
      return;
    } else {
      assert(removedOrder.quantity === quantityToRemove, 'order quantity must equal quantityToRemove');
      this.emit('peerOrder.invalidation', { orderId, pairId, quantity: removedOrder.quantity });
      return removedOrder;
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
          quantity: order.quantity,
        });
      });
    });
  }

  /**
   * Send local orders to a given peer in an [[OrdersPacket].
   * @param reqId the request id of a [[GetOrdersPacket]] packet that this method is responding to
   * @param pairIds a list of trading pair ids, only orders belonging to one of these pairs will be sent
   */
  private sendOrders = async (peer: Peer, reqId: string, pairIds: string[]) => {
    const outgoingOrders: orders.OutgoingOrder[] = [];
    this.matchingEngines.forEach((matchingEngine) => {
      // send only requested pairIds
      if (pairIds.includes(matchingEngine.pairId)) {
        const orders = matchingEngine.getOwnOrders();
        orders.buy.forEach(order => outgoingOrders.push(this.createOutgoingOrder(order)));
        orders.sell.forEach(order => outgoingOrders.push(this.createOutgoingOrder(order)));
      }
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

  private stampOwnOrder = (order: OwnOrder): StampedOwnOrder  => {
    // verify localId isn't duplicated. generate one if it's blank
    if (order.localId === '') {
      order.localId = uuidv1();
    } else if (this.localIdMap.has(order.localId)) {
      throw errors.DUPLICATE_ORDER(order.localId);
    }

    return { ...order, id: uuidv1(), createdAt: ms() };
  }

  private createOutgoingOrder = (order: orders.StampedOwnOrder): orders.OutgoingOrder => {
    const { createdAt, localId, ...outgoingOrder } = order;
    return outgoingOrder;
  }
}

export default OrderBook;
