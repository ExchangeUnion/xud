import { SwapClientType } from '../constants/enums';
import { SwapFailure, SwapSuccess } from '../swaps/types';

export type OrderBookThresholds = {
  minQuantity: number;
};

export type OrderMatch = {
  maker: Order;
  taker: OwnOrder;
};

export type MatchingResult = {
  matches: OrderMatch[];
  remainingOrder?: OwnOrder;
};

export type PlaceOrderResult = {
  internalMatches: OwnOrder[];
  swapSuccesses: SwapSuccess[];
  swapFailures: SwapFailure[];
  remainingOrder?: OwnOrder;
};

export type PlaceOrderEvent = {
  type: PlaceOrderEventType;
  order?: Order;
  swapSuccess?: SwapSuccess;
  swapFailure?: SwapFailure;
};

export enum PlaceOrderEventType {
  Match,
  SwapSuccess, // eslint-disable-line @typescript-eslint/no-shadow
  RemainingOrder,
  SwapFailure, // eslint-disable-line @typescript-eslint/no-shadow
}

/** An order without a price that is intended to match against any available orders on the opposite side of the book for its trading pair. */
type MarketOrder = {
  /** The quantity denominated in satoshis (or equivalent) for the order. */
  quantity: number;
  /** A trading pair symbol with the base currency first followed by a '/' separator and the quote currency */
  pairId: string;
  /** Whether the order is a buy (if `true`) or a sell (if `false`). */
  isBuy: boolean;
};

/** A limit order with a specified price that will enter the order book if it is not immediately matched. */
type LimitOrder = MarketOrder & {
  /** The price for the order expressed in units of the quote currency. */
  price: number;
};

/** Properties that can be used to uniquely identify and fetch an order within an order book. */
export type OrderIdentifier = Pick<MarketOrder, 'pairId'> & {
  /** The global identifier for this order on the XU network. */
  id: string;
};

/** Properties that apply only to orders placed by the local xud. */
type Local = {
  /** A local identifier for the order. */
  localId: string;
};

/** Properties that apply only to orders placed by remote peers. */
type Remote = {
  /** The nodePubKey of the node which created this order. */
  peerPubKey: string;
};

/** Properties that uniquely identify an order and make it ready to enter the order book. */
type Stamp = OrderIdentifier & {
  /** Epoch timestamp when this order was created locally. */
  createdAt: number;
  /** The number of satoshis (or equivalent) initially available for the order, before any actions such as trades reduced the available quantity. */
  initialQuantity: number;
};

export type SortableOrder = {
  price: number;
  createdAt: number;
};

export type OwnMarketOrder = MarketOrder & Local;

export type OwnLimitOrder = LimitOrder & Local;

/** A local order that may enter the order book. */
export type OwnOrder = OwnLimitOrder &
  Stamp & {
    /** The amount of an order that is on hold pending swap execution. */
    hold: number;
  };

/** A peer order that may enter the order book. */
export type PeerOrder = LimitOrder & Stamp & Remote;

export type Order = OwnOrder | PeerOrder;

/** An outgoing local order which only includes fields that are relevant to peers. */
export type OutgoingOrder = Pick<
  OwnOrder,
  Exclude<keyof OwnOrder, 'localId' | 'createdAt' | 'hold' | 'initialQuantity'>
> & {
  replaceOrderId?: string;
};

/** An incoming peer order which only includes fields that are relevant to us. */
export type IncomingOrder = OutgoingOrder & Remote;

/** A reference to a portion of an existing order. */
export type OrderPortion = OrderIdentifier & {
  quantity: number;
  localId?: string;
};

export type OrderInvalidation = OrderIdentifier & {
  /** The quantity of the order being removed, or the entire order if quantity is undefined */
  quantity?: number;
};

export type Currency = {
  /** The ticker symbol for this currency such as BTC, LTC, ETH, etc... */
  id: string;
  /** The payment channel network client to use for executing swaps. */
  swapClient: SwapClientType;
  /**
   * The number of places to the right of the decimal point of the smallest subunit of the currency, For example, BTC, LTC, and others
   * where the smallest subunits (satoshis) are 0.00000001 full units (bitcoins) have 8 decimal places. ETH has 18. This can be thought
   * of as the base 10 exponent of the smallest subunit expressed as a positive integer.
   */
  decimalPlaces: number;
  /** The contract address for layered tokens such as ERC20. */
  tokenAddress?: string;
};

export type Pair = {
  /* The base currency that is bought and sold for this trading pair. */
  baseCurrency: string;
  /* The currency used to quote a price for the base currency. */
  quoteCurrency: string;
};

export function isOwnOrder(order: Order): order is OwnOrder {
  return (order as PeerOrder).peerPubKey === undefined && typeof (order as OwnOrder).localId === 'string';
}

export function isPeerOrder(order: Order): order is PeerOrder {
  return (order as OwnOrder).localId === undefined && typeof (order as PeerOrder).peerPubKey === 'string';
}
