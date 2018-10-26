import { SwapClients, SwapRole } from './enums';

/** An order without a price that is intended to match against any available orders on the opposite side of the book for its trading pair. */
type MarketOrder = {
  /** The number of base currency tokens for the order. */
  quantity: number;
  /** A trading pair symbol with the base currency first followed by a '/' separator and the quote currency */
  pairId: string;
  /** Whether the order is a buy (if `true`) or a sell (if `false`). */
  isBuy: boolean;
};

/** A limit order with a specified price that will enter the order book if it is not immediately matched. */
type Order = MarketOrder & {
  /** The price for the order expressed in units of the quote currency. */
  price: number;
};

/** Properties that apply only to orders placed by the local xud. */
type Local = {
  /** A local identifier for the order. */
  localId: string;
  /** The amount of an order that is on hold pending swap exectuion. */
  hold?: number;
};

/** Properties that apply only to orders placed by remote peers. */
type Remote = {
  /** The nodePubKey of the node which created this order. */
  peerPubKey: string;
};

/** Properties that uniquely identify an order and make it ready for sending to peers. */
type Stamp = {
  /** The global identifier for this order on the XU network. */
  id: string;
  /** Epoch timestamp when this order was created. */
  createdAt: number;
};

export type OwnMarketOrder = MarketOrder & Local;

export type OwnOrder = Order & Local;

export type StampedOwnOrder = OwnOrder & Stamp;

export type StampedPeerOrder = Order & Remote & Stamp;

export type StampedOrder = StampedOwnOrder | StampedPeerOrder;

/** An outgoing version of a local own order without the localId and createdAt timestamp */
export type OutgoingOrder = Pick<StampedOwnOrder, Exclude<keyof StampedOwnOrder, 'localId' | 'createdAt'>>;

/** Properties that can be used to uniquely identify and fetch an order within an order book. */
export type OrderIdentifier = {
  /** The global identifier for this order on the XU network. */
  id: string;
  pairId: string;
};

/** A reference to a portion of an existing order. */
export type OrderPortion = OrderIdentifier & {
  quantity: number;
  localId?: string;
};

export type SwapResult = {
  orderId: string,
  localId: string,
  pairId: string,
  quantity: number,
  amountReceived: number;
  amountSent: number;
  r_hash: string;
  peerPubKey: string;
  role: SwapRole;
};

export type Currency = {
  /** The ticker symbol for this currency such as BTC, LTC, ETH, etc... */
  id: string;
  /** The payment channel network client to use for executing swaps. */
  swapClient: SwapClients;
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

export function isOwnOrder(order: StampedOrder): order is StampedOwnOrder {
  return (order as StampedPeerOrder).peerPubKey === undefined && typeof (order as StampedOwnOrder).localId === 'string';
}

export function isStampedOwnOrder(order: OwnOrder): order is StampedOwnOrder {
  return typeof (order as StampedOwnOrder).id === 'string' && typeof (order as StampedOwnOrder).createdAt === 'number';
}

export function isPeerOrder(order: StampedOrder): order is StampedPeerOrder {
  return (order as StampedOwnOrder).localId === undefined && typeof (order as StampedPeerOrder).peerPubKey === 'string';
}
