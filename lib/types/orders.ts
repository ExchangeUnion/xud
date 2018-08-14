export type MarketOrder = {
  quantity: number;
  pairId: string;
};

export type OwnMarketOrder = MarketOrder & {
  localId: string;
};

export type OwnOrder = OwnMarketOrder & {
  price: number;
};

export type PeerOrder = MarketOrder & {
  price: number;
  id: string;
  peerId: string;
  invoice: string;
};

export type StampedOwnOrder = OwnOrder & {
  id: string;
  createdAt: number;
};

export type StampedPeerOrder = PeerOrder & {
  createdAt: number;
};

export type StampedOrder = StampedOwnOrder | StampedPeerOrder;

export type OutgoingOrder = MarketOrder & {
  price: number;
  id: string;
  invoice: string;
};

export type OrderIdentifier = {
  orderId: string;
  pairId: string;
  quantity?: number;
};

export function isOwnOrder(order: StampedOrder): order is StampedOwnOrder {
  return (order as StampedPeerOrder).peerId === undefined && typeof (order as StampedOwnOrder).localId === 'string';
}

export function isPeerOrder(order: StampedOrder): order is StampedPeerOrder {
  return (order as StampedOwnOrder).localId === undefined && typeof (order as StampedPeerOrder).peerId === 'string';
}
