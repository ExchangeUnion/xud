type MarketOrder = {
  /** The number of base currency tokens for the order. */
  quantity: number;
  /** A trading pair symbol with the base currency first followed by a '/' separator and the quote currency */
  pairId: string;
};

/** A limit order with a specified price. */
type Order = MarketOrder & {
  /** The price for the order expressed in units of the quote currency. */
  price: number;
};

type Local = {
  /** A local identifier for the order. */
  localId: string;
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
  quantity?: number;
};

export function isOwnOrder(order: StampedOrder): order is StampedOwnOrder {
  return (order as StampedPeerOrder).peerPubKey === undefined && typeof (order as StampedOwnOrder).localId === 'string';
}

export function isPeerOrder(order: StampedOrder): order is StampedPeerOrder {
  return (order as StampedOwnOrder).localId === undefined && typeof (order as StampedPeerOrder).peerPubKey === 'string';
}
