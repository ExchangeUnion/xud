type BaseOrder = {
  price: number;
  quantity: number;
  pairId: string;
};

export type OwnOrder = BaseOrder;

export type PeerOrder = BaseOrder & {
  id: string;
  hostId: number;
  invoice: string;
};

export type StampedOwnOrder = OwnOrder & {
  id: string;
  createdAt: Date;
};

export type StampedPeerOrder = PeerOrder & {
  createdAt: Date;
};

export type StampedOrder = StampedOwnOrder | StampedPeerOrder;

export type OutgoingOrder = BaseOrder & {
  id: string;
  invoice: string;
};
