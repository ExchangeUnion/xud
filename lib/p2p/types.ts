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
  /** This node's listening external socket addresses to advertise to peers. */
  addresses: Address[];
  pairs: string[];
  raidenAddress: string;
  /** An object mapping currency symbols to lnd pub keys. */
  lndPubKeys: { [currency: string]: string | undefined };
  /** An object mapping currency symbols to token identifiers such as lnd chains or raiden token contract addresses. */
  tokenIdentifiers: { [currency: string]: string | undefined };
};

export type PoolConfig = {
  /** Whether or not to automatically detect and share current external ip address on startup. */
  detectexternalip: boolean;

  /** Whether to send a GetNodes packet to discover new nodes upon connecting to peers, defaults to true. */
  discover: boolean;

  /**
   * Time interval between sending GetNodes packets to already connected peers. Measured in
   * minutes, only applies if discover option is true.
   */
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
