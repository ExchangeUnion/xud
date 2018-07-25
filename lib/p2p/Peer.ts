import assert from 'assert';
import net, { Socket } from 'net';
import { EventEmitter } from 'events';
import Host from './Host';
import SocketAddress from './SocketAddress';
import Parser, { ParserError, ParserErrorType } from './Parser';
import { Packet, PacketDirection, PacketType, HelloPacket, PingPacket, PongPacket, HostsPacket, OrdersPacket } from './packets';
import Logger from '../Logger';
import { ms } from '../utils/utils';
import { orders } from '../types';

enum ConnectionDirection {
  INBOUND,
  OUTBOUND,
}

type HandshakeState = {
  version?: string;
  nodePubKey?: string;
  listenPort?: number;
  pairs?: string[];
};

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
  private socket!: Socket;
  private parser: Parser = new Parser();
  private destroyed: boolean = false;
  private connectTimeout: NodeJS.Timer | null = null;
  private stallTimer: NodeJS.Timer | null = null;
  private pingTimer: NodeJS.Timer | null = null;
  private responseMap: Map<string, PendingResponseEntry> = new Map();
  private connectTime: number = 0;
  private banScore: number = 0;
  private lastRecv: number = 0;
  private lastSend: number = 0;
  private handshakeState: HandshakeState = {};

  get id(): string {
    assert(this.socketAddress);
    return this.socketAddress.toString();
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

    const handshakeState: HandshakeState = {};

    // let the pool know that this peer is ready to go
    this.emit('open', handshakeState);
  }

  public destroy = (): void => {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.connected = false;

    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
    }

    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }

    if (this.stallTimer) {
      clearInterval(this.stallTimer);
      this.stallTimer = null;
    }

    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout);
      this.connectTimeout = null;
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
    this.sendRaw(packet.type, packet.toRaw());

    if (packet.direction === PacketDirection.REQUEST) {
      this.addResponseTimeout(packet.header.hash, Peer.RESPONSE_TIMEOUT);
    }
  }

  public sendOrders = (orders: orders.OutgoingOrder[]): void => {
    const packet = new OrdersPacket({ orders });

    this.sendPacket(packet);
  }

  public sendHosts = (hosts: Host[], reqHash: string): void => {
    const packet = new HostsPacket({ hosts }, reqHash);
    this.sendPacket(packet);
  }

  private sendRaw = (type, body) => {
    const payload = `${type} ${body}\r\n`;
    this.socket.write(payload);

    this.lastSend = Date.now();
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
          this.connectTimeout = null;
        }
        this.socket.removeListener('error', onError);
      };

      const onError = (err) => {
        cleanup();
        this.destroy();
        reject(err);
      };

      this.socket.once('connect', () => {
        this.connectTime = Date.now();
        this.connected = true;
        this.logger.debug(this.getStatus());
        this.emit('connect');

        cleanup();
        resolve();
      });

      this.socket.once('error', onError);

      this.connectTimeout = setTimeout(() => {
        this.connectTimeout = null;
        cleanup();
        this.destroy();
        reject(new Error('Connection timed out.'));
      }, 10000);
    });
  }

  private initStall = (): void => {
    assert(!this.destroyed);
    assert(!this.stallTimer);

    this.stallTimer = setInterval(this.checkTimeout, Peer.STALL_INTERVAL);
  }

  private initHello = async () => {
    const packet = this.sendHello();

    if (!this.handshakeState) {
      // using the packet type as the response key,
      // to allow waiting for any incoming HelloPacket
      await this.wait(packet.type, Peer.RESPONSE_TIMEOUT);
      assert(this.handshakeState);
    }
  }

  private finalizeOpen = (): void => {
    assert(!this.destroyed);

    // Setup the ping interval
    this.pingTimer = setInterval(this.sendPing, Peer.PING_INTERVAL);
  }

  /**
   * Wait for a packet to be received from peer. Executed on timeout or once packet is received.
   */
  private wait = (key: string, timeout?: number) => {
    return new Promise((resolve, reject) => {
      const entry = this.getOrAddPendingResponseEntry(key);
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
        this.destroy();
        return;
      }
    }
  }

  /**
   * Wait for a packet to be received from peer.
   */
  private addResponseTimeout = (hash: string, timeout: number): PendingResponseEntry | null => {
    if (this.destroyed) {
      return null;
    }

    const entry = this.getOrAddPendingResponseEntry(hash);
    entry.setTimeout(timeout);

    return entry;
  }

  private  getOrAddPendingResponseEntry = (key: string): PendingResponseEntry => {
    let entry = this.responseMap.get(key);

    if (!entry) {
      entry = new PendingResponseEntry();
      this.responseMap.set(key, entry);
    }

    return entry;
  }

  /**
   * Fulfill a pending response entry.
   * @returns false if no pending response entry exists for the provided key, otherwise true
   */
  private fulfillResponseEntry = (key: string | undefined, packet: Packet): boolean => {
    if (!key) {
      this.logger.debug(`Peer (${this.id}) sent an unsolicited response packet (${packet.type})`);
      // TODO: penalize
      return false;
    }

    const entry = this.responseMap.get(key);

    if (!entry) {
      this.logger.debug(`Peer (${this.id}) sent an unmatched response packet (${packet.type})`);
      // TODO: penalize
      return false;
    }

    this.responseMap.delete(key);
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
      this.destroy();
    });

    this.socket.once('close', () => {
      this.error('Socket hangup');
      this.destroy();
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
      if (this.destroyed) {
        return;
      }

      switch (err.type) {
        case ParserErrorType.UNPARSABLE_MESSAGE:
          this.logger.warn(`Unparsable peer message: ${err.payload}`);
          this.increaseBan(10);
          break;
        case ParserErrorType.UNKNOWN_PACKET_TYPE:
          this.logger.warn(`Unknown peer message type: ${err.payload}`);
          this.increaseBan(20);
      }
    });
  }

  private handlePacket = (packet: Packet): void => {
    if (packet.direction === PacketDirection.RESPONSE) {
      if (!this.fulfillResponseEntry(packet.header.reqHash, packet)) {
        return;
      }
    }

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

  private error = (err): void => {
    if (this.destroyed) {
      return;
    }

    // TODO: construct a proper error object
    const msg = `Socket Error (${this.id}): ${JSON.stringify(err)}`;
    this.logger.debug(msg);

    this.emit('error', { msg, err });
  }

  private sendHello = (): HelloPacket => {
    // TODO: use real values
    const packet = new HelloPacket({
      version: '123',
      nodePubKey: '123',
      listenPort: 20000,
      pairs: ['BTC/LTC'],
    });

    this.sendPacket(packet);

    return packet;
  }

  private handleHello = (packet: HelloPacket): void => {
    this.handshakeState = { ...this.handshakeState, ...packet.body };

    if (this.responseMap.has(packet.type)) {
      this.fulfillResponseEntry(packet.type, packet);
    }
  }

  private sendPing = (): PingPacket => {
    const packet = new PingPacket({ ts: ms() });

    this.sendPacket(packet);

    return packet;
  }

  private handlePing = (packet: PingPacket): void  => {
    const { hash } = packet.header;

    if (!hash) {
      return;
    }

    this.sendPong(hash);
  }

  private sendPong = (pingHash: string): PongPacket => {
    const packet = new PongPacket({ ts: ms() }, pingHash);

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
