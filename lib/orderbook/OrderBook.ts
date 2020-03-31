import assert from 'assert';
import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import TradingPair from './TradingPair';
import errors from './errors';
import swapsErrors from '../swaps/errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import Logger from '../Logger';
import { derivePairId, ms, setTimeoutPromise } from '../utils/utils';
import { getAlias } from '../utils/aliasUtils';
import { Models } from '../db/DB';
import Swaps from '../swaps/Swaps';
import { limits, maxLimits } from '../constants/limits';
import { SwapClientType, SwapFailureReason, SwapPhase, SwapRole, XuNetwork } from '../constants/enums';
import { CurrencyFactory, CurrencyInstance, PairInstance } from '../db/types';
import { IncomingOrder, isOwnOrder, Order, OrderBookThresholds, OrderIdentifier, OrderPortion, OutgoingOrder, OwnLimitOrder, OwnMarketOrder,
  OwnOrder, Pair, PeerOrder, PlaceOrderEvent, PlaceOrderEventType, PlaceOrderResult } from './types';
import { SwapFailedPacket, SwapRequestPacket } from '../p2p/packets';
import { SwapDeal, SwapFailure, SwapSuccess } from '../swaps/types';
// We add the Bluebird import to ts-ignore because it's actually being used.
// @ts-ignore
import Bluebird from 'bluebird';

interface OrderBook {
  /** Adds a listener to be called when a remote order was added. */
  on(event: 'peerOrder.incoming', listener: (order: PeerOrder) => void): this;
  /** Adds a listener to be called when all or part of a remote order was invalidated and removed */
  on(event: 'peerOrder.invalidation', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a remote order was filled by an own order and removed */
  on(event: 'peerOrder.filled', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a local order was swapped and removed, after it was filled and executed remotely */
  on(event: 'ownOrder.swapped', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a local order was filled by an own order and removed */
  on(event: 'ownOrder.filled', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when a local order was added */
  on(event: 'ownOrder.added', listener: (order: OwnOrder) => void): this;
  /** Adds a listener to be called when a local order was removed */
  on(event: 'ownOrder.removed', listener: (order: OrderPortion) => void): this;

  /** Notifies listeners that a remote order was added */
  emit(event: 'peerOrder.incoming', order: PeerOrder): boolean;
  /** Notifies listeners that all or part of a remote order was invalidated and removed */
  emit(event: 'peerOrder.invalidation', order: OrderPortion): boolean;
  /** Notifies listeners that all or part of a remote order was filled by an own order and removed */
  emit(event: 'peerOrder.filled', order: OrderPortion): boolean;
  /** Notifies listeners that all or part of a local order was swapped and removed, after it was filled and executed remotely */
  emit(event: 'ownOrder.swapped', order: OrderPortion): boolean;
  /** Notifies listeners that all or part of a local order was filled by an own order and removed */
  emit(event: 'ownOrder.filled', order: OrderPortion): boolean;
  /** Notifies listeners that a local order was added */
  emit(event: 'ownOrder.added', order: OwnOrder): boolean;
  /** Notifies listeners that a local order was removed */
  emit(event: 'ownOrder.removed', order: OrderPortion): boolean;
}

/**
 * Represents an order book containing all orders for all active trading pairs. This encompasses
 * all orders tracked locally and is the primary interface with which other modules interact with
 * the order book.
 */
class OrderBook extends EventEmitter {
  /** A map between active trading pair ids and trading pair instances. */
  public tradingPairs = new Map<string, TradingPair>();
  public nomatching: boolean;

  /** A map between own orders local id and their global id. */
  private localIdMap = new Map<string, OrderIdentifier>();

  /** A map of supported currency tickers to currency instances. */
  private currencyInstances = new Map<string, CurrencyInstance>();
  /** A map of supported trading pair tickers and pair database instances. */
  private pairInstances = new Map<string, PairInstance>();
  private repository: OrderBookRepository;
  private thresholds: OrderBookThresholds;
  private logger: Logger;
  private nosanityswaps: boolean;
  private nobalancechecks: boolean;
  private maxlimits: boolean;
  private pool: Pool;
  private swaps: Swaps;

  /** Max time for placeOrder iterations (due to swaps failures retries). */
  private static readonly MAX_PLACEORDER_ITERATIONS_TIME = 10000; // 10 sec
  /** Max time for sanity swaps to succeed. */
  private static readonly MAX_SANITY_SWAP_TIME = 15000;

  /** Gets an array of supported pair ids. */
  public get pairIds() {
    return Array.from(this.pairInstances.keys());
  }

  public get currencies() {
    return this.currencyInstances;
  }

  constructor({ logger, models, thresholds, pool, swaps, nosanityswaps, nobalancechecks, nomatching = false, maxlimits = false }:
  {
    logger: Logger,
    models: Models,
    thresholds: OrderBookThresholds,
    pool: Pool,
    swaps: Swaps,
    nosanityswaps: boolean,
    nobalancechecks: boolean,
    nomatching?: boolean,
    maxlimits?: boolean,
  }) {
    super();

    this.logger = logger;
    this.pool = pool;
    this.swaps = swaps;
    this.nomatching = nomatching;
    this.nosanityswaps = nosanityswaps;
    this.nobalancechecks = nobalancechecks;
    this.maxlimits = maxlimits;
    this.thresholds = thresholds;

    this.repository = new OrderBookRepository(models);

    this.bindPool();
    this.bindSwaps();
  }

  private static createOutgoingOrder = (order: OwnOrder): OutgoingOrder => {
    const { createdAt, localId, initialQuantity, hold, ...outgoingOrder } = order;
    return outgoingOrder ;
  }

  private checkThresholdCompliance = (order: OwnOrder | IncomingOrder) => {
    const { minQuantity } = this.thresholds;
    return order.quantity >= minQuantity;
  }

  /**
   * Checks that a currency advertised by a peer is known to us, has a swap client identifier,
   * and that their token identifier matches ours.
   */
  private isPeerCurrencySupported = (peer: Peer, currency: string) => {
    const currencyAttributes = this.getCurrencyAttributes(currency);
    if (!currencyAttributes) {
      return false; // we don't know about this currency
    }

    if (!peer.getIdentifier(currencyAttributes.swapClient, currency)) {
      return false; // peer did not provide a swap client identifier for this currency
    }

    // ensure that our token identifiers match
    const ourTokenIdentifier = this.pool.getTokenIdentifier(currency);
    const peerTokenIdentifier = peer.getTokenIdentifier(currency);
    return ourTokenIdentifier === peerTokenIdentifier;
  }

  private bindPool = () => {
    this.pool.on('packet.order', this.addPeerOrder);
    this.pool.on('packet.orderInvalidation', this.handleOrderInvalidation);
    this.pool.on('packet.getOrders', this.sendOrders);
    this.pool.on('packet.swapRequest', this.handleSwapRequest);
    this.pool.on('peer.close', this.removePeerOrders);
    this.pool.on('peer.pairDropped', this.removePeerPair);
    this.pool.on('peer.verifyPairs', this.verifyPeerPairs);
    this.pool.on('peer.nodeStateUpdate', this.checkPeerCurrencies);
  }

  private bindSwaps = () => {
    this.swaps.on('swap.paid', async (swapSuccess) => {
      if (swapSuccess.role === SwapRole.Maker) {
        const { orderId, pairId, quantity, peerPubKey } = swapSuccess;

        // we must remove the amount that was put on hold while the swap was pending for the remaining order
        this.removeOrderHold(orderId, pairId, quantity);

        const ownOrder = this.removeOwnOrder(orderId, pairId, quantity, peerPubKey);
        this.emit('ownOrder.swapped', { pairId, quantity, id: orderId });
        await this.persistTrade(swapSuccess.quantity, ownOrder, undefined, swapSuccess.rHash);
      }
    });
    this.swaps.on('swap.failed', (deal) => {
      if (deal.role === SwapRole.Maker && (deal.phase === SwapPhase.SwapAccepted || deal.phase === SwapPhase.SendingPayment)) {
        // if our order is the maker and the swap failed after it was agreed to but before it was executed
        // we must release the hold on the order that we set when we agreed to the deal
        this.removeOrderHold(deal.orderId, deal.pairId, deal.quantity!);
      }
    });
  }

  /** Loads the supported pairs and currencies from the database. */
  public init = async () => {
    const [pairs, currencies] = await Promise.all([this.repository.getPairs(), this.repository.getCurrencies()]);

    currencies.forEach(currency => this.currencyInstances.set(currency.id, currency));
    pairs.forEach((pair) => {
      this.pairInstances.set(pair.id, pair);
      this.tradingPairs.set(pair.id, new TradingPair(this.logger, pair.id, this.nomatching));
    });

    this.pool.updatePairs(this.pairIds);
  }

  public getCurrencyAttributes(currency: string) {
    const currencyInstance = this.currencyInstances.get(currency);
    return currencyInstance ? currencyInstance.toJSON() : undefined;
  }

  /**
   * Gets all trades or a limited number of trades from the database.
   */
  public getTrades = async (limit?: number) => {
    const response = await this.repository.getTrades(limit);
    return response;
  }

  /**
   * Get lists of buy and sell orders of peers.
   */
  public getPeersOrders = (pairId: string) => {
    const tp = this.getTradingPair(pairId);
    return tp.getPeersOrders();
  }

  /**
   * Get lists of this node's own buy and sell orders.
   */
  public getOwnOrders = (pairId: string) => {
    const tp = this.getTradingPair(pairId);
    return tp.getOwnOrders();
  }

  /** Get the trading pair instance for a given pairId, or throw an error if none exists. */
  private getTradingPair = (pairId: string): TradingPair => {
    const tp = this.tradingPairs.get(pairId);
    if (!tp) {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
    }
    return tp;
  }

  /**
   * Gets an own order by order id and pair id.
   * @returns The order matching parameters, or undefined if no order could be found.
   */
  public getOwnOrder = (orderId: string, pairId: string): OwnOrder => {
    const tp = this.getTradingPair(pairId);
    return tp.getOwnOrder(orderId);
  }

  private tryGetOwnOrder = (orderId: string, pairId: string): OwnOrder | undefined => {
    try {
      return this.getOwnOrder(orderId, pairId);
    } catch (err) {
      return;
    }
  }

  public getPeerOrder = (orderId: string, pairId: string, peerPubKey: string): PeerOrder => {
    const tp = this.getTradingPair(pairId);
    return tp.getPeerOrder(orderId, peerPubKey);
  }

  public addPair = async (pair: Pair) => {
    const pairId = derivePairId(pair);
    if (this.pairInstances.has(pairId)) {
      throw errors.PAIR_ALREADY_EXISTS(pairId);
    }
    if (!this.currencyInstances.has(pair.baseCurrency)) {
      throw errors.CURRENCY_DOES_NOT_EXIST(pair.baseCurrency);
    }
    if (!this.currencyInstances.has(pair.quoteCurrency)) {
      throw errors.CURRENCY_DOES_NOT_EXIST(pair.quoteCurrency);
    }

    const pairInstance = await this.repository.addPair(pair);
    this.pairInstances.set(pairInstance.id, pairInstance);
    this.tradingPairs.set(pairInstance.id, new TradingPair(this.logger, pairInstance.id, this.nomatching));

    this.pool.updatePairs(this.pairIds);
    return pairInstance;
  }

  public addCurrency = async (currency: CurrencyFactory) => {
    if (this.currencyInstances.has(currency.id)) {
      throw errors.CURRENCY_ALREADY_EXISTS(currency.id);
    }
    if (currency.swapClient === SwapClientType.Raiden && !currency.tokenAddress) {
      throw errors.CURRENCY_MISSING_ETHEREUM_CONTRACT_ADDRESS(currency.id);
    }
    const currencyInstance = await this.repository.addCurrency({ ...currency, decimalPlaces: currency.decimalPlaces || 8 });
    this.currencyInstances.set(currencyInstance.id, currencyInstance);
    this.swaps.swapClientManager.add(currencyInstance);
  }

  public removeCurrency = async (currencyId: string) => {
    const currency = this.currencyInstances.get(currencyId);
    if (currency) {
      for (const pair of this.pairInstances.values()) {
        if (currencyId === pair.baseCurrency || currencyId === pair.quoteCurrency) {
          throw errors.CURRENCY_CANNOT_BE_REMOVED(currencyId, pair.id);
        }
      }
      this.currencyInstances.delete(currencyId);
      this.swaps.swapClientManager.remove(currencyId);
      await currency.destroy();
    } else {
      throw errors.CURRENCY_DOES_NOT_EXIST(currencyId);
    }
  }

  public removePair = (pairId: string) => {
    const pair = this.pairInstances.get(pairId);
    if (!pair) {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
    }

    this.pairInstances.delete(pairId);
    this.tradingPairs.delete(pairId);

    this.pool.updatePairs(this.pairIds);
    return pair.destroy();
  }

  public placeLimitOrder = async (order: OwnLimitOrder, immediateOrCancel = false,
    onUpdate?: (e: PlaceOrderEvent) => void): Promise<PlaceOrderResult> => {
    const stampedOrder = this.stampOwnOrder(order);
    if (this.nomatching) {
      this.addOwnOrder(stampedOrder);
      onUpdate && onUpdate({ type: PlaceOrderEventType.RemainingOrder, payload: stampedOrder });

      return {
        internalMatches: [],
        swapSuccesses: [],
        swapFailures: [],
        remainingOrder: stampedOrder,
      };
    }

    return this.placeOrder(stampedOrder, immediateOrCancel, onUpdate, Date.now() + OrderBook.MAX_PLACEORDER_ITERATIONS_TIME);
  }

  public placeMarketOrder = async (order: OwnMarketOrder, onUpdate?: (e: PlaceOrderEvent) => void): Promise<PlaceOrderResult> => {
    if (this.nomatching) {
      throw errors.MARKET_ORDERS_NOT_ALLOWED();
    }

    const stampedOrder = this.stampOwnOrder({ ...order, price: order.isBuy ? Number.POSITIVE_INFINITY : 0 });
    const addResult = await this.placeOrder(stampedOrder, true, onUpdate, Date.now() + OrderBook.MAX_PLACEORDER_ITERATIONS_TIME);
    delete addResult.remainingOrder;
    return addResult;
  }

  /**
   * Places an order in the order book. This method first attempts to match the order with existing
   * orders by price and initiate swaps for any matches with peer orders. It can be called recursively
   * for any portions of the order that fail swaps.
   * @param order the order to place
   * @param discardRemaining whether to discard any unmatched portion of the order, if `false` the
   * unmatched portion will enter the order book.
   * @param onUpdate a callback for when there are updates to the matching and order placement
   * routine including internal matches, successful swaps, failed swaps, and remaining orders
   * @param maxTime the deadline in epoch milliseconds for this method to end recursive calls
   */
  private placeOrder = async (
    order: OwnOrder,
    discardRemaining = false,
    onUpdate?: (e: PlaceOrderEvent) => void,
    maxTime?: number,
  ): Promise<PlaceOrderResult> => {
    // Check if order complies to thresholds
    if (this.thresholds.minQuantity > 0) {
      if (!this.checkThresholdCompliance(order)) {
        throw errors.MIN_QUANTITY_VIOLATED(order.id);
      }
    }

    // this method can be called recursively on swap failures retries.
    // if max time exceeded, don't try to match
    if (maxTime && Date.now() > maxTime) {
      assert(discardRemaining, 'discardRemaining must be true on recursive calls where maxTime could exceed');
      this.logger.debug(`placeOrder max time exceeded. order (${JSON.stringify(order)}) won't be fully matched`);

      // returning the remaining order to be rolled back and handled by the initial call
      return {
        internalMatches: [],
        swapSuccesses: [],
        swapFailures: [],
        remainingOrder: order,
      };
    }

    const { outboundCurrency, inboundCurrency, outboundAmount, inboundAmount } =
        Swaps.calculateInboundOutboundAmounts(order.quantity, order.price, order.isBuy, order.pairId);
    const outboundSwapClient = this.swaps.swapClientManager.get(outboundCurrency);
    const inboundSwapClient = this.swaps.swapClientManager.get(inboundCurrency);

    if (!this.nobalancechecks) {
      // check if clients exists
      if (!outboundSwapClient) {
        throw swapsErrors.SWAP_CLIENT_NOT_FOUND(outboundCurrency);
      }
      if (!inboundSwapClient) {
        throw swapsErrors.SWAP_CLIENT_NOT_FOUND(inboundCurrency);
      }

      // check if sufficient outbound channel capacity exists
      const totalOutboundAmount = outboundSwapClient.totalOutboundAmount(outboundCurrency);
      if (outboundAmount > totalOutboundAmount) {
        throw errors.INSUFFICIENT_OUTBOUND_BALANCE(outboundCurrency, outboundAmount, totalOutboundAmount);
      }
    }

    // check if order abides by limits
    let outboundCurrencyLimit: number;
    let inboundCurrencyLimit: number;

    if (this.pool.getNetwork() === XuNetwork.MainNet && !this.maxlimits) {
      // if we're on mainnet and we haven't specified that we're using maximum limits
      // then use the hardcoded mainnet order size limits
      outboundCurrencyLimit = limits[outboundCurrency];
      inboundCurrencyLimit = limits[inboundCurrency];
    } else {
      // otherwise use the maximum channel sizes as order size limits
      outboundCurrencyLimit = maxLimits[outboundCurrency];
      inboundCurrencyLimit = maxLimits[inboundCurrency];
    }

    if (outboundCurrencyLimit && outboundAmount > outboundCurrencyLimit) {
      throw errors.EXCEEDING_LIMIT(outboundCurrency, outboundAmount, outboundCurrencyLimit);
    }
    if (inboundCurrencyLimit && inboundAmount > inboundCurrencyLimit) {
      throw errors.EXCEEDING_LIMIT(inboundCurrency, inboundAmount, inboundCurrencyLimit);
    }

    // perform matching routine. maker orders that are matched will be removed from the order book.
    const tp = this.getTradingPair(order.pairId);
    const matchingResult = tp.match(order);

    /** Any portion of the placed order that could not be swapped or matched internally. */
    let { remainingOrder } = matchingResult;
    /** Local orders that matched with the placed order. */
    const internalMatches: OwnOrder[] = [];
    /** Successful swaps performed for the placed order. */
    const swapSuccesses: SwapSuccess[] = [];
    /** Failed swaps attempted for the placed order. */
    const swapFailures: SwapFailure[] = [];

    /**
     * The routine for retrying a portion of the order that failed a swap attempt.
     * @param failedSwapQuantity the quantity of the failed portion to retry
     */
    const retryFailedSwap = async (failedSwapQuantity: number) => {
      this.logger.debug(`repeating matching routine for ${order.id} for failed quantity of ${failedSwapQuantity}`);
      const orderToRetry: OwnOrder = { ...order, quantity: failedSwapQuantity };

      // invoke placeOrder recursively, append matches/swaps and any remaining order
      const retryResult = await this.placeOrder(orderToRetry, true, onUpdate, maxTime);
      internalMatches.push(...retryResult.internalMatches);
      swapSuccesses.push(...retryResult.swapSuccesses);
      if (retryResult.remainingOrder) {
        if (remainingOrder) {
          remainingOrder.quantity += retryResult.remainingOrder.quantity;
        } else {
          remainingOrder = retryResult.remainingOrder;
        }
      }
    };

    /**
     * The routine for handling matches found in the order book. This can be run in parallel
     * so that all matches, including those which require swaps with peers, can be executed
     * simultaneously.
     */
    const handleMatch = async (maker: Order, taker: OwnOrder) => {
      const portion: OrderPortion = { id: maker.id, pairId: maker.pairId, quantity: maker.quantity };
      if (isOwnOrder(maker)) {
        // this is an internal match which is effectively executed immediately upon being found
        this.logger.info(`internal match executed on taker ${taker.id} and maker ${maker.id} for ${maker.quantity}`);
        portion.localId = maker.localId;
        internalMatches.push(maker);
        this.emit('ownOrder.filled', portion);
        await this.persistTrade(portion.quantity, maker, taker);
        onUpdate && onUpdate({ type: PlaceOrderEventType.InternalMatch, payload: maker });
      } else {
        // this is a match with a peer order which cannot be considered executed until after a
        // successful swap, which is an asynchronous process that can fail for numerous reasons
        const alias = getAlias(maker.peerPubKey);
        this.logger.debug(`matched with peer ${maker.peerPubKey} (${alias}), executing swap on taker ${taker.id} and maker ${maker.id} for ${maker.quantity}`);
        try {
          const swapResult = await this.executeSwap(maker, taker);
          if (swapResult.quantity < maker.quantity) {
            // swap was only partially completed
            portion.quantity = swapResult.quantity;
            const rejectedQuantity = maker.quantity - swapResult.quantity;
            this.logger.info(`match partially executed on taker ${taker.id} and maker ${maker.id} for ${swapResult.quantity} ` +
              `with peer ${maker.peerPubKey} (${alias}), ${rejectedQuantity} quantity not accepted and will repeat matching routine`);
            await retryFailedSwap(rejectedQuantity);
          } else {
            this.logger.info(`match executed on taker ${taker.id} and maker ${maker.id} for ${maker.quantity} with peer ${maker.peerPubKey} (${alias})`);
          }
          swapSuccesses.push(swapResult);
          onUpdate && onUpdate({ type: PlaceOrderEventType.SwapSuccess, payload: swapResult });
        } catch (err) {
          const failMsg = `swap for ${portion.quantity} failed during order matching`;
          if (typeof err === 'number' && SwapFailureReason[err] !== undefined) {
            // treat the error as a SwapFailureReason
            this.logger.warn(`${failMsg} due to ${SwapFailureReason[err]}, will repeat matching routine for failed quantity`);

            const swapFailure: SwapFailure = {
              failureReason: err,
              orderId: maker.id,
              pairId: maker.pairId,
              quantity: portion.quantity,
              peerPubKey: maker.peerPubKey,
            };
            swapFailures.push(swapFailure);
            onUpdate && onUpdate({ type: PlaceOrderEventType.SwapFailure, payload: swapFailure });
            await retryFailedSwap(portion.quantity);
          } else {
            // treat this as a critical error and abort matching, we only expect SwapFailureReasons to be thrown in the try block above
            this.logger.error(`${failMsg} due to unexpected error`, err);
            throw err;
          }
        }
      }
    };

    // iterate over the matches to be executed in parallel
    const matchPromises: Promise<void>[] = [];
    for (const { maker, taker } of matchingResult.matches) {
      matchPromises.push(handleMatch(maker, taker));
    }

    // wait for all matches to complete execution, any portions that cannot be executed due to
    // failed swaps will be added to the remaining order which may be added to the order book.
    await Promise.all(matchPromises);

    if (remainingOrder) {
      if (discardRemaining) {
        remainingOrder = undefined;
      } else {
        this.addOwnOrder(remainingOrder);
        onUpdate && onUpdate({ type: PlaceOrderEventType.RemainingOrder, payload: remainingOrder });
      }
    }

    return {
      internalMatches,
      swapSuccesses,
      swapFailures,
      remainingOrder,
    };
  }

  /**
   * Executes a swap between maker and taker orders. Emits the `peerOrder.filled` event if the swap
   * succeeds and `peerOrder.invalidation` if the swap fails.
   * @returns A promise that resolves to a [[SwapSuccess]] once the swap is completed, throws a [[SwapFailureReason]] if it fails
   */
  public executeSwap = async (maker: PeerOrder, taker: OwnOrder): Promise<SwapSuccess> => {
    // make sure the order is in the database before we begin the swap
    await this.repository.addOrderIfNotExists(maker);
    try {
      const swapResult = await this.swaps.executeSwap(maker, taker);
      this.emit('peerOrder.filled', maker);
      await this.persistTrade(swapResult.quantity, maker, taker, swapResult.rHash);
      return swapResult;
    } catch (err) {
      const failureReason: number = err;
      this.emit('peerOrder.invalidation', maker);
      this.logger.error(`swap between orders ${maker.id} & ${taker.id} failed due to ${SwapFailureReason[failureReason]}`);
      throw failureReason;
    }
  }

  /**
   * Adds an own order to the order book and broadcasts it to peers.
   * @returns false if it's a duplicated order or with an invalid pair id, otherwise true
   */
  private addOwnOrder = (order: OwnOrder): boolean => {
    const tp = this.getTradingPair(order.pairId);
    const result = tp.addOwnOrder(order);
    assert(result, 'own order id is duplicated');

    this.localIdMap.set(order.localId, { id: order.id, pairId: order.pairId });

    this.emit('ownOrder.added', order);

    const outgoingOrder = OrderBook.createOutgoingOrder(order);
    this.pool.broadcastOrder(outgoingOrder);
    return true;
  }

  private persistTrade = async (quantity: number, makerOrder: Order, takerOrder?: OwnOrder, rHash?: string) => {
    const addOrderPromises = [this.repository.addOrderIfNotExists(makerOrder)];
    if (takerOrder) {
      addOrderPromises.push(this.repository.addOrderIfNotExists(takerOrder));
    }
    await Promise.all(addOrderPromises);
    await this.repository.addTrade({
      quantity,
      rHash,
      makerOrderId: makerOrder.id,
      takerOrderId: takerOrder ? takerOrder.id : undefined,
    });
  }

  /**
   * Adds an incoming peer order to the local order book. It timestamps the order based on when it
   * enters the order book and also records its initial quantity upon being received.
   * @returns `false` if it's a duplicated order or with an invalid pair id, otherwise true
   */
  private addPeerOrder = (order: IncomingOrder): boolean => {
    if (this.thresholds.minQuantity > 0) {
      if (!this.checkThresholdCompliance(order)) {
        this.removePeerOrder(order.id, order.pairId, order.peerPubKey, order.quantity);
        this.logger.debug('incoming peer order does not comply with configured threshold');
        return false;
      }
    }

    const tp = this.tradingPairs.get(order.pairId);
    if (!tp) {
      // TODO: penalize peer for sending an order for an unsupported pair
      return false;
    }

    const stampedOrder: PeerOrder = { ...order, createdAt: ms(), initialQuantity: order.quantity };

    if (!tp.addPeerOrder(stampedOrder)) {
      this.logger.debug(`incoming peer order is duplicated: ${order.id}`);
      // TODO: penalize peer
      return false;
    }

    this.emit('peerOrder.incoming', stampedOrder);

    return true;
  }

  public getOwnOrderByLocalId = (localId: string) => {
    const orderIdentifier = this.localIdMap.get(localId);
    if (!orderIdentifier) {
      throw errors.LOCAL_ID_DOES_NOT_EXIST(localId);
    }

    const order = this.getOwnOrder(orderIdentifier.id, orderIdentifier.pairId);
    return order;
  }

  /**
   * Removes all or part of an order from the order book by its local id. Throws an error if the
   * specified pairId is not supported or if the order to cancel could not be found.
   * @param allowAsyncRemoval whether to allow an eventual async removal of the order in case
   * some quantity of the order is on hold and cannot be immediately removed. If false, while some quantity of
   * the order is on hold, an error will be thrown.
   * @param quantityToRemove the quantity to remove from the order, if undefined then the entire
   * order is removed.
   * @returns any quantity of the order that was on hold and could not be immediately removed (if allowed).
   */
  public removeOwnOrderByLocalId = (localId: string, allowAsyncRemoval?: boolean, quantityToRemove?: number) => {
    const order = this.getOwnOrderByLocalId(localId);

    let remainingQuantityToRemove = quantityToRemove || order.quantity;

    if (remainingQuantityToRemove > order.quantity) {
      // quantity to be removed can't be higher than order's quantity.
      throw errors.QUANTITY_DOES_NOT_MATCH(remainingQuantityToRemove, order.quantity);
    }

    const removableQuantity = order.quantity - order.hold;
    if (remainingQuantityToRemove <= removableQuantity) {
      this.removeOwnOrder(order.id, order.pairId, remainingQuantityToRemove);
      remainingQuantityToRemove = 0;
    } else {
      // we can't immediately remove the entire quantity because of a hold on the order.
      if (!allowAsyncRemoval) {
        throw errors.QUANTITY_ON_HOLD(localId, order.hold);
      }

      this.removeOwnOrder(order.id, order.pairId, removableQuantity);
      remainingQuantityToRemove -= removableQuantity;

      const failedHandler = (deal: SwapDeal) => {
        if (deal.orderId === order.id) {
          // remove the portion that failed now that it's not on hold
          const quantityToRemove = Math.min(deal.quantity!, remainingQuantityToRemove);
          this.removeOwnOrder(order.id, order.pairId, quantityToRemove);
          cleanup(quantityToRemove);
        }
      };

      const paidHandler = (result: SwapSuccess) => {
        if (result.orderId === order.id) {
          const quantityToRemove = Math.min(result.quantity, remainingQuantityToRemove);
          cleanup(quantityToRemove);
        }
      };

      const cleanup = (quantity: number) => {
        remainingQuantityToRemove -= quantity;
        this.logger.debug(`removed hold of ${quantity} on local order ${localId}, ${remainingQuantityToRemove} remaining`);
        if (remainingQuantityToRemove === 0) {
          // we can stop listening for swaps once all holds are cleared
          this.swaps.removeListener('swap.failed', failedHandler);
          this.swaps.removeListener('swap.paid', paidHandler);
        }
      };

      this.swaps.on('swap.failed', failedHandler);
      this.swaps.on('swap.paid', paidHandler);
    }

    return remainingQuantityToRemove;
  }

  private addOrderHold = (orderId: string, pairId: string, holdAmount: number) => {
    const tp = this.getTradingPair(pairId);
    tp.addOrderHold(orderId, holdAmount);
  }

  private removeOrderHold = (orderId: string, pairId: string, holdAmount: number) => {
    const tp = this.getTradingPair(pairId);
    tp.removeOrderHold(orderId, holdAmount);
  }

  /**
   * Removes all or part of an own order from the order book and broadcasts an order invalidation packet.
   * @param quantityToRemove the quantity to remove from the order, if undefined then the full order is removed
   * @param takerPubKey the node pub key of the taker who filled this order, if applicable
   * @returns the removed portion of the order
   */
  private removeOwnOrder = (orderId: string, pairId: string, quantityToRemove?: number, takerPubKey?: string) => {
    const tp = this.getTradingPair(pairId);
    try {
      const removeResult = tp.removeOwnOrder(orderId, quantityToRemove);
      this.emit('ownOrder.removed', removeResult.order);
      if (removeResult.fullyRemoved) {
        this.localIdMap.delete(removeResult.order.localId);
      }

      this.pool.broadcastOrderInvalidation(removeResult.order, takerPubKey);
      return removeResult.order;
    } catch (err) {
      if (quantityToRemove !== undefined) {
        this.logger.error(`error while removing ${quantityToRemove} of order (${orderId})`, err);
      } else {
        this.logger.error(`error while removing order (${orderId})`, err);
      }
      throw err;
    }
  }

  /**
   * Removes all or part of a peer order from the order book and emits the `peerOrder.invalidation` event.
   * @param quantityToRemove the quantity to remove from the order, if undefined then the full order is removed
   */
  public removePeerOrder = (orderId: string, pairId: string, peerPubKey?: string, quantityToRemove?: number):
    { order: PeerOrder, fullyRemoved: boolean } => {
    const tp = this.getTradingPair(pairId);
    return tp.removePeerOrder(orderId, peerPubKey, quantityToRemove);
  }

  private removePeerOrders = (peerPubKey?: string) => {
    if (!peerPubKey) {
      return;
    }

    for (const pairId of this.pairInstances.keys()) {
      this.removePeerPair(peerPubKey, pairId);
    }
    this.logger.debug(`removed all orders for peer ${peerPubKey} (${getAlias(peerPubKey)})`);
  }

  private removePeerPair = (peerPubKey: string, pairId: string) => {
    const tp = this.getTradingPair(pairId);
    const orders = tp.removePeerOrders(peerPubKey);
    orders.forEach((order) => {
      this.emit('peerOrder.invalidation', order);
    });
  }

  private checkPeerCurrencies = (peer: Peer) => {
    const advertisedCurrencies = peer.getAdvertisedCurrencies();

    advertisedCurrencies.forEach((advertisedCurrency) => {
      if (!this.isPeerCurrencySupported(peer, advertisedCurrency)) {
        peer.disableCurrency(advertisedCurrency);
      } else {
        peer.enableCurrency(advertisedCurrency);
      }
    });
  }

  /**
   * Verifies the advertised trading pairs of a peer. Checks that the peer has advertised
   * lnd pub keys for both the base and quote currencies for each pair, and optionally attempts a
   * "sanity swap" for each currency which is a 1 satoshi for 1 satoshi swap of a given currency
   * that demonstrates that we can both accept and receive payments for this peer.
   * @param pairIds the list of trading pair ids to verify
   */
  private verifyPeerPairs = async (peer: Peer) => {
    /** An array of inactive trading pair ids that don't involve a disabled currency for this peer. */
    const pairIdsToVerify = peer.advertisedPairs.filter((pairId) => {
      if (peer.isPairActive(pairId)) {
        return false; // don't verify a pair that is already active
      }
      const [baseCurrency, quoteCurrency] = pairId.split('/');
      const peerCurrenciesEnabled = !peer.disabledCurrencies.has(baseCurrency)
        && !peer.disabledCurrencies.has(quoteCurrency);
      const ownCurrenciesConnected = this.swaps.swapClientManager.isConnected(baseCurrency)
        && this.swaps.swapClientManager.isConnected(quoteCurrency);
      return peerCurrenciesEnabled && ownCurrenciesConnected;
    });

    // identify the unique currencies we need to verify for specified trading pairs
    /** A map between currencies we are verifying and whether the currency is swappable. */
    const currenciesToVerify = new Map<string, boolean>();
    pairIdsToVerify.forEach((pairId) => {
      const [baseCurrency, quoteCurrency] = pairId.split('/');
      if (!peer.isCurrencyActive(baseCurrency)) {
        currenciesToVerify.set(baseCurrency, true);
      }
      if (!peer.isCurrencyActive(quoteCurrency)) {
        currenciesToVerify.set(quoteCurrency, true);
      }
    });

    currenciesToVerify.forEach(async (_, currency) => {
      const canRoute = await this.swaps.swapClientManager.canRouteToPeer(peer, currency);
      if (!canRoute) {
        // don't attempt to verify if we can use a currency if a route to peer is impossible
        currenciesToVerify.set(currency, false);
      }
    });

    if (!this.nosanityswaps) {
      const sanitySwapPromises: Promise<void>[] = [];

      // Set a time limit for all sanity swaps to complete.
      const sanitySwapTimeout = setTimeoutPromise(OrderBook.MAX_SANITY_SWAP_TIME, false);

      currenciesToVerify.forEach((swappable, currency) => {
        if (swappable && this.currencyInstances.has(currency)) {
          // perform sanity swaps for each of the currencies that we support
          const sanitySwapPromise = new Promise<void>(async (resolve) => {
            // success resolves to true if the sanity swap succeeds before the timeout
            const success = await Promise.race([this.swaps.executeSanitySwap(currency, peer), sanitySwapTimeout]);
            if (!success) {
              currenciesToVerify.set(currency, false);
            }
            resolve();
          });
          sanitySwapPromises.push(sanitySwapPromise);
        }
      });

      // wait for all sanity swaps to finish or timeout
      await Promise.all(sanitySwapPromises);
    }

    // activate verified currencies
    currenciesToVerify.forEach((swappable, currency) => {
      if (swappable) {
        peer.activateCurrency(currency);
      }
    });

    // activate pairs that have both currencies active
    const activationPromises: Promise<void>[] = [];
    pairIdsToVerify.forEach((pairId) => {
      const [baseCurrency, quoteCurrency] = pairId.split('/');
      if (peer.isCurrencyActive(baseCurrency) && peer.isCurrencyActive(quoteCurrency)) {
        activationPromises.push(peer.activatePair(pairId));
      }
    });
    await Promise.all(activationPromises);
  }

  /**
   * Send local orders to a given peer in an [[OrdersPacket].
   * @param reqId the request id of a [[GetOrdersPacket]] packet that this method is responding to
   * @param pairIds a list of trading pair ids, only orders belonging to one of these pairs will be sent
   */
  private sendOrders = async (peer: Peer, reqId: string, pairIds: string[]) => {
    const outgoingOrders: OutgoingOrder[] = [];
    this.tradingPairs.forEach((tp) => {
      // send only requested pairIds
      if (pairIds.includes(tp.pairId)) {
        const orders = tp.getOwnOrders();
        orders.buyArray.forEach(order => outgoingOrders.push(OrderBook.createOutgoingOrder(order)));
        orders.sellArray.forEach(order => outgoingOrders.push(OrderBook.createOutgoingOrder(order)));
      }
    });
    await peer.sendOrders(outgoingOrders, reqId);
  }

  public stampOwnOrder = (order: OwnLimitOrder): OwnOrder => {
    const id = uuidv1();
    // verify localId isn't duplicated. use global id if blank
    if (order.localId === '') {
      order.localId = id;
    } else if (this.localIdMap.has(order.localId)) {
      throw errors.DUPLICATE_ORDER(order.localId);
    }

    return { ...order, id, initialQuantity: order.quantity, hold: 0, createdAt: ms() };
  }

  private handleOrderInvalidation = (oi: OrderPortion, peerPubKey: string) => {
    try {
      const removeResult = this.removePeerOrder(oi.id, oi.pairId, peerPubKey, oi.quantity);
      this.emit('peerOrder.invalidation', removeResult.order);
    } catch {
      this.logger.error(`failed to remove order (${oi.id}) of peer ${peerPubKey} (${getAlias(peerPubKey)})`);
      // TODO: Penalize peer
    }
  }

  /**
   * Handles a request from a peer to create a swap deal. Checks if the order for the requested swap
   * is available and if a route exists to determine if the request should be accepted or rejected.
   * Responds to the peer with a swap response packet containing either an accepted quantity or rejection reason.
   */
  private handleSwapRequest = async (requestPacket: SwapRequestPacket, peer: Peer) => {
    assert(requestPacket.body, 'SwapRequestPacket does not contain a body');
    assert(this.swaps, 'swaps module is disabled');
    const { rHash, proposedQuantity, orderId, pairId } = requestPacket.body!;

    if (!Swaps.validateSwapRequest(requestPacket.body!)) {
      // TODO: penalize peer for invalid swap request
      await peer.sendPacket(new SwapFailedPacket({
        rHash,
        failureReason: SwapFailureReason.InvalidSwapRequest,
      }, requestPacket.header.id));
      return;
    }

    const order = this.tryGetOwnOrder(orderId, pairId);
    if (!order) {
      await peer.sendPacket(new SwapFailedPacket({
        rHash,
        failureReason: SwapFailureReason.OrderNotFound,
      }, requestPacket.header.id));
      return;
    }

    const availableQuantity = order.quantity - order.hold;
    if (availableQuantity > 0) {
      /** The quantity of the order that we will accept */
      const quantity = Math.min(proposedQuantity, availableQuantity);

      this.addOrderHold(order.id, pairId, quantity);
      await this.repository.addOrderIfNotExists(order);

      // try to accept the deal
      const orderToAccept = {
        quantity,
        localId: order.localId,
        price: order.price,
        isBuy: order.isBuy,
      };
      const dealAccepted = await this.swaps.acceptDeal(orderToAccept, requestPacket, peer);
      if (!dealAccepted) {
        this.removeOrderHold(order.id, pairId, quantity);
      }
    } else {
      await peer.sendPacket(new SwapFailedPacket({
        rHash,
        failureReason: SwapFailureReason.OrderOnHold,
      }, requestPacket.header.id));
    }
  }
}

export default OrderBook;
