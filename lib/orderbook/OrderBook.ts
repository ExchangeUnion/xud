import assert from 'assert';
import { EventEmitter } from 'events';
import uuidv1 from 'uuid/v1';
import { SwapClientType, SwapFailureReason, SwapPhase, SwapRole } from '../constants/enums';
import { Models } from '../db/DB';
import { CurrencyCreationAttributes, CurrencyInstance, OrderCreationAttributes, PairInstance } from '../db/types';
import Logger from '../Logger';
import { SwapFailedPacket, SwapRequestPacket } from '../p2p/packets';
import Peer from '../p2p/Peer';
import Pool from '../p2p/Pool';
import Swaps from '../swaps/Swaps';
import { SwapDeal, SwapFailure, SwapSuccess } from '../swaps/types';
import { pubKeyToAlias } from '../utils/aliasUtils';
import { UnitConverter } from '../utils/UnitConverter';
import { derivePairId, ms, setTimeoutPromise } from '../utils/utils';
import errors, { errorCodes } from './errors';
import OrderBookRepository from './OrderBookRepository';
import TradingPair from './TradingPair';
import {
  IncomingOrder,
  isOwnOrder,
  Order,
  OrderBookThresholds,
  OrderIdentifier,
  OrderInvalidation,
  OrderPortion,
  OutgoingOrder,
  OwnLimitOrder,
  OwnMarketOrder,
  OwnOrder,
  Pair,
  PeerOrder,
  PlaceOrderEvent,
  PlaceOrderEventType,
  PlaceOrderResult,
} from './types';

interface OrderBook {
  /** Adds a listener to be called when a remote order was added. */
  on(event: 'peerOrder.incoming', listener: (order: PeerOrder) => void): this;
  /** Adds a listener to be called when all or part of a remote order was invalidated and removed */
  on(event: 'peerOrder.invalidation', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a remote order was filled by an own order and removed */
  on(event: 'peerOrder.filled', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a local order was swapped after being filled and executed remotely */
  on(event: 'ownOrder.swapped', listener: (order: OrderPortion) => void): this;
  /** Adds a listener to be called when all or part of a local order was filled by an own order and removed */
  on(event: 'ownOrder.filled', listener: (order: OwnOrder) => void): this;
  /** Adds a listener to be called when a local order was added */
  on(event: 'ownOrder.added', listener: (order: OwnOrder) => void): this;
  /** Adds a listener to be called when a local order was removed either manually or due to a swap initiated by a peer */
  on(event: 'ownOrder.removed', listener: (order: OwnOrder) => void): this;

  /** Notifies listeners that a remote order was added */
  emit(event: 'peerOrder.incoming', order: PeerOrder): boolean;
  /** Notifies listeners that all or part of a remote order was invalidated and removed */
  emit(event: 'peerOrder.invalidation', order: OrderPortion): boolean;
  /** Notifies listeners that all or part of a remote order was filled by an own order and removed */
  emit(event: 'peerOrder.filled', order: OrderPortion): boolean;
  /** Notifies listeners that all or part of a local order was swapped after being filled and executed remotely */
  emit(event: 'ownOrder.swapped', order: OrderPortion): boolean;
  /** Notifies listeners that all or part of a local order was filled by an own order and removed */
  emit(event: 'ownOrder.filled', order: OwnOrder): boolean;
  /** Notifies listeners that a local order was added */
  emit(event: 'ownOrder.added', order: OwnOrder): boolean;
  /** Notifies listeners that a local order was removed either manually or due to a swap initiated by a peer */
  emit(event: 'ownOrder.removed', order: OwnOrder): boolean;
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
  private strict: boolean;
  private pool: Pool;
  private swaps: Swaps;
  private unitConverter: UnitConverter;

  /** Max time for placeOrder iterations (due to swaps failures retries). */
  private static readonly MAX_PLACEORDER_ITERATIONS_TIME = 60000; // 1 min
  /** Max time for sanity swaps to succeed. */
  private static readonly MAX_SANITY_SWAP_TIME = 15000;

  /** Gets an array of supported pair ids. */
  public get pairIds() {
    return Array.from(this.pairInstances.keys());
  }

  public get currencies() {
    return this.currencyInstances;
  }

  constructor({
    logger,
    models,
    thresholds,
    pool,
    swaps,
    unitConverter,
    nosanityswaps,
    nobalancechecks,
    nomatching = false,
    strict = true,
  }: {
    logger: Logger;
    models: Models;
    thresholds: OrderBookThresholds;
    pool: Pool;
    swaps: Swaps;
    unitConverter: UnitConverter;
    nosanityswaps: boolean;
    nobalancechecks: boolean;
    nomatching?: boolean;
    strict?: boolean;
  }) {
    super();

    this.logger = logger;
    this.pool = pool;
    this.swaps = swaps;
    this.unitConverter = unitConverter;
    this.nomatching = nomatching;
    this.nosanityswaps = nosanityswaps;
    this.nobalancechecks = nobalancechecks;
    this.thresholds = thresholds;
    this.strict = strict;

    this.repository = new OrderBookRepository(models);

    const onOrderRemoved = (order: OwnOrder) => {
      const {
        inboundCurrency,
        outboundCurrency,
        inboundAmount,
        outboundAmount,
      } = this.unitConverter.calculateInboundOutboundAmounts(order.quantity, order.price, order.isBuy, order.pairId);
      this.swaps.swapClientManager.subtractInboundReservedAmount(inboundCurrency, inboundAmount);
      this.swaps.swapClientManager.subtractOutboundReservedAmount(outboundCurrency, outboundAmount);
    };
    this.on('ownOrder.removed', onOrderRemoved);
    this.on('ownOrder.filled', onOrderRemoved);

    this.on('ownOrder.added', (order) => {
      const {
        inboundCurrency,
        outboundCurrency,
        inboundAmount,
        outboundAmount,
      } = this.unitConverter.calculateInboundOutboundAmounts(order.quantity, order.price, order.isBuy, order.pairId);
      this.swaps.swapClientManager.addInboundReservedAmount(inboundCurrency, inboundAmount);
      this.swaps.swapClientManager.addOutboundReservedAmount(outboundCurrency, outboundAmount);
    });

    this.bindPool();
    this.bindSwaps();
  }

  private static createOutgoingOrder = (order: OwnOrder, replaceOrderId?: string): OutgoingOrder => {
    const { createdAt, localId, initialQuantity, hold, ...outgoingOrder } = order;
    return replaceOrderId ? { ...outgoingOrder, replaceOrderId } : outgoingOrder;
  };

  private checkThresholdCompliance = (order: OwnOrder | IncomingOrder) => {
    const { minQuantity } = this.thresholds;
    return order.quantity >= minQuantity;
  };

  /**
   * Checks that a currency advertised by a peer is known to us, has a swap client identifier,
   * and that their token identifier matches ours.
   */
  private isPeerCurrencySupported = (peer: Peer, currency: string) => {
    const currencyInstance = this.currencyInstances.get(currency);
    if (!currencyInstance) {
      return false; // we don't know about this currency
    }

    if (!peer.getIdentifier(currencyInstance.swapClient, currency)) {
      return false; // peer did not provide a swap client identifier for this currency
    }

    // ensure that our token identifiers match
    const ourTokenIdentifier = this.pool.getTokenIdentifier(currency);
    const peerTokenIdentifier = peer.getTokenIdentifier(currency);
    return ourTokenIdentifier === peerTokenIdentifier;
  };

  private bindPool = () => {
    this.pool.on('packet.order', this.addPeerOrder);
    this.pool.on('packet.orderInvalidation', this.handleOrderInvalidation);
    this.pool.on('packet.getOrders', this.sendOrders);
    this.pool.on('packet.swapRequest', this.handleSwapRequest);
    this.pool.on('peer.close', this.removePeerOrders);
    this.pool.on('peer.pairDropped', this.removePeerPair);
    this.pool.on('peer.verifyPairs', this.verifyPeerPairs);
    this.pool.on('peer.nodeStateUpdate', this.checkPeerCurrencies);
  };

  private bindSwaps = () => {
    this.swaps.on('swap.recovered', async (recoveredSwap) => {
      // when a swap is recovered, we want to record it in the database
      // as a trade since funds did eventually get swapped
      await this.persistTrade({
        quantity: recoveredSwap.quantity!,
        makerOrderId: recoveredSwap.orderId,
        rHash: recoveredSwap.rHash,
      });
    });
    this.swaps.on('swap.paid', async (swapSuccess) => {
      if (swapSuccess.role === SwapRole.Maker) {
        const { orderId, pairId, quantity, peerPubKey } = swapSuccess;

        // we must remove the amount that was put on hold while the swap was pending for the remaining order
        this.removeOrderHold(orderId, pairId, quantity);

        const ownOrder = this.removeOwnOrder({
          orderId,
          pairId,
          takerPubKey: peerPubKey,
          quantityToRemove: quantity,
        });
        this.emit('ownOrder.swapped', { pairId, quantity, id: orderId });
        await this.persistTrade({
          quantity: swapSuccess.quantity,
          makerOrder: ownOrder,
          rHash: swapSuccess.rHash,
        });
      }
    });
    this.swaps.on('swap.failed', (deal) => {
      if (
        deal.role === SwapRole.Maker &&
        (deal.phase === SwapPhase.SwapAccepted || deal.phase === SwapPhase.SendingPayment)
      ) {
        // if our order is the maker and the swap failed after it was agreed to but before it was executed
        // we must release the hold on the order that we set when we agreed to the deal
        this.removeOrderHold(deal.orderId, deal.pairId, deal.quantity!);
      }
    });
  };

  /** Loads the supported pairs and currencies from the database. */
  public init = async () => {
    const [pairs, currencies] = await Promise.all([this.repository.getPairs(), this.repository.getCurrencies()]);

    currencies.forEach((currency) => this.currencyInstances.set(currency.id, currency));
    pairs.forEach((pair) => {
      this.pairInstances.set(pair.id, pair);
      this.addTradingPair(pair.id);
    });

    this.pool.updatePairs(this.pairIds);
  };

  /**
   * Gets all trades or a limited number of trades from the database.
   */
  public getTrades = async (limit?: number) => {
    const response = await this.repository.getTrades(limit);
    return response;
  };

  /**
   * Get lists of buy and sell orders of peers.
   */
  public getPeersOrders = (pairId: string) => {
    const tp = this.getTradingPair(pairId);
    return tp.getPeersOrders();
  };

  /**
   * Get lists of this node's own buy and sell orders.
   */
  public getOwnOrders = (pairId: string) => {
    const tp = this.getTradingPair(pairId);
    return tp.getOwnOrders();
  };

  /** Get the trading pair instance for a given pairId, or throw an error if none exists. */
  private getTradingPair = (pairId: string): TradingPair => {
    const tp = this.tradingPairs.get(pairId);
    if (!tp) {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
    }
    return tp;
  };

  /**
   * Gets an own order by order id and pair id.
   * @returns The order matching parameters, or undefined if no order could be found.
   */
  public getOwnOrder = (orderId: string, pairId: string): OwnOrder => {
    const tp = this.getTradingPair(pairId);
    return tp.getOwnOrder(orderId);
  };

  private tryGetOwnOrder = (orderId: string, pairId: string): OwnOrder | undefined => {
    try {
      return this.getOwnOrder(orderId, pairId);
    } catch (err) {
      return undefined;
    }
  };

  public getPeerOrder = (orderId: string, pairId: string, peerPubKey: string): PeerOrder => {
    const tp = this.getTradingPair(pairId);
    return tp.getPeerOrder(orderId, peerPubKey);
  };

  public addPair = async (pair: Pair) => {
    const pairId = derivePairId(pair);
    if (pair.baseCurrency.toLowerCase() === pair.quoteCurrency.toLowerCase()) {
      throw errors.DUPLICATE_PAIR_CURRENCIES(pair.baseCurrency, pair.quoteCurrency);
    }
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
    this.addTradingPair(pairInstance.id);

    this.pool.rawPeers().forEach(async (peer) => {
      this.checkPeerCurrencies(peer);
      await this.verifyPeerPairs(peer);
    });

    this.pool.updatePairs(this.pairIds);
    return pairInstance;
  };

  private addTradingPair = (pairId: string) => {
    const tp = new TradingPair(this.logger, pairId, this.nomatching);
    this.tradingPairs.set(pairId, tp);
    tp.on('ownOrder.fullyRemoved', (order) => {
      // we no longer need to track the local id for own orders that have been fully removed from the order book
      this.localIdMap.delete(order.localId);
    });
  };

  public addCurrency = async (currency: CurrencyCreationAttributes) => {
    if (this.currencyInstances.has(currency.id)) {
      throw errors.CURRENCY_ALREADY_EXISTS(currency.id);
    }
    if (currency.swapClient === SwapClientType.Connext && !currency.tokenAddress) {
      throw errors.CURRENCY_MISSING_ETHEREUM_CONTRACT_ADDRESS(currency.id);
    }
    const decimalPlaces = currency.decimalPlaces || 8;
    const currencyInstance = await this.repository.addCurrency({ ...currency, decimalPlaces });
    this.unitConverter.setDecimalPlacesPerCurrency(currency.id, decimalPlaces);
    this.currencyInstances.set(currencyInstance.id, currencyInstance);
    await this.swaps.swapClientManager.add(currencyInstance);
  };

  public removeCurrency = async (currencyId: string) => {
    const currency = this.currencyInstances.get(currencyId);
    if (currency) {
      for (const pair of this.pairInstances.values()) {
        if (currencyId === pair.baseCurrency || currencyId === pair.quoteCurrency) {
          throw errors.CURRENCY_CANNOT_BE_REMOVED(currencyId, pair.id);
        }
      }
      this.currencyInstances.delete(currencyId);
      await currency.destroy();
    } else {
      throw errors.CURRENCY_DOES_NOT_EXIST(currencyId);
    }
  };

  public removePair = (pairId: string) => {
    const pair = this.pairInstances.get(pairId);
    if (!pair) {
      throw errors.PAIR_DOES_NOT_EXIST(pairId);
    }

    this.pairInstances.delete(pairId);
    this.tradingPairs.delete(pairId);

    this.pool.rawPeers().forEach(async (peer) => {
      this.checkPeerCurrencies(peer);
      await this.verifyPeerPairs(peer);
    });

    this.pool.updatePairs(this.pairIds);
    return pair.destroy();
  };

  public placeLimitOrder = async ({
    order,
    immediateOrCancel = false,
    replaceOrderId,
    onUpdate,
  }: {
    order: OwnLimitOrder;
    immediateOrCancel?: boolean;
    replaceOrderId?: string;
    onUpdate?: (e: PlaceOrderEvent) => void;
  }): Promise<PlaceOrderResult> => {
    const stampedOrder = this.stampOwnOrder(order, replaceOrderId);

    if (order.quantity < TradingPair.QUANTITY_DUST_LIMIT) {
      const baseCurrency = order.pairId.split('/')[0];
      throw errors.MIN_QUANTITY_VIOLATED(TradingPair.QUANTITY_DUST_LIMIT, baseCurrency);
    }
    if (order.quantity * order.price < TradingPair.QUANTITY_DUST_LIMIT) {
      const quoteCurrency = order.pairId.split('/')[1];
      throw errors.MIN_QUANTITY_VIOLATED(TradingPair.QUANTITY_DUST_LIMIT, quoteCurrency);
    }

    if (this.nomatching) {
      this.addOwnOrder(stampedOrder);
      onUpdate &&
        onUpdate({
          type: PlaceOrderEventType.RemainingOrder,
          order: stampedOrder,
        });

      return {
        internalMatches: [],
        swapSuccesses: [],
        swapFailures: [],
        remainingOrder: stampedOrder,
      };
    }

    return this.placeOrder({
      onUpdate,
      replaceOrderId,
      order: stampedOrder,
      discardRemaining: immediateOrCancel,
      maxTime: Date.now() + OrderBook.MAX_PLACEORDER_ITERATIONS_TIME,
    });
  };

  public placeMarketOrder = async ({
    order,
    onUpdate,
  }: {
    order: OwnMarketOrder;
    onUpdate?: (e: PlaceOrderEvent) => void;
  }): Promise<PlaceOrderResult> => {
    if (this.nomatching) {
      throw errors.MARKET_ORDERS_NOT_ALLOWED();
    }

    if (order.quantity < TradingPair.QUANTITY_DUST_LIMIT) {
      const baseCurrency = order.pairId.split('/')[0];
      throw errors.MIN_QUANTITY_VIOLATED(TradingPair.QUANTITY_DUST_LIMIT, baseCurrency);
    }

    const stampedOrder = this.stampOwnOrder({
      ...order,
      price: order.isBuy ? Number.POSITIVE_INFINITY : 0,
    });
    const addResult = await this.placeOrder({
      onUpdate,
      order: stampedOrder,
      discardRemaining: true,
      maxTime: Date.now() + OrderBook.MAX_PLACEORDER_ITERATIONS_TIME,
    });
    delete addResult.remainingOrder;
    return addResult;
  };

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
  private placeOrder = async ({
    order,
    discardRemaining = false,
    retry = false,
    onUpdate,
    maxTime,
    replaceOrderId,
  }: {
    order: OwnOrder;
    discardRemaining?: boolean;
    retry?: boolean;
    onUpdate?: (e: PlaceOrderEvent) => void;
    maxTime?: number;
    replaceOrderId?: string;
  }): Promise<PlaceOrderResult> => {
    // Check if order complies to thresholds
    if (this.thresholds.minQuantity > 0) {
      if (!this.checkThresholdCompliance(order)) {
        throw errors.MIN_QUANTITY_VIOLATED(this.thresholds.minQuantity, '');
      }
    }

    // this method can be called recursively on swap failures retries.
    // if max time exceeded, don't try to match
    if (maxTime && Date.now() > maxTime) {
      assert(retry, 'we may only timeout placeOrder on retries');
      this.logger.debug(`placeOrder max time exceeded. order (${JSON.stringify(order)}) won't be fully matched`);

      // returning the remaining order to be rolled back and handled by the initial call
      return {
        internalMatches: [],
        swapSuccesses: [],
        swapFailures: [],
        remainingOrder: discardRemaining ? undefined : order,
      };
    }

    const tp = this.getTradingPair(order.pairId);

    let replacedOrderIdentifier: OrderIdentifier | undefined;
    if (replaceOrderId) {
      assert(!discardRemaining, 'can not replace order and discard remaining order');

      // put the order we are replacing on hold while we place the new order
      replacedOrderIdentifier = this.localIdMap.get(replaceOrderId);
      if (!replacedOrderIdentifier) {
        throw errors.ORDER_NOT_FOUND(replaceOrderId);
      }
      assert(replacedOrderIdentifier.pairId === order.pairId);
    }

    if (!this.nobalancechecks) {
      // for limit orders, we use the price of our order to calculate inbound/outbound amounts
      // for market orders, we use the price of the best matching order in the order book
      const price =
        order.price === 0 || order.price === Number.POSITIVE_INFINITY
          ? order.isBuy
            ? tp.quoteAsk()
            : tp.quoteBid()
          : order.price;

      const quantityBeingReplaced = replacedOrderIdentifier
        ? this.getOwnOrder(replacedOrderIdentifier.id, replacedOrderIdentifier.pairId).quantity
        : 0;

      /** The quantity that's being added to the replaced order. */
      const quantityDelta = order.quantity - quantityBeingReplaced;

      if (quantityDelta > 0) {
        await this.swaps.swapClientManager.checkSwapCapacities({
          ...order,
          price,
          quantity: quantityDelta,
        });
      }
    }

    if (replacedOrderIdentifier) {
      this.addOrderHold(replacedOrderIdentifier.id, replacedOrderIdentifier.pairId);
    }

    // perform matching routine. maker orders that are matched will be removed from the order book.
    const matchingResult = tp.match(order);

    /** Any portion of the placed order that could not be swapped or matched internally. */
    let { remainingOrder } = matchingResult;
    /** Local orders that matched with the placed order. */
    const internalMatches: OwnOrder[] = [];
    /** Successful swaps performed for the placed order. */
    const swapSuccesses: SwapSuccess[] = [];
    /** Failed swaps attempted for the placed order. */
    const swapFailures: SwapFailure[] = [];
    /** Maker orders that we attempted to swap with but failed. */
    const failedMakerOrders: PeerOrder[] = [];
    /** Maker orders that were invalidated while we were attempting swaps. */
    const invalidatedMakerOrderIds = new Set<string>();

    // we add a handler here to track orders that were invalidated while we were trying to swap
    // them so that we don't accidentally add them back to the order book after they fail a swap
    const handlePeerOrderInvalidation = (invalidatedOrder: OrderInvalidation) => {
      if (invalidatedOrder.pairId === order.pairId) {
        invalidatedMakerOrderIds.add(invalidatedOrder.id);
      }
    };
    this.pool.on('packet.orderInvalidation', handlePeerOrderInvalidation);

    /**
     * The routine for retrying a portion of the order that failed a swap attempt.
     * @param failedSwapQuantity the quantity of the failed portion to retry
     */
    const retryFailedSwap = async (failedSwapQuantity: number) => {
      this.logger.debug(`repeating matching routine for ${order.id} for failed quantity of ${failedSwapQuantity}`);
      const orderToRetry: OwnOrder = { ...order, quantity: failedSwapQuantity };

      // invoke placeOrder recursively, append matches/swaps and any remaining order
      const retryResult = await this.placeOrder({
        discardRemaining,
        onUpdate,
        maxTime,
        order: orderToRetry,
        retry: true,
      });
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
      onUpdate && onUpdate({ type: PlaceOrderEventType.Match, order: maker });
      if (isOwnOrder(maker)) {
        // this is an internal match which is effectively executed immediately upon being found
        this.logger.info(`internal match executed on taker ${taker.id} and maker ${maker.id} for ${maker.quantity}`);
        internalMatches.push(maker);
        this.pool.broadcastOrderInvalidation(maker);
        this.emit('ownOrder.filled', maker);
        await this.persistTrade({
          quantity: maker.quantity,
          makerOrder: maker,
          takerOrder: taker,
        });
      } else {
        // this is a match with a peer order which cannot be considered executed until after a
        // successful swap, which is an asynchronous process that can fail for numerous reasons
        const portion: OrderPortion = {
          id: maker.id,
          pairId: maker.pairId,
          quantity: maker.quantity,
        };
        const alias = pubKeyToAlias(maker.peerPubKey);
        this.logger.debug(
          `matched with peer ${maker.peerPubKey} (${alias}), executing swap on taker ${taker.id} and maker ${maker.id} for ${maker.quantity}`,
        );
        try {
          const swapResult = await this.executeSwap(maker, taker);
          if (swapResult.quantity < maker.quantity) {
            // swap was only partially completed
            portion.quantity = swapResult.quantity;
            const rejectedQuantity = maker.quantity - swapResult.quantity;
            this.logger.info(
              `match partially executed on taker ${taker.id} and maker ${maker.id} for ${swapResult.quantity} ` +
                `with peer ${maker.peerPubKey} (${alias}), ${rejectedQuantity} quantity not accepted and will repeat matching routine`,
            );
            await retryFailedSwap(rejectedQuantity);
          } else {
            this.logger.info(
              `match executed on taker ${taker.id} and maker ${maker.id} for ${maker.quantity} with peer ${maker.peerPubKey} (${alias})`,
            );
          }
          swapSuccesses.push(swapResult);
          onUpdate &&
            onUpdate({
              type: PlaceOrderEventType.SwapSuccess,
              swapSuccess: swapResult,
            });
        } catch (err) {
          const failMsg = `swap for ${portion.quantity} failed during order matching`;
          if (typeof err === 'number' && SwapFailureReason[err] !== undefined) {
            // treat the error as a SwapFailureReason
            this.logger.warn(
              `${failMsg} due to ${SwapFailureReason[err]}, will repeat matching routine for failed quantity`,
            );

            const swapFailure: SwapFailure = {
              failureReason: err,
              orderId: maker.id,
              pairId: maker.pairId,
              quantity: portion.quantity,
              peerPubKey: maker.peerPubKey,
            };
            swapFailures.push(swapFailure);

            try {
              // we remove orders from the order book when they fail a swap so that we don't immediately retry them
              const removedOrder = this.removePeerOrder(maker.id, maker.pairId, maker.peerPubKey);

              // we want to try matching with this order again at a later time so we add
              // the failed quantity back to the order and preserve the order to add it
              // back to the order book after matching is complete for this taker order.
              removedOrder.quantity += portion.quantity;
              failedMakerOrders.push(removedOrder);
            } catch (removeOrderErr) {
              if (removeOrderErr.code === errorCodes.ORDER_NOT_FOUND) {
                // if the order has already been removed, either it was removed fully during
                // matching or it's been invalidated by a peer or filled by a separate order
                // in this case we want to add back the order removed during matching
                // but only if it was not invalidated by the peer in the same time period
                if (!invalidatedMakerOrderIds.has(maker.id)) {
                  failedMakerOrders.push(maker);
                }
              } else {
                // for other errors we throw
                throw removeOrderErr;
              }
            }
            onUpdate && onUpdate({ swapFailure, type: PlaceOrderEventType.SwapFailure });
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

    if (replacedOrderIdentifier) {
      this.removeOrderHold(replacedOrderIdentifier.id, replacedOrderIdentifier.pairId);
    }
    if (remainingOrder) {
      if (discardRemaining) {
        this.logger.verbose(`no more matches found for order ${order.id}, remaining order will be discarded`);
        remainingOrder = undefined;
      } else if (!retry) {
        // on recursive retries of placeOrder, we don't add remaining orders to the orderbook
        // instead we preserve the remainder and return it to the parent caller, which will sum
        // up any remaining orders and add them to the order book as a single order once
        // matching is complete
        if (
          remainingOrder.quantity < TradingPair.QUANTITY_DUST_LIMIT ||
          remainingOrder.quantity * remainingOrder.price < TradingPair.QUANTITY_DUST_LIMIT
        ) {
          remainingOrder = undefined;
          this.logger.verbose(`remainder for order ${order.id} does not meet dust limit and will be discarded`);
        } else {
          this.addOwnOrder(remainingOrder, replacedOrderIdentifier?.id);
          onUpdate &&
            onUpdate({
              type: PlaceOrderEventType.RemainingOrder,
              order: remainingOrder,
            });
        }
      }
    } else if (replacedOrderIdentifier) {
      // we tried to replace an order but the replacement order was fully matched, so simply remove the original order
      this.removeOwnOrder({
        orderId: replacedOrderIdentifier.id,
        pairId: replacedOrderIdentifier.pairId,
      });
    }

    failedMakerOrders.forEach((peerOrder) => {
      const peer = this.pool.tryGetPeer(peerOrder.peerPubKey);
      if (peer?.active && peer.isPairActive(peerOrder.pairId)) {
        // if this peer and its trading pair is still active then we add the order back to the book
        this.tradingPairs.get(peerOrder.pairId)?.addPeerOrder(peerOrder);
      }
    });
    this.pool.removeListener('packet.orderInvalidation', handlePeerOrderInvalidation);

    return {
      internalMatches,
      swapSuccesses,
      swapFailures,
      remainingOrder,
    };
  };

  /**
   * Executes a swap between maker and taker orders. Emits the `peerOrder.filled` event if the swap succeeds.
   * @returns A promise that resolves to a [[SwapSuccess]] once the swap is completed, throws a [[SwapFailureReason]] if it fails
   */
  public executeSwap = async (maker: PeerOrder, taker: OwnOrder): Promise<SwapSuccess> => {
    // make sure the order is in the database before we begin the swap
    if (!(await this.repository.getOrder(maker.id))) {
      await this.repository.addOrderIfNotExists({
        ...maker,
        nodeId: this.pool.getNodeId(maker.peerPubKey),
      });
    }
    try {
      const swapResult = await this.swaps.executeSwap(maker, taker);
      this.emit('peerOrder.filled', maker);
      await this.persistTrade({
        quantity: swapResult.quantity,
        makerOrder: maker,
        takerOrder: taker,
        rHash: swapResult.rHash,
      });
      return swapResult;
    } catch (err) {
      const failureReason: number = err;
      this.logger.error(
        `swap between orders ${maker.id} & ${taker.id} failed due to ${SwapFailureReason[failureReason]}`,
      );
      throw failureReason;
    }
  };

  /**
   * Adds an own order to the order book and broadcasts it to peers.
   * Optionally removes/replaces an existing order.
   * @returns false if it's a duplicated order or with an invalid pair id, otherwise true
   */
  private addOwnOrder = (order: OwnOrder, replaceOrderId?: string): boolean => {
    const tp = this.getTradingPair(order.pairId);

    if (replaceOrderId) {
      this.removeOwnOrder({
        orderId: replaceOrderId,
        pairId: order.pairId,
        noBroadcast: true,
      });
    }

    const result = tp.addOwnOrder(order);
    assert(result, 'own order id is duplicated');

    this.localIdMap.set(order.localId, { id: order.id, pairId: order.pairId });

    this.emit('ownOrder.added', order);

    const outgoingOrder = OrderBook.createOutgoingOrder(order, replaceOrderId);
    this.pool.broadcastOrder(outgoingOrder);
    return true;
  };

  private persistTrade = async ({
    quantity,
    makerOrder,
    takerOrder,
    makerOrderId,
    rHash,
  }: {
    quantity: number;
    makerOrder?: OrderCreationAttributes;
    takerOrder?: OrderCreationAttributes;
    makerOrderId?: string;
    rHash?: string;
  }) => {
    assert(makerOrder || makerOrderId, 'either makerOrder or makerOrderId must be specified to persist a trade');
    const addOrderPromises: Promise<any>[] = [];
    if (makerOrder) {
      addOrderPromises.push(this.repository.addOrderIfNotExists(makerOrder));
    }
    if (takerOrder) {
      addOrderPromises.push(this.repository.addOrderIfNotExists(takerOrder));
    }

    await Promise.all(addOrderPromises);
    await this.repository.addTrade({
      quantity,
      rHash,
      makerOrderId: makerOrder ? makerOrder.id : makerOrderId!,
      takerOrderId: takerOrder ? takerOrder.id : undefined,
    });
  };

  /**
   * Adds an incoming peer order to the local order book. It timestamps the order based on when it
   * enters the order book and also records its initial quantity upon being received.
   * @returns `false` if it's a duplicated order or with an invalid pair id, otherwise true
   */
  private addPeerOrder = (order: IncomingOrder): boolean => {
    if (this.thresholds.minQuantity > 0) {
      if (!this.checkThresholdCompliance(order)) {
        this.logger.debug('incoming peer order does not comply with configured threshold');
        return false;
      }
    }

    // TODO: penalize peers for sending ordes too small to swap?
    if (
      order.quantity * order.price < TradingPair.QUANTITY_DUST_LIMIT ||
      order.quantity < TradingPair.QUANTITY_DUST_LIMIT
    ) {
      this.logger.warn('incoming peer order is too small to swap');
      return false;
    }

    const tp = this.tradingPairs.get(order.pairId);
    if (!tp) {
      // TODO: penalize peer for sending an order for an unsupported pair
      return false;
    }

    const stampedOrder: PeerOrder = {
      ...order,
      createdAt: ms(),
      initialQuantity: order.quantity,
    };

    if (!tp.addPeerOrder(stampedOrder)) {
      this.logger.debug(`incoming peer order is duplicated: ${order.id}`);
      // TODO: penalize peer
      return false;
    }

    this.emit('peerOrder.incoming', stampedOrder);

    return true;
  };

  public getOwnOrderByLocalId = (localId: string) => {
    const orderIdentifier = this.localIdMap.get(localId);
    if (!orderIdentifier) {
      throw errors.LOCAL_ID_DOES_NOT_EXIST(localId);
    }

    const order = this.getOwnOrder(orderIdentifier.id, orderIdentifier.pairId);
    return order;
  };

  public removeOwnOrders = () => {
    const removedOrderLocalIds = [];
    const onHoldOrderLocalIds = [];

    for (const localId of this.localIdMap.keys()) {
      try {
        const { onHoldQuantity } = this.removeOwnOrderByLocalId(localId, true);
        if (onHoldQuantity === 0) {
          removedOrderLocalIds.push(localId);
        } else {
          onHoldOrderLocalIds.push(localId);
        }
      } catch (_) {}
    }

    return { removedOrderLocalIds, onHoldOrderLocalIds };
  };

  /**
   * Removes all or part of an order from the order book by its local id. Throws an error if the
   * specified pairId is not supported or if the order to cancel could not be found.
   * @param allowAsyncRemoval whether to allow an eventual async removal of the order in case
   * some quantity of the order is on hold and cannot be immediately removed. If false, while some quantity of
   * the order is on hold, an error will be thrown.
   * @param quantityToRemove the quantity to remove from the order, if undefined then the entire
   * order is removed.
   * @returns an object summarizing the result of the order removal, including any quantity that
   * was on hold and could not be immediately removed, the total quantity removed, and the quantity
   * remaining on the order.
   */
  public removeOwnOrderByLocalId = (localId: string, allowAsyncRemoval?: boolean, quantityToRemove?: number) => {
    const order = this.getOwnOrderByLocalId(localId);

    let remainingQuantityToRemove = quantityToRemove || order.quantity;
    let onHoldQuantity = order.hold;
    let removedQuantity = 0;

    if (remainingQuantityToRemove > order.quantity) {
      // quantity to be removed can't be higher than order's quantity.
      throw errors.QUANTITY_DOES_NOT_MATCH(remainingQuantityToRemove, order.quantity);
    }

    const removableQuantity = order.quantity - order.hold;
    if (remainingQuantityToRemove <= removableQuantity) {
      this.removeOwnOrder({
        orderId: order.id,
        pairId: order.pairId,
        quantityToRemove: remainingQuantityToRemove,
      });
      removedQuantity += remainingQuantityToRemove;
      remainingQuantityToRemove = 0;
    } else {
      // we can't immediately remove the entire quantity because of a hold on the order.
      if (!allowAsyncRemoval) {
        throw errors.QUANTITY_ON_HOLD(localId, order.hold);
      }

      if (removableQuantity > 0) {
        // we can remove any portion of the order that's not on hold up front
        this.removeOwnOrder({
          orderId: order.id,
          pairId: order.pairId,
          quantityToRemove: removableQuantity,
        });
        removedQuantity += removableQuantity;
        remainingQuantityToRemove -= removableQuantity;
      }

      const failedHandler = (deal: SwapDeal) => {
        if (deal.orderId === order.id) {
          // remove the portion that failed now that it's not on hold
          const failedQuantityToRemove = Math.min(deal.quantity!, remainingQuantityToRemove);
          this.removeOwnOrder({
            quantityToRemove: failedQuantityToRemove,
            orderId: order.id,
            pairId: order.pairId,
          });
          cleanup(failedQuantityToRemove);
        }
      };

      const paidHandler = (result: SwapSuccess) => {
        if (result.orderId === order.id) {
          const paidQuantityToRemove = Math.min(result.quantity, remainingQuantityToRemove);
          cleanup(paidQuantityToRemove);
        }
      };

      const cleanup = (quantity: number) => {
        remainingQuantityToRemove -= quantity;
        removedQuantity += quantity;
        onHoldQuantity -= quantity;
        this.logger.debug(
          `removed hold of ${quantity} on local order ${localId}, ${remainingQuantityToRemove} remaining`,
        );
        if (remainingQuantityToRemove === 0) {
          // we can stop listening for swaps once all holds are cleared
          this.swaps.removeListener('swap.failed', failedHandler);
          this.swaps.removeListener('swap.paid', paidHandler);
        }
      };

      this.swaps.on('swap.failed', failedHandler);
      this.swaps.on('swap.paid', paidHandler);
    }

    return {
      removedQuantity,
      onHoldQuantity,
      pairId: order.pairId,
      remainingQuantity: order.quantity - remainingQuantityToRemove,
    };
  };

  private addOrderHold = (orderId: string, pairId: string, holdAmount?: number) => {
    const tp = this.getTradingPair(pairId);
    tp.addOrderHold(orderId, holdAmount);
  };

  private removeOrderHold = (orderId: string, pairId: string, holdAmount?: number) => {
    const tp = this.getTradingPair(pairId);
    tp.removeOrderHold(orderId, holdAmount);
  };

  /**
   * Removes all or part of an own order from the order book and broadcasts an order invalidation packet.
   * @param quantityToRemove the quantity to remove from the order, if undefined then the full order is removed
   * @param takerPubKey the node pub key of the taker who filled this order, if applicable
   * @returns the removed portion of the order
   */
  private removeOwnOrder = ({
    orderId,
    pairId,
    quantityToRemove,
    takerPubKey,
    noBroadcast,
  }: {
    orderId: string;
    pairId: string;
    quantityToRemove?: number;
    takerPubKey?: string;
    noBroadcast?: boolean;
  }) => {
    const tp = this.getTradingPair(pairId);
    try {
      const removedOrder = tp.removeOwnOrder(orderId, quantityToRemove);
      this.emit('ownOrder.removed', removedOrder);

      if (!noBroadcast) {
        this.pool.broadcastOrderInvalidation(removedOrder, takerPubKey);
      }
      return removedOrder;
    } catch (err) {
      if (quantityToRemove !== undefined) {
        this.logger.error(`error while removing ${quantityToRemove} of order (${orderId})`, err);
      } else {
        this.logger.error(`error while removing order (${orderId})`, err);
      }
      throw err;
    }
  };

  /**
   * Removes all or part of a peer order from the order book and emits the `peerOrder.invalidation` event.
   * @param quantityToRemove the quantity to remove from the order, if undefined then the full order is removed
   */
  public removePeerOrder = (
    orderId: string,
    pairId: string,
    peerPubKey?: string,
    quantityToRemove?: number,
  ): PeerOrder => {
    const tp = this.getTradingPair(pairId);
    return tp.removePeerOrder(orderId, peerPubKey, quantityToRemove);
  };

  private removePeerOrders = (peerPubKey?: string) => {
    if (!peerPubKey) {
      return;
    }

    for (const pairId of this.pairInstances.keys()) {
      this.removePeerPair(peerPubKey, pairId);
    }
    this.logger.debug(`removed all orders for peer ${peerPubKey} (${pubKeyToAlias(peerPubKey)})`);
  };

  private removePeerPair = (peerPubKey: string, pairId: string) => {
    const tp = this.tradingPairs.get(pairId);
    if (!tp) {
      return;
    }

    const orders = tp.removePeerOrders(peerPubKey);
    orders.forEach((order) => {
      this.emit('peerOrder.invalidation', order);
    });
  };

  private checkPeerCurrencies = (peer: Peer) => {
    const advertisedCurrencies = peer.getAdvertisedCurrencies();

    advertisedCurrencies.forEach((advertisedCurrency) => {
      if (!this.isPeerCurrencySupported(peer, advertisedCurrency)) {
        peer.disableCurrency(advertisedCurrency);
      } else {
        peer.enableCurrency(advertisedCurrency);
      }
    });
  };

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
      if (!this.tradingPairs.has(pairId)) {
        // if we don't support the trading pair locally, then we don't want to verify or activate it
        return false;
      }

      const [baseCurrency, quoteCurrency] = pairId.split('/');
      const peerCurrenciesEnabled =
        !peer.disabledCurrencies.has(baseCurrency) && !peer.disabledCurrencies.has(quoteCurrency);
      const ownCurrenciesConnected =
        this.swaps.swapClientManager.isConnected(baseCurrency) &&
        this.swaps.swapClientManager.isConnected(quoteCurrency);
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
          const sanitySwapPromise = Promise.race([
            this.swaps.executeSanitySwap(currency, peer),
            sanitySwapTimeout,
          ]).then((success) => {
            // success resolves to true if the sanity swap succeeds before the timeout
            if (!success) {
              currenciesToVerify.set(currency, false);
            }
          });

          sanitySwapPromises.push(sanitySwapPromise);
        }
      });

      // wait for all sanity swaps to finish or timeout
      await Promise.all(sanitySwapPromises);
    }

    // activate verified currencies
    currenciesToVerify.forEach((swappable, currency) => {
      // in strict mode, we only activate "swappable" currencies where a route to peer is possible or a sanity swap has completed
      // in non-strict mode, we activate any currency which we also support locally
      if (swappable || (!this.strict && this.swaps.swapClientManager.has(currency))) {
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
  };

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
        orders.buyArray.forEach((order) => outgoingOrders.push(OrderBook.createOutgoingOrder(order)));
        orders.sellArray.forEach((order) => outgoingOrders.push(OrderBook.createOutgoingOrder(order)));
      }
    });
    await peer.sendOrders(outgoingOrders, reqId);
  };

  public stampOwnOrder = (order: OwnLimitOrder, replaceOrderId?: string): OwnOrder => {
    const id = uuidv1();
    // verify localId isn't duplicated. use global id if blank
    if (order.localId === '') {
      order.localId = id;
    } else if (this.localIdMap.has(order.localId) && order.localId !== replaceOrderId) {
      throw errors.DUPLICATE_ORDER(order.localId);
    }

    return {
      ...order,
      id,
      initialQuantity: order.quantity,
      hold: 0,
      createdAt: ms(),
    };
  };

  private handleOrderInvalidation = (oi: OrderInvalidation, peerPubKey: string) => {
    try {
      const removeResult = this.removePeerOrder(oi.id, oi.pairId, peerPubKey, oi.quantity);
      this.emit('peerOrder.invalidation', removeResult);
    } catch (err) {
      this.logger.error(`failed to remove order (${oi.id}) of peer ${peerPubKey} (${pubKeyToAlias(peerPubKey)})`, err);
      // TODO: Penalize peer
    }
  };

  /**
   * Handles a request from a peer to create a swap deal. Checks if the order for the requested swap
   * is available and if a route exists to determine if the request should be accepted or rejected.
   * Responds to the peer with a swap response packet containing either an accepted quantity or rejection reason.
   */
  private handleSwapRequest = async (requestPacket: SwapRequestPacket, peer: Peer) => {
    assert(requestPacket.body, 'SwapRequestPacket does not contain a body');
    assert(this.swaps, 'swaps module is disabled');
    const { rHash, proposedQuantity, orderId, pairId } = requestPacket.body;

    if (!Swaps.validateSwapRequest(requestPacket.body)) {
      // TODO: penalize peer for invalid swap request
      await peer.sendPacket(
        new SwapFailedPacket(
          {
            rHash,
            failureReason: SwapFailureReason.InvalidSwapRequest,
          },
          requestPacket.header.id,
        ),
      );
      return;
    }

    const order = this.tryGetOwnOrder(orderId, pairId);
    if (!order) {
      await peer.sendPacket(
        new SwapFailedPacket(
          {
            rHash,
            failureReason: SwapFailureReason.OrderNotFound,
          },
          requestPacket.header.id,
        ),
      );
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
      await peer.sendPacket(
        new SwapFailedPacket(
          {
            rHash,
            failureReason: SwapFailureReason.OrderOnHold,
          },
          requestPacket.header.id,
        ),
      );
    }
  };
}

export default OrderBook;
