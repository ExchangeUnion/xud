import { SwapClients, SwapRole, SwapState, SwapPhase } from './enums';
import * as lndrpc from '../proto/lndrpc_pb';

type MarketOrder = {
  /** The number of base currency tokens for the order. */
  quantity: number;
  /** A trading pair symbol with the base currency first followed by a '/' separator and the quote currency */
  pairId: string;
  /** Whether the order is a buy (if `true`) or a sell (if `false`). */
  isBuy: boolean;
};

/** A limit order with a specified price. */
type Order = MarketOrder & {
  /** The price for the order expressed in units of the quote currency. */
  price: number;
};

type Local = {
  /** A local identifier for the order. */
  localId: string;
  /** The amount of an order that is on hold pending swap exectuion. */
  hold?: number;
};

type Remote = {
  /** The nodePubKey of the node which created this order. */
  peerPubKey: string;
};

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

/** An outgoing version of a local order without the localId and createdAt timestamp */
export type OutgoingOrder = Pick<StampedOwnOrder, Exclude<keyof StampedOwnOrder, 'localId' | 'createdAt'>>;

export type OrderIdentifier = {
  orderId: string;
  pairId: string;
};

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

export type SwapDeal = {
  /** The role of the local node in the swap. */
  role: SwapRole;
  /** The most updated deal phase */
  phase: SwapPhase;
  /**
   * The most updated deal state. State works together with phase to indicate where the
   * deal is in its life cycle and if the deal is active, errored, or completed.
   */
  state: SwapState;
  /** The reason for being in the current state. */
  errorReason: string;
  /** The xud node pub key of the counterparty to this swap deal. */
  peerPubKey: string;
  /** The global order id in the XU network for the order being executed. */
  orderId: string;
  /** The local id for the order being executed. */
  localOrderId: string;
  /** The quantity of the order to execute as proposed by the taker. */
  proposedQuantity: number;
  /** The accepted quantity of the order to execute as accepted by the maker. */
  quantity?: number;
  /** The trading pair of the order. The pairId together with the orderId are needed to find the deal in orderBook. */
  pairId: string;
  /** The number of satoshis (or equivalent) the taker is expecting to receive. */
  takerAmount: number;
  /** The currency the taker is expecting to receive. */
  takerCurrency: string;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey?: string;
  /** The CLTV delta from the current height that should be used to set the timelock for the final hop when sending to taker. */
  takerCltvDelta: number;
  /** The number of satoshis (or equivalent) the maker is expecting to receive. */
  makerAmount: number;
  /** The currency the maker is expecting to receive. */
  makerCurrency: string;
  /** The CLTV delta from the current height that should be used to set the timelock for the final hop when sending to maker. */
  makerCltvDelta?: number;
  /** The price of the order that's being executed. */
  price: number;
  /** The hash of the preimage. */
  r_hash: string;
  r_preimage?: string;
  /** The routes the maker should use to send to the taker. */
  makerToTakerRoutes?: lndrpc.Route[];
  createTime: number;
  executeTime?: number;
  completeTime?: number;
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
