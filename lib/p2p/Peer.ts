import assert from 'assert';
import { createECDH, createHash } from 'crypto';
import { EventEmitter } from 'events';
import stringify from 'json-stable-stringify';
import net, { Socket } from 'net';
import secp256k1 from 'secp256k1';
import { SocksClient, SocksClientOptions } from 'socks';
import { DisconnectionReason, ReputationEvent, SwapClientType } from '../constants/enums';
import Logger from '../Logger';
import NodeKey from '../nodekey/NodeKey';
import { OutgoingOrder } from '../orderbook/types';
import addressUtils from '../utils/addressUtils';
import { pubKeyToAlias } from '../utils/aliasUtils';
import { ms } from '../utils/utils';
import errors, { errorCodes } from './errors';
import Framer from './Framer';
import Network from './Network';
import { Packet, PacketDirection, PacketType } from './packets';
import { isPacketType, isPacketTypeArray, ResponseType } from './packets/Packet';
import * as packets from './packets/types';
import Parser from './Parser';
import { Address, NodeConnectionInfo, NodeState } from './types';

/** Key info about a peer for display purposes */
type PeerInfo = {
  address: string;
  nodePubKey?: string;
  alias?: string;
  inbound: boolean;
  pairs?: string[];
  xudVersion?: string;
  secondsConnected: number;
  lndPubKeys?: { [currency: string]: string | undefined };
  lndUris?: { [currency: string]: string[] | undefined };
  connextIdentifier?: string;
};

enum PeerStatus {
  /** The peer was just created and we have not begun the handshake yet. */
  New,
  /** We have begun the handshake procedure with the peer. */
  Opening,
  /** We have received and authenticated a [[SessionInitPacket]] from the peer. */
  Open,
  /** We have closed this peer and its respective socket connection. */
  Closed,
}

interface Peer {
  on(event: 'connect', listener: () => void): this;
  on(event: 'connFailure', listener: () => void): this;
  on(event: 'packet', listener: (packet: Packet) => void): this;
  on(event: 'reputation', listener: (event: ReputationEvent) => void): this;
  /** Adds a listener to be called when the peer's advertised but inactive pairs should be verified. */
  on(event: 'verifyPairs', listener: () => void): this;
  /** Adds a listener to be called when a previously active pair is dropped by the peer or deactivated. */
  on(event: 'pairDropped', listener: (pairId: string) => void): this;
  on(event: 'nodeStateUpdate', listener: () => void): this;
  once(event: 'close', listener: () => void): this;
  emit(event: 'connect'): boolean;
  emit(event: 'connFailure'): boolean;
  emit(event: 'reputation', reputationEvent: ReputationEvent): boolean;
  emit(event: 'close'): boolean;
  emit(event: 'packet', packet: Packet): boolean;
  /** Notifies listeners that the peer's advertised but inactive pairs should be verified. */
  emit(event: 'verifyPairs'): boolean;
  /** Notifies listeners that a previously active pair was dropped by the peer or deactivated. */
  emit(event: 'pairDropped', pairId: string): boolean;
  emit(event: 'nodeStateUpdate'): boolean;
}

/** Represents a remote peer and manages a TCP socket and incoming/outgoing communication with that peer. */
class Peer extends EventEmitter {
  public inbound!: boolean;
  /** The reason this peer disconnected from us. */
  public recvDisconnectionReason?: DisconnectionReason;
  /** The reason we told this peer we disconnected from it. */
  public sentDisconnectionReason?: DisconnectionReason;
  public expectedNodePubKey?: string;
  /** Whether the peer is included in the p2p pool list of peers and will receive broadcasted packets. */
  public active = false;
  /** Timer to periodically call getNodes #402 */
  public discoverTimer?: NodeJS.Timer;
  /**
   * Currencies that we cannot swap because we are missing a swap client identifier or because the
   * peer's token identifier for this currency does not match ours - for example this may happen
   * because a peer is using a different token contract address for a currency than we are.
   */
  public disabledCurrencies = new Set<string>();
  /** Interval to check required responses from peer. */
  public static readonly STALL_INTERVAL = 5000;
  private status = PeerStatus.New;
  /** Trading pairs advertised by this peer which we have verified that we can swap. */
  private activePairs = new Set<string>();
  /** Currencies that we have verified we can swap with this peer. */
  private activeCurrencies = new Set<string>();
  private socket?: Socket;
  private readonly parser: Parser;
  /** Timer to retry connection to peer after the previous attempt failed. */
  private retryConnectionTimer?: NodeJS.Timer;
  private stallTimer?: NodeJS.Timer;
  private pingTimer?: NodeJS.Timer;
  private checkPairsTimer?: NodeJS.Timer;
  private readonly responseMap: Map<string, PendingResponseEntry> = new Map();
  /** The epoch time in ms when we connected to this peer. */
  private connectTime!: number;
  private connectionRetriesRevoked = false;
  /** The version of xud this peer is using. */
  private _version?: string;
  /** The node pub key of this peer. */
  private _nodePubKey?: string;
  private _alias?: string;
  private nodeState?: NodeState;
  private sessionInitPacket?: packets.SessionInitPacket;
  private outEncryptionKey?: Buffer;
  private readonly network: Network;
  private readonly framer: Framer;
  /** Interval for pinging peers. */
  private static readonly PING_INTERVAL = 30000;
  /** Interval for checking if we can reactivate any inactive pairs with peers. */
  private static readonly CHECK_PAIRS_INTERVAL = 60000;
  /** Response timeout for response packets. */
  private static readonly RESPONSE_TIMEOUT = 10000;
  /** Connection retries min delay. */
  private static readonly CONNECTION_RETRIES_MIN_DELAY = 5000;
  /** Connection retries max delay. */
  private static readonly CONNECTION_RETRIES_MAX_DELAY = 3600000; // 1 hour
  /** Connection retries max period. */
  private static readonly CONNECTION_RETRIES_MAX_PERIOD = 259200000; // 3 days

  /** The version of xud this peer is using, or an empty string if it is still not known. */
  public get version() {
    return this._version || '';
  }

  /** The hex-encoded node public key for this peer, or undefined if it is still not known. */
  public get nodePubKey(): string | undefined {
    return this._nodePubKey;
  }

  public set nodePubKey(nodePubKey: string | undefined) {
    this._nodePubKey = nodePubKey;
    this._alias = nodePubKey ? pubKeyToAlias(nodePubKey) : undefined;
  }

  public get alias(): string | undefined {
    return this._alias;
  }

  /* The label is used to describe the node in logs and error messages only */
  public get label(): string {
    if (this.nodePubKey) {
      return `${this.nodePubKey} (${this.alias})`;
    }
    return this.expectedNodePubKey
      ? `${this.expectedNodePubKey}@${addressUtils.toString(this.address)}`
      : addressUtils.toString(this.address);
  }

  public get addresses(): Address[] | undefined {
    return this.nodeState ? this.nodeState.addresses : undefined;
  }

  public get connextIdentifier(): string | undefined {
    return this.nodeState ? this.nodeState.connextIdentifier : undefined;
  }

  /** Returns a list of trading pairs advertised by this peer. */
  public get advertisedPairs(): string[] {
    if (this.nodeState) {
      return this.nodeState.pairs;
    }
    return [];
  }

  public get connected(): boolean {
    return this.socket !== undefined && !this.socket.destroyed;
  }

  public get info(): PeerInfo {
    return {
      address: addressUtils.toString(this.address),
      alias: this.alias,
      nodePubKey: this.nodePubKey,
      inbound: this.inbound,
      pairs: this.nodeState ? this.nodeState.pairs : [],
      xudVersion: this.version,
      secondsConnected: Math.round((Date.now() - this.connectTime) / 1000),
      lndPubKeys: this.nodeState ? this.nodeState.lndPubKeys : undefined,
      connextIdentifier: this.nodeState ? this.nodeState.connextIdentifier : undefined,
      lndUris: this.nodeState ? this.nodeState.lndUris : undefined,
    };
  }

  /**
   * @param address The socket address for the connection to this peer.
   */
  constructor(private logger: Logger, public address: Address, network: Network) {
    super();
    this.network = network;
    this.framer = new Framer(this.network);
    this.parser = new Parser(this.framer);
    this.bindParser(this.parser);
  }

  /**
   * Creates a Peer from an inbound socket connection.
   */
  public static fromInbound = (socket: Socket, logger: Logger, network: Network): Peer => {
    const peer = new Peer(logger, addressUtils.fromSocket(socket), network);

    peer.inbound = true;
    peer.socket = socket;

    peer.bindSocket();

    return peer;
  };

  public getAdvertisedCurrencies = (): Set<string> => {
    const advertisedCurrencies: Set<string> = new Set();
    this.advertisedPairs.forEach((advertisedPair) => {
      const [baseCurrency, quoteCurrency] = advertisedPair.split('/');
      advertisedCurrencies.add(baseCurrency);
      advertisedCurrencies.add(quoteCurrency);
    });
    return advertisedCurrencies;
  };

  public getLndPubKey(currency?: string): string | undefined {
    if (!this.nodeState || !currency) {
      return undefined;
    }
    return this.nodeState.lndPubKeys[currency];
  }

  public getIdentifier = (clientType: SwapClientType, currency?: string): string | undefined => {
    if (!this.nodeState) {
      return undefined;
    }
    switch (clientType) {
      case SwapClientType.Lnd:
        return this.getLndPubKey(currency);
      case SwapClientType.Connext:
        return this.connextIdentifier;
      default:
        return undefined;
    }
  };

  public getTokenIdentifier = (currency: string): string | undefined => {
    if (!this.nodeState) {
      return undefined;
    }

    return this.nodeState.tokenIdentifiers[currency];
  };

  public getStatus = (): string => {
    let status: string;
    if (this.connected) {
      status = this.nodePubKey ? `Connected to ${this.label}` : `Connected pre-handshake to ${this.label}`;
    } else {
      status = 'Not connected';
    }
    return status;
  };

  /**
   * Prepares a peer for use by establishing a socket connection and beginning the handshake.
   * @returns the session init packet from beginning the handshake
   */
  public beginOpen = async ({
    ownNodeState,
    ownNodeKey,
    ownVersion,
    expectedNodePubKey,
    retryConnecting = false,
    torport,
  }: {
    /** Our node state data to send to the peer. */
    ownNodeState: NodeState;
    /** Our identity node key. */
    ownNodeKey: NodeKey;
    /** The version of xud we are running. */
    ownVersion: string;
    /** The expected nodePubKey of the node we are opening a connection with. */
    expectedNodePubKey?: string;
    /** Whether to retry to connect upon failure. */
    retryConnecting?: boolean;
    /** Port that Tor's exposed SOCKS5 proxy is listening on. */
    torport: number;
  }): Promise<packets.SessionInitPacket> => {
    assert(this.status === PeerStatus.New);
    assert(this.inbound || expectedNodePubKey);
    assert(!retryConnecting || !this.inbound);

    this.status = PeerStatus.Opening;
    this.expectedNodePubKey = expectedNodePubKey;

    await this.initConnection(retryConnecting, torport);
    this.initStall();

    return this.beginHandshake(ownNodeState, ownNodeKey, ownVersion);
  };

  /**
   * Finishes opening a peer for use by marking the peer as opened, completing the handshake,
   * and setting up the ping packet timer.
   * @param ownNodeState our node state data to send to the peer
   * @param ownNodeKey our identity node key
   * @param ownVersion the version of xud we are running
   * @param sessionInit the session init packet we received when beginning the handshake
   */
  public completeOpen = async (
    ownNodeState: NodeState,
    ownNodeKey: NodeKey,
    ownVersion: string,
    sessionInit: packets.SessionInitPacket,
  ) => {
    assert(this.status === PeerStatus.Opening);

    await this.completeHandshake(ownNodeState, ownNodeKey, ownVersion, sessionInit);

    this.status = PeerStatus.Open;

    // Setup the ping interval
    this.pingTimer = setInterval(this.sendPing, Peer.PING_INTERVAL);

    // Setup a timer to periodicially check if we can swap inactive pairs
    this.checkPairsTimer = setInterval(() => this.emit('verifyPairs'), Peer.CHECK_PAIRS_INTERVAL);
  };

  /**
   * Close a peer by ensuring the socket is destroyed and terminating all timers.
   */
  public close = (reason?: DisconnectionReason, reasonPayload?: string) => {
    if (this.status === PeerStatus.Closed) {
      return;
    }

    this.status = PeerStatus.Closed;
    this.revokeConnectionRetries();

    if (this.socket) {
      if (this.socket.destroyed) {
        // the socket has already been destroyed, it cannot be used to send further packets
        // and does not need further destruction. it can simply be deleted from memory
        delete this.socket;
      } else if (this.socket.connecting || reason === undefined) {
        // either we are still connecting (socket.connect has been called but not finished) the socket and
        // thus we cannot transmit packets to the peer yet, or we have not specified a disconnection reason
        // either way, we don't need to send a disconnecting packet and can destroy the socket right away
        this.socket.destroy();
        this.socket.removeAllListeners();
        delete this.socket;
      } else {
        // try to send the peer a disconnecting reason packet before destroying the socket
        this.logger.debug(`Peer ${this.label}: closing socket. reason: ${DisconnectionReason[reason]}`);
        this.sentDisconnectionReason = reason;

        // we send the disconnection packet as a "best effort" and don't wait for the data to be written to the socket
        // in case the socket is dead or stalled, we don't want the delay to hold up the flow of closing this peer
        this.sendPacket(new packets.DisconnectingPacket({ reason, payload: reasonPayload }))
          .finally(() => {
            // destroy the socket after sending the disconnecting packet (if any)
            this.socket?.destroy();
            this.socket?.removeAllListeners();
            delete this.socket;
          })
          .catch(this.logger.error);
      }
    }

    if (this.retryConnectionTimer) {
      clearTimeout(this.retryConnectionTimer);
      this.retryConnectionTimer = undefined;
    }

    if (this.discoverTimer) {
      clearInterval(this.discoverTimer);
      this.discoverTimer = undefined;
    }

    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = undefined;
    }

    if (this.checkPairsTimer) {
      clearInterval(this.checkPairsTimer);
      this.checkPairsTimer = undefined;
    }

    if (this.stallTimer) {
      clearInterval(this.stallTimer);
      this.stallTimer = undefined;
    }

    let rejectionMsg;
    if (reason) {
      rejectionMsg = `Peer ${this.label} closed due to ${DisconnectionReason[reason]} ${reasonPayload || ''}`;
    } else if (this.recvDisconnectionReason) {
      rejectionMsg = `Peer ${this.label} disconnected from us due to ${
        DisconnectionReason[this.recvDisconnectionReason]
      }`;
    } else {
      rejectionMsg = `Peer ${this.label} was closed`;
    }

    for (const [packetType, entry] of this.responseMap) {
      this.responseMap.delete(packetType);
      entry.reject(new Error(rejectionMsg));
    }

    this.emit('close');
  };

  public revokeConnectionRetries = (): void => {
    this.connectionRetriesRevoked = true;
  };

  public sendPacket = async (packet: Packet): Promise<void> => {
    const data = await this.framer.frame(packet, this.outEncryptionKey);
    try {
      await new Promise((resolve, reject) => {
        if (this.socket && !this.socket.destroyed) {
          this.socket.write(data, (err) => {
            if (err) {
              this.logger.trace(
                `could not send ${PacketType[packet.type]} packet to ${this.label}: ${JSON.stringify(packet)}`,
              );
              reject(err);
            } else {
              this.logger.trace(`Sent ${PacketType[packet.type]} packet to ${this.label}: ${JSON.stringify(packet)}`);

              if (packet.direction === PacketDirection.Request) {
                this.addResponseTimeout(packet.header.id, packet.responseType, Peer.RESPONSE_TIMEOUT);
              }
              resolve();
            }
          });
        } else {
          this.logger.warn(`could not send packet to ${this.label} because socket is nonexistent or destroyed`);
          resolve();
        }
      });
    } catch (err) {
      this.logger.error(`failed sending data to ${this.label}`, err);
    }
  };

  public sendOrders = async (orders: OutgoingOrder[], reqId: string): Promise<void> => {
    const packet = new packets.OrdersPacket(orders, reqId);
    await this.sendPacket(packet);
  };

  /** Sends a [[NodesPacket]] containing node connection info to this peer. */
  public sendNodes = async (nodes: NodeConnectionInfo[], reqId: string): Promise<void> => {
    const packet = new packets.NodesPacket(nodes, reqId);
    await this.sendPacket(packet);
  };

  public deactivateCurrency = (currency: string) => {
    if (this.activeCurrencies.has(currency)) {
      this.activeCurrencies.delete(currency);
      this.activePairs.forEach((activePairId) => {
        const [baseCurrency, quoteCurrency] = activePairId.split('/');
        if (baseCurrency === currency || quoteCurrency === currency) {
          this.deactivatePair(activePairId);
        }
      });
      this.logger.debug(`deactivated ${currency} for peer ${this.label}`);
    }
  };

  public activateCurrency = (currency: string) => this.activeCurrencies.add(currency);

  public disableCurrency = (currency: string) => {
    if (!this.disabledCurrencies.has(currency)) {
      this.disabledCurrencies.add(currency);
      this.deactivateCurrency(currency);
    }
  };

  public enableCurrency = (currency: string) => {
    if (this.disabledCurrencies.delete(currency)) {
      this.logger.debug(`enabled ${currency} for peer ${this.label}`);
    }
  };

  /**
   * Deactivates a trading pair with this peer.
   */
  public deactivatePair = (pairId: string) => {
    if (!this.nodeState) {
      throw new Error('cannot deactivate a trading pair before handshake is complete');
    }
    if (this.activePairs.delete(pairId)) {
      this.emit('pairDropped', pairId);
    }
    // TODO: notify peer that we have deactivated this pair?
  };

  /**
   * Activates a trading pair with this peer.
   */
  public activatePair = async (pairId: string) => {
    if (!this.nodeState) {
      throw new Error('cannot activate a trading pair before handshake is complete');
    }
    this.activePairs.add(pairId);
    // request peer's orders
    await this.sendPacket(new packets.GetOrdersPacket({ pairIds: [pairId] }));
  };

  public isPairActive = (pairId: string) => this.activePairs.has(pairId);

  public isCurrencyActive = (currency: string) => this.activeCurrencies.has(currency);

  /**
   * Gets lnd client's listening uris for the provided currency.
   * @param currency
   */
  public getLndUris(currency: string): string[] | undefined {
    if (this.nodeState && this.nodeState.lndUris) {
      return this.nodeState.lndUris[currency];
    }
    return undefined;
  }

  /**
   * Ensure we are connected (for inbound connections) or listen for the `connect` socket event (for outbound connections)
   * and set the [[connectTime]] timestamp. If an outbound connection attempt errors or times out, throw an error.
   */
  private initConnection = (retry = false, torport: number) => {
    if (this.connected) {
      // in case of an inbound peer, we will already be connected
      assert(this.socket);
      assert(this.inbound);
      this.connectTime = Date.now();
      this.logger.debug(this.getStatus());
      return Promise.resolve(undefined);
    }

    return new Promise<undefined>((resolve, reject) => {
      const startTime = Date.now();
      let retryDelay = Peer.CONNECTION_RETRIES_MIN_DELAY;
      let retries = 0;
      this.inbound = false;
      this.connectionRetriesRevoked = false;

      const connectViaProxy = () => {
        this.socket = net.connect(torport, 'localhost');

        const proxyOptions: SocksClientOptions = {
          proxy: {
            host: 'localhost',
            port: torport,
            type: 5, // Proxy version
          },
          command: 'connect',
          destination: {
            host: this.address.host,
            port: this.address.port,
          },
          existing_socket: this.socket,
        };
        SocksClient.createConnection(proxyOptions)
          .then((info) => {
            assert(this.socket === info.socket);
            onConnect();
          })
          .catch(onError);
      };

      const connect = () => {
        if (torport) {
          connectViaProxy();
        } else {
          this.socket = net.connect(this.address.port, this.address.host);
          this.socket.once('connect', onConnect);
          this.socket.on('error', onError);
        }
      };

      const cleanup = () => {
        if (this.socket) {
          this.socket.removeListener('error', onError);
          this.socket.removeListener('connect', onConnect);
        }
        if (this.retryConnectionTimer) {
          clearTimeout(this.retryConnectionTimer);
          this.retryConnectionTimer = undefined;
        }
      };

      const onConnect = () => {
        this.connectTime = Date.now();

        this.bindSocket();

        this.logger.debug(this.getStatus());

        this.emit('connect');

        cleanup();
        resolve();
      };

      const onError = (err: Error) => {
        cleanup();

        this.emit('connFailure');

        if (!retry) {
          this.close();
          reject(errors.COULD_NOT_CONNECT(this.address, err));
          return;
        }

        if (Date.now() - startTime + retryDelay > Peer.CONNECTION_RETRIES_MAX_PERIOD) {
          this.close();
          reject(errors.CONNECTION_RETRIES_MAX_PERIOD_EXCEEDED);
          return;
        }

        if (this.connectionRetriesRevoked) {
          this.close();
          reject(errors.CONNECTION_RETRIES_REVOKED);
          return;
        }

        this.logger.debug(
          `Connection attempt #${retries + 1} to ${this.label} ` +
            `failed: ${err.message}. retrying in ${retryDelay / 1000} sec...`,
        );

        this.retryConnectionTimer = setTimeout(() => {
          retryDelay = Math.min(Peer.CONNECTION_RETRIES_MAX_DELAY, retryDelay * 2);
          retries += 1;
          connect();
        }, retryDelay);
      };

      connect();
    });
  };

  private initStall = (): void => {
    if (this.status === PeerStatus.Closed) {
      return;
    }
    assert(!this.stallTimer);

    this.stallTimer = setInterval(this.checkTimeout, Peer.STALL_INTERVAL);
  };

  /**
   * Waits for a packet to be received from peer.
   * @returns A promise that is resolved once the packet is received or rejects on timeout.
   */
  public wait = (
    reqId: string,
    resType: ResponseType,
    timeout?: number,
    cb?: (packet: Packet) => void,
  ): Promise<Packet> => {
    const entry = this.getOrAddPendingResponseEntry(reqId, resType);
    return new Promise((resolve, reject) => {
      entry.addJob(resolve, reject);

      if (cb) {
        entry.addCb(cb);
      }

      if (timeout) {
        entry.setTimeout(timeout);
      }
    });
  };

  private waitSessionInit = async (): Promise<packets.SessionInitPacket> => {
    if (!this.sessionInitPacket) {
      await this.wait(PacketType.SessionInit.toString(), undefined, Peer.RESPONSE_TIMEOUT);
    }

    return this.sessionInitPacket!;
  };

  /**
   * Potentially timeout peer if it hasn't responded.
   */
  private checkTimeout = () => {
    const now = ms();

    for (const [packetId, entry] of this.responseMap) {
      if (now > entry.timeout) {
        const request = PacketType[parseInt(packetId, 10)] || packetId;
        const err = errors.RESPONSE_TIMEOUT(request);
        this.logger.error(`Peer timed out waiting for response to packet ${packetId}`);
        entry.reject(err);
        this.close(DisconnectionReason.ResponseStalling, packetId);
      }
    }
  };

  /**
   * Wait for a packet to be received from peer.
   */
  private addResponseTimeout = (reqId: string, resType: ResponseType, timeout: number) => {
    if (this.status !== PeerStatus.Closed) {
      const entry = this.getOrAddPendingResponseEntry(reqId, resType);
      entry.setTimeout(timeout);
    }
  };

  private getOrAddPendingResponseEntry = (reqId: string, resType: ResponseType): PendingResponseEntry => {
    let entry = this.responseMap.get(reqId);

    if (!entry) {
      entry = new PendingResponseEntry(resType);
      this.responseMap.set(reqId, entry);
    }

    return entry;
  };

  /**
   * Fulfill a pending response entry for solicited responses, penalize unsolicited responses.
   * @returns false if no pending response entry exists for the provided key, otherwise true
   */
  private fulfillResponseEntry = (packet: Packet): boolean => {
    const { reqId } = packet.header;
    if (!reqId) {
      this.logger.debug(`Peer ${this.label} sent a response packet without reqId`);
      // TODO: penalize
      return false;
    }

    const entry = this.responseMap.get(reqId);

    if (!entry) {
      this.logger.debug(`Peer ${this.label} sent an unsolicited response packet (${reqId})`);
      // TODO: penalize
      return false;
    }

    const isExpectedType =
      entry.resType === undefined ||
      (isPacketType(entry.resType) && packet.type === entry.resType) ||
      (isPacketTypeArray(entry.resType) && entry.resType.includes(packet.type));

    if (!isExpectedType) {
      this.logger.debug(
        `Peer ${this.label} sent an unsolicited packet type (${
          PacketType[packet.type]
        }) for response packet (${reqId})`,
      );
      // TODO: penalize
      return false;
    }

    this.responseMap.delete(reqId);
    entry.resolve(packet);

    return true;
  };

  /**
   * Binds listeners to a newly connected socket for `error`, `close`, and `data` events.
   */
  private bindSocket = () => {
    assert(this.socket);

    this.socket.on('error', (err) => {
      this.logger.error(`Peer (${this.label}) error`, err);
    });

    this.socket.on('close', async (hadError) => {
      // emitted once the socket is fully closed
      if (this.nodePubKey === undefined) {
        this.logger.info(`Socket closed prior to handshake with ${this.label}`);
      } else if (hadError) {
        this.logger.warn(`Peer ${this.label} socket closed due to error`);
      } else {
        this.logger.info(`Peer ${this.label} socket closed`);
      }
      this.close();
    });

    this.socket.on('data', this.parser.feed);

    this.socket.setNoDelay(true);
  };

  private bindParser = (parser: Parser): void => {
    parser.on('packet', this.handlePacket);

    parser.on('error', async (err: { message: string; code: string }) => {
      if (this.status === PeerStatus.Closed) {
        return;
      }

      switch (err.code) {
        case errorCodes.PARSER_INVALID_PACKET:
        case errorCodes.PARSER_UNKNOWN_PACKET_TYPE:
        case errorCodes.PARSER_DATA_INTEGRITY_ERR:
        case errorCodes.PARSER_MAX_BUFFER_SIZE_EXCEEDED:
        case errorCodes.FRAMER_MSG_NOT_ENCRYPTED:
        case errorCodes.FRAMER_INVALID_NETWORK_MAGIC_VALUE:
        case errorCodes.FRAMER_INCOMPATIBLE_MSG_ORIGIN_NETWORK:
        case errorCodes.FRAMER_INVALID_MSG_LENGTH:
          this.logger.warn(`Peer (${this.label}): ${err.message}`);
          this.emit('reputation', ReputationEvent.WireProtocolErr);
          this.close(DisconnectionReason.WireProtocolErr, err.message);
          break;
        default:
          this.close();
          break;
      }
    });
  };

  /** Checks if a given packet is solicited and fulfills the pending response entry if it's a response. */
  private isPacketSolicited = async (packet: Packet): Promise<boolean> => {
    if (
      this.status !== PeerStatus.Open &&
      packet.type !== PacketType.SessionInit &&
      packet.type !== PacketType.SessionAck &&
      packet.type !== PacketType.Disconnecting
    ) {
      // until the connection is opened, we only accept SessionInit, SessionAck, and Disconnecting packets
      return false;
    }
    if (packet.direction === PacketDirection.Response) {
      // lookup a pending response entry for this packet by its reqId
      if (!this.fulfillResponseEntry(packet)) {
        return false;
      }
    }

    return true;
  };

  private handlePacket = async (packet: Packet): Promise<void> => {
    this.logger.trace(`Received ${PacketType[packet.type]} packet from ${this.label}: ${JSON.stringify(packet)}`);

    if (await this.isPacketSolicited(packet)) {
      switch (packet.type) {
        case PacketType.SessionInit: {
          this.handleSessionInit(packet);
          break;
        }
        case PacketType.NodeStateUpdate: {
          this.handleNodeStateUpdate(packet);
          break;
        }
        case PacketType.Ping: {
          await this.handlePing(packet);
          break;
        }
        case PacketType.Disconnecting: {
          this.handleDisconnecting(packet);
          break;
        }
        default:
          this.emit('packet', packet);
          break;
      }
    } else {
      // TODO: penalize for unsolicited packets
    }
  };

  /**
   * Authenticates the identity of a peer with a [[SessionInitPacket]] and sets the peer's node state.
   * Throws an error and closes the peer if authentication fails.
   * @param packet the session init packet
   * @param nodePubKey our node pub key
   * @param expectedNodePubKey the expected node pub key of the sender of the init packet
   */
  private authenticateSessionInit = (
    packet: packets.SessionInitPacket,
    nodePubKey: string,
    expectedNodePubKey?: string,
  ) => {
    const body = packet.body!;
    const { sign, ...bodyWithoutSign } = body;
    /** The pub key of the node that sent the init packet. */
    const sourceNodePubKey = body.nodePubKey;
    /** The pub key of the node that the init packet is intended for. */
    const targetNodePubKey = body.peerPubKey;

    // verify that the init packet came from the expected node
    if (expectedNodePubKey && expectedNodePubKey !== sourceNodePubKey) {
      this.close(DisconnectionReason.UnexpectedIdentity);
      throw errors.UNEXPECTED_NODE_PUB_KEY(sourceNodePubKey, expectedNodePubKey, addressUtils.toString(this.address));
    }

    // verify that the init packet was intended for us
    if (targetNodePubKey !== nodePubKey) {
      this.emit('reputation', ReputationEvent.InvalidAuth);
      this.close(DisconnectionReason.AuthFailureInvalidTarget);
      throw errors.AUTH_FAILURE_INVALID_TARGET(sourceNodePubKey, targetNodePubKey);
    }

    // verify that the msg was signed by the peer
    const msg = stringify(bodyWithoutSign);
    const msgHash = createHash('sha256').update(msg).digest();
    const verified = secp256k1.verify(msgHash, Buffer.from(sign, 'hex'), Buffer.from(sourceNodePubKey, 'hex'));

    if (!verified) {
      this.emit('reputation', ReputationEvent.InvalidAuth);
      this.close(DisconnectionReason.AuthFailureInvalidSignature);
      throw errors.AUTH_FAILURE_INVALID_SIGNATURE(sourceNodePubKey);
    }

    // finally set this peer's node state to the node state in the init packet body
    this.nodeState = body.nodeState;
    this.nodePubKey = body.nodePubKey;
    this._version = body.version;
  };

  /**
   * Sets public key and alias for this node together so that they are always in sync.
   */
  public setIdentifiers(nodePubKey: string) {
    this._nodePubKey = nodePubKey;
    this._alias = pubKeyToAlias(nodePubKey);
  }

  /**
   * Sends a [[SessionInitPacket]] and waits for a [[SessionAckPacket]].
   */
  private initSession = async (
    ownNodeState: NodeState,
    ownNodeKey: NodeKey,
    ownVersion: string,
    expectedNodePubKey: string,
  ): Promise<void> => {
    const ECDH = createECDH('secp256k1');
    const ephemeralPubKey = ECDH.generateKeys().toString('hex');
    const packet = this.createSessionInitPacket({
      ephemeralPubKey,
      ownNodeState,
      ownNodeKey,
      ownVersion,
      expectedNodePubKey,
    });
    await this.sendPacket(packet);
    await this.wait(
      packet.header.id,
      packet.responseType,
      Peer.RESPONSE_TIMEOUT,
      (sessionAckPacket: packets.SessionAckPacket) => {
        // enabling in-encryption synchronously,
        // expecting the following peer msg to be encrypted
        const key = ECDH.computeSecret(sessionAckPacket.body!.ephemeralPubKey, 'hex');
        this.setInEncryption(key);
      },
    );
  };

  /**
   * Sends a [[SessionAckPacket]] in response to a given [[SessionInitPacket]].
   */
  private ackSession = async (sessionInit: packets.SessionInitPacket): Promise<void> => {
    const ECDH = createECDH('secp256k1');
    const ephemeralPubKey = ECDH.generateKeys().toString('hex');

    await this.sendPacket(new packets.SessionAckPacket({ ephemeralPubKey }, sessionInit.header.id));

    // enabling out-encryption synchronously,
    // so that the following msg will be encrypted
    const key = ECDH.computeSecret(sessionInit.body!.ephemeralPubKey, 'hex');
    this.setOutEncryption(key);
  };

  /**
   * Begins the handshake by waiting for a [[SessionInitPacket]] as well as sending our own
   * [[SessionInitPacket]] first if we are the outbound peer.
   * @returns the session init packet we receive
   */
  private beginHandshake = async (ownNodeState: NodeState, ownNodeKey: NodeKey, ownVersion: string) => {
    let sessionInit: packets.SessionInitPacket;
    if (!this.inbound) {
      // outbound handshake
      assert(this.expectedNodePubKey);
      await this.initSession(ownNodeState, ownNodeKey, ownVersion, this.expectedNodePubKey);
      sessionInit = await this.waitSessionInit();
      this.authenticateSessionInit(sessionInit, ownNodeKey.pubKey, this.expectedNodePubKey);
    } else {
      // inbound handshake
      sessionInit = await this.waitSessionInit();
      this.authenticateSessionInit(sessionInit, ownNodeKey.pubKey);
    }
    return sessionInit;
  };

  /**
   * Completes the handshake by sending the [[SessionAckPacket]] and our [[SessionInitPacket]] if it
   * has not been sent already, as is the case with inbound peers.
   */
  private completeHandshake = async (
    ownNodeState: NodeState,
    ownNodeKey: NodeKey,
    ownVersion: string,
    sessionInit: packets.SessionInitPacket,
  ) => {
    if (!this.inbound) {
      // outbound handshake
      await this.ackSession(sessionInit);
    } else {
      // inbound handshake
      await this.ackSession(sessionInit);
      await this.initSession(ownNodeState, ownNodeKey, ownVersion, sessionInit.body!.nodePubKey);
    }
  };

  private sendPing = async (): Promise<void> => {
    const packet = new packets.PingPacket();
    await this.sendPacket(packet);
  };

  public sendGetNodes = async (): Promise<packets.GetNodesPacket> => {
    const packet = new packets.GetNodesPacket();
    await this.sendPacket(packet);
    return packet;
  };

  public discoverNodes = async (): Promise<number> => {
    const packet = await this.sendGetNodes();
    const res = await this.wait(packet.header.id, packet.responseType);
    return res.body.length;
  };

  private sendPong = async (pingId: string): Promise<void> => {
    const packet = new packets.PongPacket(undefined, pingId);
    await this.sendPacket(packet);
  };

  private handlePing = async (packet: packets.PingPacket): Promise<void> => {
    await this.sendPong(packet.header.id);
  };

  private createSessionInitPacket = ({
    ephemeralPubKey,
    ownNodeState,
    ownNodeKey,
    ownVersion,
    expectedNodePubKey,
  }: {
    ephemeralPubKey: string;
    ownNodeState: NodeState;
    ownNodeKey: NodeKey;
    ownVersion: string;
    expectedNodePubKey: string;
  }): packets.SessionInitPacket => {
    let body: any = {
      ephemeralPubKey,
      version: ownVersion,
      peerPubKey: expectedNodePubKey,
      nodePubKey: ownNodeKey.pubKey,
      nodeState: ownNodeState,
    };

    const msg = stringify(body);
    const msgHash = createHash('sha256').update(msg).digest();
    const { signature } = secp256k1.sign(msgHash, ownNodeKey.privKey);

    body = { ...body, sign: signature.toString('hex') };

    return new packets.SessionInitPacket(body);
  };

  private handleDisconnecting = (packet: packets.DisconnectingPacket): void => {
    if (!this.recvDisconnectionReason && packet.body && packet.body.reason !== undefined) {
      this.logger.debug(
        `received disconnecting packet from ${this.label} due to ${DisconnectionReason[packet.body.reason]}`,
      );
      this.recvDisconnectionReason = packet.body.reason;
    } else {
      // protocol violation: packet should be sent once only, with body, with `reason` field
      // TODO: penalize peer
    }
  };

  private handleSessionInit = (packet: packets.SessionInitPacket): void => {
    this.sessionInitPacket = packet;

    const entry = this.responseMap.get(PacketType.SessionInit.toString());
    if (entry) {
      this.responseMap.delete(PacketType.SessionInit.toString());
      entry.resolve(packet);
    }
  };

  private handleNodeStateUpdate = (packet: packets.NodeStateUpdatePacket): void => {
    const nodeStateUpdate = packet.body!;
    this.logger.verbose(`received node state update packet from ${this.label}: ${JSON.stringify(nodeStateUpdate)}`);

    this.activePairs.forEach((pairId) => {
      if (!nodeStateUpdate.pairs.includes(pairId)) {
        // a trading pair was previously active but is not in the updated node state
        this.deactivatePair(pairId);
      }
    });

    this.nodeState = nodeStateUpdate;
    this.emit('nodeStateUpdate');
    this.emit('verifyPairs');
  };

  private setOutEncryption = (key: Buffer) => {
    this.outEncryptionKey = key;
    this.logger.debug(`Peer ${this.label} session out-encryption enabled`);
  };

  private setInEncryption = (key: Buffer) => {
    this.parser.setEncryptionKey(key);
    this.logger.debug(`Peer ${this.label} session in-encryption enabled`);
  };
}

/** A class representing a wait for an anticipated response packet from a peer. */
class PendingResponseEntry {
  public timeout = 0;
  /** An array of tasks to resolve or reject. */
  public jobs: Job[] = [];
  /** An array of callbacks to be called synchronously when entry resolve. */
  public callbacks: Function[] = [];

  constructor(public resType: ResponseType) {}

  public addJob = (resolve: Function, reject: Function) => {
    this.jobs.push(new Job(resolve, reject));
  };

  public addCb = (cb: Function) => {
    this.callbacks.push(cb);
  };

  public setTimeout = (timeout: number): void => {
    this.timeout = ms() + timeout;
  };

  public resolve = (result: any) => {
    for (const job of this.jobs) {
      job.resolve(result);
    }

    for (const cb of this.callbacks) {
      cb(result);
    }

    this.jobs.length = 0;
    this.callbacks.length = 0;
  };

  public reject = (err: any) => {
    for (const job of this.jobs) {
      job.reject(err);
    }

    this.jobs.length = 0;
  };
}

/** A pair of functions for resolving or rejecting a task. */
class Job {
  constructor(public resolve: Function, public reject: Function) {}
}

export default Peer;
export { PeerInfo };
