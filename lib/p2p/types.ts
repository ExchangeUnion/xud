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
  lndPubKeys: { [currency: string]: string | undefined };
};

export type NodeStateUpdate = {
  addresses?: Address[];
  pairs?: string[];
  raidenAddress?: string;
  lndPubKeys?: { [currency: string]: string | undefined };
};

export type PoolConfig = {
  /** Whether or not to automatically detect and share current external ip address on startup. */
  detectexternalip: boolean;

  /** If false, don't send GET_NODES when connecting, defaults to true. */
  discover: boolean;

  /** GET_NODES scheduler in minutes, discover option should be true. */
  discoverminutes: number;

  /** Whether or not to listen for incoming connections from peers. */
  listen: boolean;

  /** Which port to listen on. If 0, a random unused port will be used. */
  port: number;

  /**
   * An array of IP addresses or host names which can be used to connect to this server.
   * It will be advertised with peers for them to try to connect to the server in the future.
   */
  addresses: string[];
};

export function isNodeState(obj: any): obj is NodeState {
  return obj && typeof obj.version === 'string' && typeof obj.nodePubKey === 'string' && Array.isArray(obj.addresses)
    && Array.isArray(obj.pairs);
}
