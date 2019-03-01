import assert from 'assert';
import net, { Socket } from 'net';
import { EventEmitter } from 'events';
import crypto from 'crypto';
import secp256k1 from 'secp256k1';
import stringify from 'json-stable-stringify';
import semver from 'semver';
import { ReputationEvent, DisconnectionReason, NetworkMagic } from '../constants/enums';
import Parser from './Parser';
import * as packets from './packets/types';
import Logger from '../Logger';
import { ms } from '../utils/utils';
import { OutgoingOrder } from '../orderbook/types';
import { Packet, PacketDirection, PacketType } from './packets';
import { NodeState, Address, NodeConnectionInfo, PoolConfig } from './types';
import errors, { errorCodes } from './errors';
import addressUtils from '../utils/addressUtils';
import NodeKey from '../nodekey/NodeKey';
import Network from './Network';
import Framer from './Framer';

const minCompatibleVersion: string = require('../../package.json').minCompatibleVersion;

/** Key info about a peer for display purposes */
type PeerInfo = {
  address: string,
  nodePubKey?: string,
  inbound: boolean,
  pairs?: string[],
  xudVersion?: string,
  secondsConnected: number,
  lndbtcPubKey?: string;
  lndltcPubKey?: string;
};

interface Peer {
  on(event: 'packet', listener: (packet: Packet) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'pairDropped', listener: (pair: string) => void): this;
  on(event: 'nodeStateUpdate', listener: () => void): this;
  once(event: 'open', listener: () => void): this;
  once(event: 'close', listener: () => void): this;
  once(event: 'reputation', listener: (event: ReputationEvent) => void): this;
  emit(event: 'connect'): boolean;
  emit(event: 'reputation', reputationEvent: ReputationEvent): boolean;
  emit(event: 'open'): boolean;
  emit(event: 'close'): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'packet', packet: Packet): boolean;
  emit(event: 'pairDropped', pair: string): boolean;
  emit(event: 'nodeStateUpdate'): boolean;
}

/** Represents a remote XU peer */
class Peer extends EventEmitter {
  // TODO: properties documentation
  public inbound!: boolean;
  public recvDisconnectionReason?: DisconnectionReason;
  public sentDisconnectionReason?: DisconnectionReason;
  public expectedNodePubKey?: string;
  public active = false; // added to peer list
  /** Timer to periodically call getNodes #402 */
  public discoverTimer?: NodeJS.Timer;
  private opened = false;
  private socket?: Socket;
  private parser: Parser;
  private closed = false;
  /** Timer to retry connection to peer after the previous attempt failed. */
  private retryConnectionTimer?: NodeJS.Timer;
  private connectTimeout?: NodeJS.Timer;
  private stallTimer?: NodeJS.Timer;
  private pingTimer?: NodeJS.Timer;
  private responseMap: Map<string, PendingResponseEntry> = new Map();
  private connectTime!: number;
  private connectionRetriesRevoked = false;
  private lastRecv = 0;
  private lastSend = 0;
  private nodeState?: NodeState;
  private sessionInitPacket?: packets.SessionInitPacket;
  private outEncryptionKey?: Buffer;
  /** A counter for packets sent to be used for assigning unique packet ids. */
  private packetCount = 0;
  private network = new Network(NetworkMagic.TestNet); // TODO: inject from constructor to support more networks
  private framer: Framer;
  private deactivatedPairs = new Set<string>();
  /** Interval to check required responses from peer. */
  private static readonly STALL_INTERVAL = 5000;
  /** Interval for pinging peers. */
  private static readonly PING_INTERVAL = 30000;
  /** Response timeout for response packets. */
  private static readonly RESPONSE_TIMEOUT = 10000;
  /** Socket connection timeout for outbound peers. */
  private static readonly CONNECTION_TIMEOUT = 10000;
  /** Connection retries min delay. */
  private static readonly CONNECTION_RETRIES_MIN_DELAY = 5000;
  /** Connection retries max delay. */
  private static readonly CONNECTION_RETRIES_MAX_DELAY = 3600000;
  /** Connection retries max period. */
  private static readonly CONNECTION_RETRIES_MAX_PERIOD = 604800000;

  private get version(): string {
    return this.nodeState ? this.nodeState.version : '';
  }

  /** The hex-encoded node public key for this peer, or undefined if it is still not known. */
  public get nodePubKey(): string | undefined {
    return this.nodeState ? this.nodeState.nodePubKey : undefined;
  }

  public get label(): string {
    return this.nodePubKey || addressUtils.toString(this.address);
  }

  public get addresses(): Address[] | undefined {
    return this.nodeState ? this.nodeState.addresses : undefined;
  }

  /** Returns a list of active trading pairs supported by this peer. */
  public get pairs(): string[] | undefined {
    if (this.nodeState) {
      const activePairs = this.nodeState.pairs.filter((pair) => {
        return !this.deactivatedPairs.has(pair);
      });
      return activePairs;
    }
    return undefined;
  }

  public get connected(): boolean {
    return this.socket !== undefined && !this.socket.destroyed;
  }

  public get info(): PeerInfo {
    return {
      address: addressUtils.toString(this.address),
      nodePubKey: this.nodeState ? this.nodeState.nodePubKey : undefined,
      inbound: this.inbound,
      pairs: this.nodeState ? this.nodeState.pairs : undefined,
      xudVersion: this.nodeState ? this.nodeState.version : undefined,
      secondsConnected: Math.round((Date.now() - this.connectTime) / 1000),
      lndbtcPubKey: this.getLndPubKey('BTC'),
      lndltcPubKey: this.getLndPubKey('LTC'),
    };
  }

  /**
   * @param address The socket address for the connection to this peer.
   */
  constructor(private logger: Logger, public address: Address, private config: PoolConfig) {
    super();

    this.framer = new Framer(this.network);
    this.parser = new Parser(this.framer);
    this.bindParser(this.parser);
  }

  /**
   * Creates a Peer from an inbound socket connection.
   */
  public static fromInbound = (socket: Socket, logger: Logger, config: PoolConfig): Peer => {
    const peer = new Peer(logger, addressUtils.fromSocket(socket), config);

    peer.inbound = true;
    peer.socket = socket;

    peer.bindSocket();

    return peer;
  }

  public getLndPubKey(chain: string): string | undefined {
    if (!this.nodeState) {
      return;
    }
    switch (chain) {
      case 'BTC':
        return this.nodeState.lndbtcPubKey;
      case 'LTC':
        return this.nodeState.lndltcPubKey;
      default:
        return;
    }
  }

  public getStatus = (): string => {
    let status: string;
    if (this.connected) {
      status = this.nodePubKey ?
        `Connected to peer ${this.nodePubKey}` :
        `Connected pre-handshake to peer ${addressUtils.toString(this.address)}`;
    } else {
      status = 'Not connected';
    }
    return status;
  }

  /**
   * Prepare a connection for use by ensuring it is active, exchanging [[HelloPacket]] with handshake data,
   * and emit the `open` event if everything succeeds. Throw an error on unexpected handshake data.
   * @param handshakeData our handshake data to send to the peer
   * @param nodePubKey the expected nodePubKey of the node we are opening a connection with
   * @param retryConnecting whether to retry to connect upon failure
   */
  public open = async (ownNodeState: NodeState, nodeKey: NodeKey, expectedNodePubKey?: string, retryConnecting = false): Promise<void> => {
    assert(!this.opened);
    assert(!this.closed);
    assert(this.inbound || expectedNodePubKey);
    assert(!retryConnecting || !this.inbound);

    this.expectedNodePubKey = expectedNodePubKey;

    await this.initConnection(retryConnecting);
    this.initStall();

    await this.handshake(ownNodeState, nodeKey);

    if (this.expectedNodePubKey && this.nodePubKey !== this.expectedNodePubKey) {
      this.close(DisconnectionReason.UnexpectedIdentity);
      throw errors.UNEXPECTED_NODE_PUB_KEY(this.nodePubKey!, this.expectedNodePubKey, addressUtils.toString(this.address));
    }

    if (this.nodePubKey === ownNodeState.nodePubKey) {
      this.close(DisconnectionReason.ConnectedToSelf);
      throw errors.ATTEMPTED_CONNECTION_TO_SELF;
    }

    // Check if version is semantic, and higher than minCompatibleVersion.
    if (!semver.valid(this.version)) {
      this.close(DisconnectionReason.MalformedVersion);
      throw errors.MALFORMED_VERSION(addressUtils.toString(this.address), this.version);
    }
    // dev.note: compare returns 0 if v1 == v2, or 1 if v1 is greater, or -1 if v2 is greater.
    if (semver.compare(this.version, minCompatibleVersion) === -1) {
      this.close(DisconnectionReason.IncompatibleProtocolVersion);
      throw errors.INCOMPATIBLE_VERSION(addressUtils.toString(this.address), minCompatibleVersion, this.version);
    }

    // request peer's known nodes only if p2p.discover option is true
    if (this.config.discover) {
      this.sendPacket(new packets.GetNodesPacket());
      if (this.config.discoverminutes === 0) {
        // timer is disabled
        this.discoverTimer = undefined; // defensive programming
      } else {
        // timer is enabled
        this.discoverTimer = setInterval(this.sendGetNodes, this.config.discoverminutes * 1000 * 60);
      }
    }

    // Setup the ping interval
    this.pingTimer = setInterval(this.sendPing, Peer.PING_INTERVAL);

    // let listeners know that this peer is ready to go
    this.opened = true;
    this.emit('open');
  }

  /**
   * Close a peer by ensuring the socket is destroyed and terminating all timers.
   */
  public close = (reason?: DisconnectionReason, reasonPayload?: string): void => {
    if (this.closed) {
      return;
    }

    this.closed = true;

    if (this.socket) {
      if (reason !== undefined) {
        this.logger.debug(`Peer (${ this.label }): closing socket. reason: ${DisconnectionReason[reason]}`);
        this.sentDisconnectionReason = reason;
        this.sendPacket(new packets.DisconnectingPacket({ reason, payload: reasonPayload }));
      }

      if (!this.socket.destroyed) {
        this.socket.destroy();
      }
      delete this.socket;
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

    if (this.stallTimer) {
      clearInterval(this.stallTimer);
      this.stallTimer = undefined;
    }

    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout);
      this.connectTimeout = undefined;
    }

    let rejectionMsg;
    if (reason) {
      rejectionMsg = `Peer closed due to ${DisconnectionReason[reason]}`;
    } else if (this.recvDisconnectionReason) {
      rejectionMsg = `Peer disconnected from us due to ${DisconnectionReason[this.recvDisconnectionReason]}`;
    } else {
      rejectionMsg = `Peer was destroyed`;
    }

    for (const [packetType, entry] of this.responseMap) {
      this.responseMap.delete(packetType);
      entry.reject(new Error(rejectionMsg));
    }

    this.emit('close');
  }

  public revokeConnectionRetries = (): void => {
    this.connectionRetriesRevoked = true;
  }

  public sendPacket = (packet: Packet): void => {
    const data = this.framer.frame(packet, this.outEncryptionKey);
    this.sendRaw(data);

    this.logger.trace(`Sent ${PacketType[packet.type]} packet to ${this.label}: ${JSON.stringify(packet)}`);
    this.packetCount += 1;

    if (packet.direction === PacketDirection.Request) {
      this.addResponseTimeout(packet.header.id, Peer.RESPONSE_TIMEOUT);
    }
  }

  public sendOrders = (orders: OutgoingOrder[], reqId: string): void => {
    const packet = new packets.OrdersPacket(orders, reqId);
    this.sendPacket(packet);
  }

  /** Sends a [[NodesPacket]] containing node connection info to this peer. */
  public sendNodes = (nodes: NodeConnectionInfo[], reqId: string): void => {
    const packet = new packets.NodesPacket(nodes, reqId);
    this.sendPacket(packet);
  }

  /**
   * Manually deactivates a trading pair with this peer.
   */
  public deactivatePair = (pairId: string) => {
    if (!this.nodeState) {
      throw new Error('cannot deactivate a trading pair before handshake is complete');
    }
    const index = this.nodeState.pairs.indexOf(pairId);
    if (index >= 0) {
      this.deactivatedPairs.add(pairId);
      this.emit('pairDropped', pairId);
    }
    // TODO: schedule a timer to see whether this pair can be reactivated
  }

  private sendRaw = (data: Buffer) => {
    if (this.socket) {
      this.socket.write(data);
      this.lastSend = Date.now();
    }
  }

  /**
   * Ensure we are connected (for inbound connections) or listen for the `connect` socket event (for outbound connections)
   * and set the [[connectTime]] timestamp. If an outbound connection attempt errors or times out, throw an error.
   */
  private initConnection = async (retry = false) => {
    if (this.connected) {
      // in case of an inbound peer, we will already be connected
      assert(this.socket);
      assert(this.inbound);
      this.connectTime = Date.now();
      this.logger.debug(this.getStatus());
      return;
    }

    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let retryDelay = Peer.CONNECTION_RETRIES_MIN_DELAY;
      let retries = 0;

      this.socket = net.connect(this.address.port, this.address.host);
      this.inbound = false;
      this.connectionRetriesRevoked = false;

      const cleanup = () => {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = undefined;
        }
        this.socket!.removeListener('error', onError);
        this.socket!.removeListener('connect', onConnect);
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
          `Connection attempt #${retries + 1} to peer (${addressUtils.toString(this.address)}) ` +
          `failed: ${err.message}. retrying in ${retryDelay / 1000} sec...`,
        );

        this.retryConnectionTimer = setTimeout(() => {
          retryDelay = Math.min(Peer.CONNECTION_RETRIES_MAX_DELAY, retryDelay * 2);
          retries = retries + 1;
          this.socket!.connect(this.address);
          bind();
        }, retryDelay);
      };

      const bind = () => {
        this.socket!.once('connect', onConnect);
        this.socket!.once('error', onError);
        this.connectTimeout = setTimeout(() => onError(new Error('Connection timed out')), Peer.CONNECTION_TIMEOUT);
      };

      bind();
    });
  }

  private initStall = (): void => {
    assert(!this.closed);
    assert(!this.stallTimer);

    this.stallTimer = setInterval(this.checkTimeout, Peer.STALL_INTERVAL);
  }

  /**
   * Waits for a packet to be received from peer.
   * @returns A promise that is resolved once the packet is received or rejects on timeout.
   */
  private wait = (packetId: string, timeout?: number, cb?: (packet: Packet) => void): Promise<Packet> => {
    const entry = this.getOrAddPendingResponseEntry(packetId);
    return new Promise((resolve, reject) => {
      entry.addJob(resolve, reject);

      if (cb) {
        entry.addCb(cb);
      }

      if (timeout) {
        entry.setTimeout(timeout);
      }
    });
  }

  private waitSessionInit = async (): Promise<packets.SessionInitPacket> => {
    if (!this.sessionInitPacket) {
      await this.wait(PacketType.SessionInit.toString(), Peer.RESPONSE_TIMEOUT);
    }

    return this.sessionInitPacket!;
  }

  /**
   * Potentially timeout peer if it hasn't responded.
   */
  private checkTimeout = () => {
    const now = ms();

    for (const [packetId, entry] of this.responseMap) {
      if (now > entry.timeout) {
        const request = PacketType[parseInt(packetId, 10)] || packetId;
        const err = errors.RESPONSE_TIMEOUT(request);
        this.emitError(err.message);
        entry.reject(err.message);
        this.close(DisconnectionReason.ResponseStalling, packetId);
        return;
      }
    }
  }

  /**
   * Wait for a packet to be received from peer.
   */
  private addResponseTimeout = (packetId: string, timeout: number): PendingResponseEntry | undefined => {
    if (this.closed) {
      return undefined;
    }

    const entry = this.getOrAddPendingResponseEntry(packetId);
    entry.setTimeout(timeout);

    return entry;
  }

  private getOrAddPendingResponseEntry = (packetId: string): PendingResponseEntry => {
    let entry = this.responseMap.get(packetId);

    if (!entry) {
      entry = new PendingResponseEntry();
      this.responseMap.set(packetId, entry);
    }

    return entry;
  }

  /**
   * Fulfill a pending response entry for solicited responses, penalize unsolicited responses.
   * @returns false if no pending response entry exists for the provided key, otherwise true
   */
  private fulfillResponseEntry = (packet: Packet): boolean => {
    const { reqId } = packet.header;
    if (!reqId) {
      this.logger.debug(`Peer (${this.label}) sent a response packet without reqId`);
      // TODO: penalize
      return false;
    }

    const entry = this.responseMap.get(reqId);

    if (!entry) {
      this.logger.debug(`Peer (${this.label}) sent an unsolicited response packet (${reqId})`);
      // TODO: penalize
      return false;
    }

    this.responseMap.delete(reqId);
    entry.resolve(packet);

    return true;
  }

  /**
   * Binds listeners to a newly connected socket for `error`, `close`, and `data` events.
   */
  private bindSocket = () => {
    assert(this.socket);

    this.socket!.once('error', (err) => {
      this.emitError(err);
      // socket close event will be called immediately after the socket error
    });

    this.socket!.once('close', (hadError) => {
      // emitted once the socket is fully closed
      if (this.nodePubKey === undefined) {
        this.logger.info(`Socket closed prior to handshake (${addressUtils.toString(this.address)})`);
      } else if (hadError) {
        this.logger.warn(`Peer ${this.nodePubKey} socket closed due to error`);
      } else {
        this.logger.info(`Peer ${this.nodePubKey} socket closed`);
      }
      this.close();
    });

    this.socket!.on('data', this.parser.feed);

    this.socket!.setNoDelay(true);
  }

  private bindParser = (parser: Parser): void => {
    parser.on('packet', this.handlePacket);

    parser.on('error', (err: {message: string, code: string}) => {
      if (this.closed) {
        return;
      }

      switch (err.code) {
        case errorCodes.PARSER_INVALID_PACKET:
        case errorCodes.PARSER_UNKNOWN_PACKET_TYPE:
        case errorCodes.PARSER_DATA_INTEGRITY_ERR:
        case errorCodes.PARSER_MAX_BUFFER_SIZE_EXCEEDED:
        case errorCodes.FRAMER_MSG_NOT_ENCRYPTED:
        case errorCodes.FRAMER_INVALID_NETWORK_MAGIC_VALUE:
        case errorCodes.FRAMER_INVALID_MSG_LENGTH:
          this.logger.warn(`Peer (${this.label}): ${err.message}`);
          this.emit('reputation', ReputationEvent.WireProtocolErr);
          this.close(DisconnectionReason.WireProtocolErr, err.message);
          break;
      }
    });
  }

  /** Check if a given packet is solicited and fulfill the pending response entry if it's a response. */
  private isPacketSolicited = (packet: Packet): boolean => {
    let solicited = true;

    if (!this.opened && packet.type !== PacketType.SessionInit && packet.type !== PacketType.SessionAck && packet.type !== PacketType.Disconnecting) {
      // until the connection is opened, we only accept SessionInit/SessionAck packets
      solicited = false;
    }
    if (packet.direction === PacketDirection.Response) {
      // lookup a pending response entry for this packet by its reqId
      if (!this.fulfillResponseEntry(packet)) {
        solicited = false;
      }
    }

    return solicited;
  }

  private handlePacket = (packet: Packet): void => {
    this.lastRecv = Date.now();
    const sender = this.nodePubKey !== undefined ? this.nodePubKey : addressUtils.toString(this.address);
    this.logger.trace(`Received ${PacketType[packet.type]} packet from ${sender}${JSON.stringify(packet)}`);

    if (this.isPacketSolicited(packet)) {
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
          this.handlePing(packet);
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
  }

  private emitError = (err: Error | string): void => {
    if (this.closed) {
      return;
    }

    if (err instanceof Error) {
      this.emit('error', err);
    } else {
      this.emit('error', new Error(err));
    }
  }

  /**
   * Authenticate the identity of the peer through SessionInit packet
   * @param {SessionInitPacket} packet
   * @param {NodeKey} nodeKey
   */
  private authenticate = (packet: packets.SessionInitPacket, nodeKey: NodeKey) => {
    const body = packet.body!;
    const { sign, ...bodyWithoutSign } = body;
    const { nodePubKey } = body.nodeState; // the peer pubkey
    const { peerPubKey } = body; // our pubkey

    // verify that msg was intended for us
    if (peerPubKey !== nodeKey.nodePubKey) {
      this.emit('reputation', ReputationEvent.InvalidAuth);
      this.close(DisconnectionReason.AuthFailureInvalidTarget);
      throw errors.AUTH_FAILURE_INVALID_TARGET(nodePubKey, peerPubKey);
    }

    // verify that the msg was signed by the peer
    const msg = stringify(bodyWithoutSign);
    const msgHash = crypto.createHash('sha256').update(msg).digest();
    const verified = secp256k1.verify(
      msgHash,
      Buffer.from(sign, 'hex'),
      Buffer.from(nodePubKey, 'hex'),
    );

    if (!verified) {
      this.emit('reputation', ReputationEvent.InvalidAuth);
      this.close(DisconnectionReason.AuthFailureInvalidSignature);
      throw errors.AUTH_FAILURE_INVALID_SIGNATURE(nodePubKey);
    }
  }

  private initSession = async (ownNodeState: NodeState, nodeKey: NodeKey, expectedNodePubKey: string): Promise<void> => {
    const ECDH = crypto.createECDH('secp256k1');
    const ephemeralPubKey = ECDH.generateKeys().toString('hex');
    const packet = this.createSessionInitPacket(ephemeralPubKey, ownNodeState, expectedNodePubKey, nodeKey);
    this.sendPacket(packet);
    await this.wait(packet.header.id, Peer.RESPONSE_TIMEOUT, (packet: Packet) => {
      // enabling in-encryption synchronously,
      // expecting the following peer msg to be encrypted
      const sessionAck: packets.SessionAckPacket = packet;
      const key = ECDH.computeSecret(sessionAck.body!.ephemeralPubKey, 'hex');
      this.setInEncryption(key);
    });
  }

  private ackSession = (sessionInit: packets.SessionInitPacket, nodeKey: NodeKey): void => {
    this.authenticate(sessionInit, nodeKey);
    this.nodeState = sessionInit.body!.nodeState;

    const ECDH = crypto.createECDH('secp256k1');
    const ephemeralPubKey = ECDH.generateKeys().toString('hex');

    this.sendPacket(new packets.SessionAckPacket({ ephemeralPubKey }, sessionInit.header.id));

    // enabling out-encryption synchronously,
    // so that the following msg will be encrypted
    const key = ECDH.computeSecret(sessionInit.body!.ephemeralPubKey, 'hex');
    this.setOutEncryption(key);
  }

  private handshake = async (ownNodeState: NodeState, nodeKey: NodeKey) => {
    if (!this.inbound) {
      // outbound handshake
      assert(this.expectedNodePubKey);
      await this.initSession(ownNodeState, nodeKey, this.expectedNodePubKey!);
      const sessionInit = await this.waitSessionInit();
      this.ackSession(sessionInit, nodeKey);
    } else {
      // inbound handshake
      const sessionInit = await this.waitSessionInit();
      this.ackSession(sessionInit, nodeKey);
      await this.initSession(ownNodeState, nodeKey, sessionInit.body!.nodeState.nodePubKey);
    }
  }

  private sendPing = (): packets.PingPacket => {
    const packet = new packets.PingPacket();
    this.sendPacket(packet);
    return packet;
  }

  private sendGetNodes = (): packets.PingPacket => {
    const packet =  new packets.GetNodesPacket();
    this.sendPacket(packet);
    return packet;
  }

  private sendPong = (pingId: string): packets.PongPacket => {
    const packet = new packets.PongPacket(undefined, pingId);
    this.sendPacket(packet);
    return packet;
  }

  private handlePing = (packet: packets.PingPacket): void  => {
    this.sendPong(packet.header.id);
  }

  private createSessionInitPacket = (
    ephemeralPubKey: string,
    ownNodeState: NodeState,
    expectedNodePubKey: string,
    nodeKey: NodeKey,
  ): packets.SessionInitPacket => {
    let body: any = {
      ephemeralPubKey,
      peerPubKey: expectedNodePubKey,
      nodeState: ownNodeState,
    };

    const msg = stringify(body);
    const msgHash = crypto.createHash('sha256').update(msg).digest();
    const { signature } = secp256k1.sign(msgHash, nodeKey.nodePrivKey);

    body = { ...body, sign: signature.toString('hex') };

    return new packets.SessionInitPacket(body);
  }

  private handleDisconnecting = (packet: packets.DisconnectingPacket): void  => {
    if (!this.recvDisconnectionReason && packet.body && packet.body.reason !== undefined) {
      this.logger.debug(`received disconnecting packet from ${this.label}:${JSON.stringify(packet.body)}`);
      this.recvDisconnectionReason = packet.body.reason;
    } else {
      // protocol violation: packet should be sent once only, with body, with `reason` field
      // TODO: penalize peer
    }
  }

  private handleSessionInit = (packet: packets.SessionInitPacket): void => {
    this.sessionInitPacket = packet;

    const entry = this.responseMap.get(PacketType.SessionInit.toString());
    if (entry) {
      this.responseMap.delete(PacketType.SessionInit.toString());
      entry.resolve(packet);
    }
  }

  private handleNodeStateUpdate = (packet: packets.NodeStateUpdatePacket): void => {
    const nodeStateUpdate = packet.body!;
    this.logger.verbose(`received node state update packet from ${this.label}: ${JSON.stringify(nodeStateUpdate)}`);

    const prevNodeState = this.nodeState;
    if (prevNodeState) {
      prevNodeState.pairs.forEach((pairId) => {
        if (!nodeStateUpdate.pairs || !nodeStateUpdate.pairs.includes(pairId)) {
          // a trading pair was in the old node state but not in the updated one
          this.emit('pairDropped', pairId);
        }
      });
    }

    this.nodeState = { ...prevNodeState, ...nodeStateUpdate as NodeState };
    this.emit('nodeStateUpdate');
  }

  private setOutEncryption = (key: Buffer) => {
    this.outEncryptionKey = key;
    this.logger.debug(`Peer (${this.label}) session out-encryption enabled`);
  }

  private setInEncryption = (key: Buffer) => {
    this.parser.setEncryptionKey(key);
    this.logger.debug(`Peer (${this.label}) session in-encryption enabled`);
  }
}

/** A class representing a wait for an anticipated response packet from a peer. */
class PendingResponseEntry {
  public timeout = 0;
  /** An array of tasks to resolve or reject. */
  public jobs: Job[] = [];
  /** An array of callbacks to be called synchronously when entry resolve. */
  public callbacks: Function[] = [];

  public addJob = (resolve: Function, reject: Function) => {
    this.jobs.push(new Job(resolve, reject));
  }

  public addCb = (cb: Function) => {
    this.callbacks.push(cb);
  }

  public setTimeout = (timeout: number): void => {
    this.timeout = ms() + timeout;
  }

  public resolve = (result: any) => {
    for (const job of this.jobs) {
      job.resolve(result);
    }

    for (const cb of this.callbacks) {
      cb(result);
    }

    this.jobs.length = 0;
    this.callbacks.length = 0;
  }

  public reject = (err: any) => {
    for (const job of this.jobs) {
      job.reject(err);
    }

    this.jobs.length = 0;
  }
}

/** A pair of functions for resolving or rejecting a task. */
class Job {
  constructor(public resolve: Function, public reject: Function) {}
}

export default Peer;
export { PeerInfo };
