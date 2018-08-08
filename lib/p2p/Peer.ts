import assert from 'assert';
import net, { Socket } from 'net';
import { EventEmitter } from 'events';
import Host from './Host';
import SocketAddress from './SocketAddress';
import Parser, { ParserError, ParserErrorType } from './Parser';
import * as packets from './packets/types';
import Logger from '../Logger';
import { ms } from '../utils/utils';
import { OutgoingOrder } from '../types/orders';
import { Packet, PacketDirection, PacketType } from './packets';
import { HostFactory } from '../types/db';

enum ConnectionDirection {
  INBOUND,
  OUTBOUND,
}

type HandshakeState = {
  version: string;
  nodePubKey: string;
  listenPort: number;
  pairs: string[];
};

function isHandshakeState(obj: any): obj is HandshakeState {
  return obj && typeof obj.version === 'string' && typeof obj.nodePubKey === 'string' && typeof obj.listenPort === 'number'
    && Array.isArray(obj.pairs);
}

interface Peer {
  on(event: 'packet', listener: (packet: Packet) => void);
  on(event: 'error', listener: (err: Error) => void);
  on(event: 'packet', listener: (packet: Packet) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  once(event: 'open', listener: (handshakeState: HandshakeState) => void);
  once(event: 'close', listener: () => void);
  once(event: 'ban', listener: () => void);
  emit(event: 'connect');
  emit(event: 'ban');
  emit(event: 'open', handshakeState: HandshakeState);
  emit(event: 'close');
  emit(event: 'error', err: Error);
  emit(event: 'packet', packet: Packet);
}

/** Represents a remote XU peer */
class Peer extends EventEmitter {

  /**
   * Interval to check required responses from peer.
   */
  private static STALL_INTERVAL: number = 5000;

  /**
   * Interval for pinging peers.
   */
  private static PING_INTERVAL = 30000;

  /**
   * Response timeout for response packets.
   */
  private static RESPONSE_TIMEOUT = 10000;

  // TODO: properties documentation

  public socketAddress!: SocketAddress;
  public direction!: ConnectionDirection;
  public connected: boolean = false;
  private host?: Host;
  private logger: Logger = Logger.p2p;
  private opened: boolean = false;
  private socket?: Socket;
  private parser: Parser = new Parser();
  private closed: boolean = false;
  private connectTimeout?: NodeJS.Timer;
  private stallTimer?: NodeJS.Timer;
  private pingTimer?: NodeJS.Timer;
  private responseMap: Map<string, PendingResponseEntry> = new Map();
  private connectTime: number = 0;
  private banScore: number = 0;
  private lastRecv: number = 0;
  private lastSend: number = 0;
  private handshakeState?: HandshakeState;
  /** A counter for packets sent to be used for assigning unique packet ids. */
  private packetCount = 0;

  public get id(): string {
    assert(this.socketAddress);
    return this.socketAddress.toString();
  }

  public get hostId(): number | null {
    if (this.host) {
      return this.host.id;
    } else {
      return null;
    }
  }

  public get nodePubKey(): string | undefined {
    if (this.handshakeState) {
      return this.handshakeState.nodePubKey;
    } else {
      return undefined;
    }
  }

  constructor() {
    super();

    this.bindParser(this.parser);
  }

  public static fromOutbound(socketAddress: SocketAddress): Peer {
    const peer = new Peer();
    peer.connect(socketAddress);
    return peer;
  }

  public static fromInbound(socket: Socket): Peer {
    const peer = new Peer();
    peer.accept(socket);
    return peer;
  }

  public getStatus = (): string => {
    if (this.connected) {
      return `Connected to peer (${this.id})`;
    } else {
      return 'Not connected';
    }
  }

  public open = async (): Promise<void> => {
    assert(!this.opened);
    this.opened = true;

    await this.initConnection();
    this.initStall();
    await this.initHello();
    this.finalizeOpen();

    // let the pool know that this peer is ready to go
    this.emit('open', this.handshakeState!);
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

  public setHost = (host: Host): void => {
    this.host = host;
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

  public sendHosts = (hosts: HostFactory[], reqId: string): void => {
    const packet = new packets.HostsPacket(hosts, reqId);
    this.sendPacket(packet);
  }

  private sendRaw = (packetStr: string) => {
    if (this.socket) {
      this.socket.write(`${packetStr}\r\n`);

      this.lastSend = Date.now();
    }
  }

  private increaseBan = (score): boolean => {
    this.banScore += score;

    if (this.banScore >= 100) { // TODO: make configurable
      this.logger.debug(`Ban threshold exceeded (${this.id})`);
      this.emit('ban');
      return true;
    }

    return false;
  }

  private initConnection = (): Promise<void> => {
    assert(this.socket);

    if (this.connected) {
      assert(this.direction === ConnectionDirection.INBOUND);
      this.logger.debug(this.getStatus());
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = undefined;
        }
        if (this.socket) {
          this.socket.removeListener('error', onError);
        }
      };

      const onError = (err) => {
        cleanup();
        this.close();
        reject(err);
      };

      this.socket!.once('connect', () => {
        this.connectTime = Date.now();
        this.connected = true;
        this.logger.debug(this.getStatus());
        this.emit('connect');

        cleanup();
        resolve();
      });

      this.socket!.once('error', onError);

      this.connectTimeout = setTimeout(() => {
        this.connectTimeout = undefined;
        cleanup();
        this.close();
        reject(new Error('Connection timed out.'));
      }, 10000);
    });
  }

  private initStall = (): void => {
    assert(!this.closed);
    assert(!this.stallTimer);

    this.stallTimer = setInterval(this.checkTimeout, Peer.STALL_INTERVAL);
  }

  private initHello = async () => {
    const packet = this.sendHello();

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
        this.error(`Peer (${this.id}) is stalling (${packetType})`);
        this.close();
        return;
      }
    }
  }

  /**
   * Wait for a packet to be received from peer.
   */
  private addResponseTimeout = (packetId: string, timeout: number): PendingResponseEntry | null => {
    if (this.closed) {
      return null;
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
      this.logger.debug(`Peer (${this.id}) sent a response packet without reqId`);
      // TODO: penalize
      return false;
    }

    const entry = this.responseMap.get(reqId);

    if (!entry) {
      this.logger.debug(`Peer (${this.id}) sent an unsolicited response packet (${reqId})`);
      // TODO: penalize
      return false;
    }

    this.responseMap.delete(reqId);
    entry.resolve(packet);

    return true;
  }

  private connect = (socketAddress: SocketAddress): void => {
    assert(!this.socket);

    const socket = net.connect(socketAddress.port, socketAddress.address);

    this.socketAddress = socketAddress;
    this.direction = ConnectionDirection.OUTBOUND;
    this.connected = false;

    this.bindSocket(socket);
  }

  private accept = (socket: Socket): void => {
    assert(!this.socket);

    this.socketAddress = SocketAddress.fromSocket(socket);
    this.direction = ConnectionDirection.INBOUND;
    this.connected = true;

    this.bindSocket(socket);
  }

  private bindSocket = (socket: Socket) => {
    assert(!this.socket);

    this.socket = socket;

    this.socket.once('error', (err) => {
      if (!this.connected) {
        return;
      }

      this.error(err);
      // socket close event will be called immediately after the socket error
    });

    this.socket.once('close', (hadError) => {
      // emitted once the socket is fully closed
      if (hadError) {
        this.logger.warn(`Socket closed due to error (${this.id})`);
      } else {
        this.logger.info(`Socket closed (${this.id})`);
      }
      this.close();
    });

    this.socket.on('data', (data) => {
      this.lastRecv = Date.now();
      this.logger.debug(`Received data (${this.id}): ${data.toString()}`);
      this.parser.feed(data);
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

    this.logger.error(`Socket Error (${this.id}): ${err.toString()}`);
    if (err instanceof Error) {
      this.emit('error', err);
    } else {
      this.emit('error', new Error(`Socket Error (${this.id}): ${err}`));
    }
  }

  private sendHello = (): packets.HelloPacket => {
    // TODO: use real values
    const packet = new packets.HelloPacket({
      version: '123',
      nodePubKey: '123',
      listenPort: 20000,
      pairs: ['BTC/LTC'],
    });

    this.sendPacket(packet);

    return packet;
  }

  private handleHello = (packet: packets.HelloPacket): void => {
    const entry = this.responseMap.get(PacketType.HELLO);

    if (!entry) {
      this.logger.debug(`Peer (${this.id}) sent an unsolicited Hello packet`);
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

class PendingResponseEntry {
  public timeout: number = 0;
  public jobs: Job[] = [];

  public addJob = (resolve, reject) => {
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

class Job {
  constructor(public resolve, public reject) {}
}

export default Peer;
export { ConnectionDirection, HandshakeState };
