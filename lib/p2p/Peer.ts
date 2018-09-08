import assert from 'assert';
import net, { Socket } from 'net';
import { EventEmitter } from 'events';
import Parser, { ParserError, ParserErrorType } from './Parser';
import * as packets from './packets/types';
import Logger from '../Logger';
import { ms } from '../utils/utils';
import { OutgoingOrder } from '../types/orders';
import { Packet, PacketDirection, PacketType } from './packets';
import { HandshakeState, Address, NodeConnectionInfo } from '../types/p2p';
import errors from './errors';
import addressUtils from '../utils/addressUtils';

/** Key info about a peer for display purposes */
type PeerInfo = {
  address: string,
  nodePubKey?: string,
  inbound: boolean,
  pairs?: string[],
  xudVersion?: string,
  secondsConnected: number,
};

interface Peer {
  on(event: 'packet', listener: (packet: Packet) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'packet', listener: (packet: Packet) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  once(event: 'open', listener: () => void): this;
  once(event: 'close', listener: () => void): this;
  once(event: 'ban', listener: () => void): this;
  emit(event: 'connect'): boolean;
  emit(event: 'ban'): boolean;
  emit(event: 'open'): boolean;
  emit(event: 'close'): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'packet', packet: Packet): boolean;
}

/** Represents a remote XU peer */
class Peer extends EventEmitter {
  // TODO: properties documentation
  public inbound!: boolean;
  public connected = false;
  private opened = false;
  private socket?: Socket;
  private parser: Parser = new Parser(Packet.PROTOCOL_DELIMITER);
  private closed = false;
  private connectTimeout?: NodeJS.Timer;
  private stallTimer?: NodeJS.Timer;
  private pingTimer?: NodeJS.Timer;
  private responseMap: Map<string, PendingResponseEntry> = new Map();
  private connectTime!: number;
  private banScore = 0;
  private lastRecv = 0;
  private lastSend = 0;
  private handshakeState?: HandshakeState;
  /** A counter for packets sent to be used for assigning unique packet ids. */
  private packetCount = 0;
  /** Interval to check required responses from peer. */
  private static STALL_INTERVAL = 5000;
  /** Interval for pinging peers. */
  private static PING_INTERVAL = 30000;
  /** Response timeout for response packets. */
  private static RESPONSE_TIMEOUT = 10000;
  /** Socket connection timeout for outbound peers. */
  private static CONNECTION_TIMEOUT = 10000;
  /** Connection retries min delay. */
  private static CONNECTION_RETRIES_MIN_DELAY = 5000;
  /** Connection retries max delay. */
  private static CONNECTION_RETRIES_MAX_DELAY = 3600000;
  /** Connection retries max period. */
  private static CONNECTION_RETRIES_MAX_PERIOD = 604800000;

  public get nodePubKey(): string | undefined {
    return this.handshakeState ? this.handshakeState.nodePubKey : undefined;
  }

  public get addresses(): Address[] | undefined {
    return this.handshakeState ? this.handshakeState.addresses : undefined;
  }

  public get info(): PeerInfo {
    return {
      address: addressUtils.toString(this.address),
      nodePubKey: this.handshakeState ? this.handshakeState.nodePubKey : undefined,
      inbound: this.inbound,
      pairs: this.handshakeState ? this.handshakeState.pairs : undefined,
      xudVersion: this.handshakeState ? this.handshakeState.version : undefined,
      secondsConnected: Math.round((Date.now() - this.connectTime) / 1000),
    };
  }

  constructor(private logger: Logger, public address: Address) {
    super();

    this.bindParser(this.parser);
  }

  /**
   * Creates a Peer from an inbound socket connection.
   */
  public static fromInbound = (socket: Socket, logger: Logger): Peer => {
    const peer = new Peer(logger, addressUtils.fromSocket(socket));

    peer.inbound = true;
    peer.connected = true;

    peer.bindSocket(socket);

    return peer;
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
  public open = async (handshakeData: HandshakeState, nodePubKey?: string, retryConnecting?: boolean): Promise<void> => {
    assert(!this.opened);
    assert(!this.closed);
    assert(this.inbound || nodePubKey);
    assert(!retryConnecting || !this.inbound);

    this.opened = true;

    await this.initConnection(retryConnecting);
    this.initStall();
    await this.initHello(handshakeData);

    // TODO: Check that the peer's version is compatible with ours
    if (nodePubKey) {
      if (this.nodePubKey !== nodePubKey) {
        this.close();
        throw errors.UNEXPECTED_NODE_PUB_KEY(this.nodePubKey!, nodePubKey, addressUtils.toString(this.address));
      } else if (this.nodePubKey === handshakeData.nodePubKey) {
        this.close();
        throw errors.ATTEMPTED_CONNECTION_TO_SELF;
      }
    }

    this.finalizeOpen();

    // let the pool know that this peer is ready to go
    this.emit('open');
  }

  /**
   * Close a peer by ensuring the socket is destroyed and terminating all timers.
   */
  public close = (): void => {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.connected = false;

    if (this.socket) {
      if (!this.socket.destroyed) {
        this.socket.destroy();
      }
      delete this.socket;
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

    for (const [packetType, entry] of this.responseMap) {
      this.responseMap.delete(packetType);
      entry.reject(new Error('Peer was destroyed'));
    }

    this.emit('close');
  }

  public sendPacket = (packet: Packet): void => {
    this.sendRaw(packet.toRaw());
    this.packetCount += 1;

    if (packet.direction === PacketDirection.REQUEST) {
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

  private sendRaw = (packetStr: string) => {
    if (this.socket) {
      this.socket.write(packetStr + Packet.PROTOCOL_DELIMITER);
      this.lastSend = Date.now();
    }
  }

  private increaseBan = (score: number): boolean => {
    this.banScore += score;

    if (this.banScore >= 100) { // TODO: make configurable
      this.logger.debug(`Ban threshold exceeded (${this.nodePubKey})`);
      this.emit('ban');
      return true;
    }

    return false;
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

      const socket = net.connect(this.address.port, this.address.host);
      this.inbound = false;

      const cleanup = () => {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = undefined;
        }
        socket.removeListener('error', onError);
        socket.removeListener('connect', onConnect);
      };

      const onConnect = () => {
        this.connectTime = Date.now();
        this.connected = true;

        this.bindSocket(socket);

        this.logger.debug(this.getStatus());
        this.emit('connect');

        cleanup();
        resolve();
      };

      const onError = (err: Error) => {
        cleanup();

        if (!retry) {
          this.close();
          reject(err);
          return;
        }

        if (Date.now() - startTime + retryDelay > Peer.CONNECTION_RETRIES_MAX_PERIOD) {
          this.close();
          reject(errors.CONNECTING_RETRIES_MAX_PERIOD_EXCEEDED);
          return;
        }

        this.logger.debug(
          `Connection attempt #${retries + 1} to peer (${addressUtils.toString(this.address)}) ` +
          `failed: ${err.message}. retrying in ${retryDelay / 1000} sec...`,
        );

        setTimeout(() => {
          retryDelay = Math.min(Peer.CONNECTION_RETRIES_MAX_DELAY, retryDelay * 2);
          retries = retries + 1;
          socket.connect(this.address);
          bind();
        }, retryDelay);
      };

      const bind = () => {
        socket.once('connect', onConnect);
        socket.once('error', onError);
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

  private initHello = async (handshakeData: HandshakeState) => {
    const packet = this.sendHello(handshakeData);

    if (!this.handshakeState) {
      // wait for an incoming HelloPacket
      await this.wait(PacketType.HELLO, Peer.RESPONSE_TIMEOUT);
    }
  }

  private finalizeOpen = (): void => {
    assert(!this.closed);

    // Setup the ping interval
    this.pingTimer = setInterval(this.sendPing, Peer.PING_INTERVAL);
  }

  /**
   * Wait for a packet to be received from peer. Executed on timeout or once packet is received.
   */
  private wait = (packetId: string, timeout?: number) => {
    const entry = this.getOrAddPendingResponseEntry(packetId);
    return new Promise((resolve, reject) => {
      entry.addJob(resolve, reject);

      if (timeout) {
        entry.setTimeout(timeout);
      }
    });
  }

  /**
   * Potentially timeout peer if it hasn't responded.
   */
  private checkTimeout = () => {
    const now = ms();

    for (const [packetType, entry] of this.responseMap) {
      if (now > entry.timeout) {
        this.error(`Peer (${this.nodePubKey}) is stalling (${packetType})`);
        this.close();
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
      this.logger.debug(`Peer (${this.nodePubKey}) sent a response packet without reqId`);
      // TODO: penalize
      return false;
    }

    const entry = this.responseMap.get(reqId);

    if (!entry) {
      this.logger.debug(`Peer (${this.nodePubKey}) sent an unsolicited response packet (${reqId})`);
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
  private bindSocket = (socket: Socket) => {
    assert(!this.socket);

    this.socket = socket;

    this.socket.once('error', (err) => {
      this.error(err);
      // socket close event will be called immediately after the socket error
    });

    this.socket.once('close', (hadError) => {
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

    this.socket.on('data', (data) => {
      this.lastRecv = Date.now();
      const dataStr = data.toString();
      if (this.nodePubKey !== undefined) {
        this.logger.trace(`Received data (${this.nodePubKey}): ${dataStr}`);
      } else {
        this.logger.trace(`Received data (${addressUtils.toString(this.address)}): ${data.toString()}`);
      }
      this.parser.feed(dataStr);
    });

    this.socket.setNoDelay(true);
  }

  private bindParser = (parser: Parser): void => {
    parser.on('packet', this.handlePacket);

    parser.on('error', (err: ParserError) => {
      if (this.closed) {
        return;
      }

      switch (err.type) {
        case ParserErrorType.UNPARSEABLE_MESSAGE:
          this.logger.warn(`Unparsable peer message: ${err.payload}`);
          this.increaseBan(10);
          break;
        case ParserErrorType.INVALID_MESSAGE:
          this.logger.warn(`Invalid peer message: ${err.payload}`);
          this.increaseBan(10);
          break;
        case ParserErrorType.UNKNOWN_PACKET_TYPE:
          this.logger.warn(`Unknown peer message type: ${err.payload}`);
          this.increaseBan(20);
      }
    });
  }

  /** Check if a given packet is solicited and fulfill the pending response entry if it's a response. */
  private isPacketSolicited = (packet: Packet): boolean => {
    let solicted = true;

    if (packet.direction === PacketDirection.RESPONSE) {
      // lookup a pending response entry for this packet by its reqId
      if (!this.fulfillResponseEntry(packet)) {
        solicted = false;
      }
    }

    return solicted;
  }

  private handlePacket = (packet: Packet): void => {
    if (this.isPacketSolicited(packet)) {
      switch (packet.type) {
        case PacketType.HELLO: {
          this.handleHello(packet);
          break;
        }
        case PacketType.PING: {
          this.handlePing(packet);
          break;
        }
        default:
          this.emit('packet', packet);
          break;
      }
    }
  }

  private error = (err: Error | string): void => {
    if (this.closed) {
      return;
    }

    if (err instanceof Error) {
      this.emit('error', err);
    } else {
      this.emit('error', new Error(err));
    }
  }

  private sendHello = (handshakeData: HandshakeState): packets.HelloPacket => {
    // TODO: use real values
    const packet = new packets.HelloPacket(handshakeData);

    this.sendPacket(packet);

    return packet;
  }

  private handleHello = (packet: packets.HelloPacket): void => {
    const entry = this.responseMap.get(PacketType.HELLO);

    if (!entry) {
      this.logger.debug(`Peer (${this.nodePubKey}) sent an unsolicited Hello packet`);
      // TODO: penalize
    } else {
      this.responseMap.delete(PacketType.HELLO);
      entry.resolve(packet);

      this.handshakeState = packet.body;
    }
  }

  private sendPing = (): packets.PingPacket => {
    const packet = new packets.PingPacket();

    this.sendPacket(packet);

    return packet;
  }

  private handlePing = (packet: packets.PingPacket): void  => {
    this.sendPong(packet.header.id);
  }

  private sendPong = (pingId: string): packets.PongPacket => {
    const packet = new packets.PongPacket(undefined, pingId);

    this.sendPacket(packet);

    return packet;
  }
}

/** A class representing a wait for an anticipated response packet from a peer. */
class PendingResponseEntry {
  public timeout = 0;
  /** An array of tasks to resolve or reject. */
  public jobs: Job[] = [];

  public addJob = (resolve: Function, reject: Function) => {
    this.jobs.push(new Job(resolve, reject));
  }

  public setTimeout = (timeout: number): void => {
    this.timeout = ms() + timeout;
  }

  public resolve = (result: any) => {
    for (const job of this.jobs) {
      job.resolve(result);
    }

    this.jobs.length = 0;
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
export { HandshakeState, PeerInfo };
