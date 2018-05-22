type BaseOrder = {
  price: number;
  quantity: number;
  pairId: string;
};

export type OwnOrder = BaseOrder;

export type StampedOwnOrder = OwnOrder & {
  id: string;
  createdAt: Date;
};

export type PeerOrder = BaseOrder & {
  peerId: number;
  invoice: string;
};

export type StampedPeerOrder = PeerOrder & {
  createdAt: Date;
};

export type OutgoingOrder = BaseOrder & {
  id: string;
  invoice: string;
};

export type dbOrder = BaseOrder & {
  id: string;
  peerId: number;
  createdAt: Date;
};
