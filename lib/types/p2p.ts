export type HandshakeState = {
  version?: string;
  nodePubKey?: string;
  listenPort?: number;
  pairs?: string[];
  raidenAddress?: string;
};

export function isHandshakeState(obj: any): obj is HandshakeState {
  return obj && typeof obj.version === 'string' && typeof obj.nodePubKey === 'string' && typeof obj.listenPort === 'number'
    && Array.isArray(obj.pairs);
}
