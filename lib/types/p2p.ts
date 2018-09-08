export type Address = {
  host: string;
  port: number;
  /** Epoch timestamp of last successful connection with this address */
  lastConnected?: number;
};

/** Information used for connecting to a remote node. */
export type NodeConnectionInfo = {
  nodePubKey: string;
  addresses: Address[];
};

export type HandshakeState = {
  version: string;
  nodePubKey: string;
  addresses?: Address[];
  pairs: string[];
  raidenAddress?: string;
  lndbtcPubKey?: string;
  lndltcPubKey?: string;
};

export function isHandshakeState(obj: any): obj is HandshakeState {
  return obj && typeof obj.version === 'string' && typeof obj.nodePubKey === 'string' && Array.isArray(obj.addresses)
    && Array.isArray(obj.pairs);
}
