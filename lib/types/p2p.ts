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
  lastAddress?: Address;
};

export type NodeState = {
  version: string;
  nodePubKey: string;
  addresses?: Address[];
  pairs: string[];
  raidenAddress?: string;
  lndbtcPubKey?: string;
  lndltcPubKey?: string;
};

export type NodeStateUpdate = {
  addresses?: Address[];
  pairs: string[];
  raidenAddress?: string;
  lndbtcPubKey?: string;
  lndltcPubKey?: string;
};