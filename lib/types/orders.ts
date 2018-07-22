export type MarketOrder = {
  quantity: number;
  pairId: string;
};

export type OwnOrder = MarketOrder & {
  price: number;
};

export type PeerOrder = OwnOrder & {
  id: string;
  hostId: number;
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

export type OutgoingOrder = OwnOrder & {
  id: string;
  invoice: string;
};
