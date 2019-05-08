import { SwapClient } from '../constants/enums';
import { SwapSuccess, SwapFailure } from '../swaps/types';

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
  payload: OwnOrder | SwapSuccess | SwapFailure;
};

export enum PlaceOrderEventType {
  InternalMatch,
  SwapSuccess,
  RemainingOrder,
  SwapFailure,
}

/** An order without a price that is intended to match against any available orders on the opposite side of the book for its trading pair. */
type MarketOrder = {
  /** The number of currently satoshis (or equivalent) for the order. */
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
  /** The amount of an order that is on hold pending swap exectuion. */
  hold: number;
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

export type OwnMarketOrder = MarketOrder & Local;

export type OwnLimitOrder = LimitOrder & Local;

export type OwnOrder = OwnLimitOrder & Stamp;

export type PeerOrder = LimitOrder & Stamp & Remote;

export type Order = OwnOrder | PeerOrder;

/** An outgoing version of a local own order without fields that are not useful for peers. */
export type OutgoingOrder = Pick<OwnOrder, Exclude<keyof OwnOrder, 'localId' | 'createdAt' | 'hold' | 'initialQuantity'>>;

/** An outgoing version of a local own order without fields that are not useful for peers. */
export type IncomingOrder = OutgoingOrder & Remote;

/** A reference to a portion of an existing order. */
export type OrderPortion = OrderIdentifier & {
  quantity: number;
  localId?: string;
};

export type Currency = {
  /** The ticker symbol for this currency such as BTC, LTC, ETH, etc... */
  id: string;
  /** The payment channel network client to use for executing swaps. */
  swapClient: SwapClient;
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
