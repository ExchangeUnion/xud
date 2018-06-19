import assert from 'assert';
import net, { Socket } from 'net';
import { EventEmitter } from 'events';
import uuidv1 from 'uuid/v1';
import Host from './Host';
import SocketAddress from './SocketAddress';
import Parser, { ParserError, ParserErrorType } from './Parser';
import { Packet, PacketType, HelloPacket, PingPacket, PongPacket } from './packets';
import Logger from '../Logger';
import { ms } from '../utils/utils';

const pubKey = `tempPK_${Math.floor(1000 + (Math.random() * 9000))}`;

enum ConnectionDirection {
  INBOUND,
  OUTBOUND,
}

type HandshakeState = {
  version?: string;
  nodeKey?: string;
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

  // TODO: properties documentation

  public socketAddress!: SocketAddress;
  public direction!: ConnectionDirection;
  private host?: Host;
  private logger: Logger = Logger.p2p;
  private connected: boolean = false;
  private opened: boolean = false;
  private socket!: Socket;
  private parser: Parser = new Parser();
  private destroyed: boolean = false;
  private connectTimeout: NodeJS.Timer | null = null;
  private stallTimer: NodeJS.Timer | null = null;
  private pingTimer: NodeJS.Timer | null = null;
  private lastPingId: string | null = null;
  private responseMap: Map<PacketType, ResponseEntry> = new Map();
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

    if (packet.responseType && packet.responseTimeout) {
      this.addReponseTimeout(packet.responseType, packet.responseTimeout);
    }
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

    this.stallTimer = setInterval(this.maybeTimeout, Peer.STALL_INTERVAL);
  }

  private initHello = async () => {
    const packet = this.sendHello();

    if (!this.handshakeState) {
      await this.wait(packet.responseType);
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
  private wait = (packetType: PacketType) => {
    return new Promise((resolve, reject) => {
      const entry = this.getOrAddResponseEntry(packetType);
      entry.addJob(resolve, reject);
    });
  }

  /**
   * Potentially timeout peer if it hasn't responded.
   */
  private maybeTimeout = () => {
    const now = ms();

    for (const [packetType, entry] of this.responseMap) {
      if (now > entry.timeout) {
        this.error(`Peer is stalling (${packetType})`);
        this.destroy();
        return;
      }
    }
  }

  /**
   * Wait for a packet to be received from peer.
   */
  private addReponseTimeout = (packetType: PacketType, timeout: number): ResponseEntry | null => {
    if (this.destroyed) {
      return null;
    }

    const entry = this.getOrAddResponseEntry(packetType);
    entry.setTimeout(timeout);

    return entry;
  }

  private getOrAddResponseEntry = (packetType: PacketType): ResponseEntry => {
    let entry = this.responseMap.get(packetType);

    if (!entry) {
      entry = new ResponseEntry();
      this.responseMap.set(packetType, entry);
    }

    return entry;
  }

  /**
   * Fulfill awaiting requests response.
   */
  private fulfillReponse = (packetType: PacketType): ResponseEntry | null => {
    const entry = this.responseMap.get(packetType);

    if (!entry) {
      return null;
    }

    this.responseMap.delete(packetType);

    return entry;
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
        case ParserErrorType.UNPARSABLE_MESSAGE: {
          this.logger.warn(`Unparsable peer message: ${err.payload}`);
          this.increaseBan(10);
          break;
        }
        case ParserErrorType.UNKNOWN_PACKET_TYPE: {
          this.logger.warn(`Unknown peer message type: ${err.payload}`);
          this.increaseBan(20);
        }
      }
    });
  }

  private handlePacket = (packet: Packet): void => {
    let status: Boolean = false;

    switch (packet.type) {
      case PacketType.HELLO: {
        this.handleHello(<HelloPacket>packet);
        status = true;
        break;
      }
      case PacketType.PING: {
        this.handlePing(<PingPacket>packet);
        status = true;
        break;
      }
      case PacketType.PONG:
        status = this.handlePong(<PongPacket>packet);
        break;
    }

    if (status) {
      const entry = this.fulfillReponse(packet.type);
      if (entry) {
        entry.resolve(packet);
      }
    }

    this.emit('packet', packet);
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
      nodeKey: '123',
      listenPort: 20000,
      pairs: ['BTC/LTC'],
    });

    this.sendPacket(packet);

    return packet;
  }

  private handleHello = (packet: HelloPacket): void => {
    this.handshakeState = { ...this.handshakeState, ...packet.body };

    // TODO: define XUD_MIN_VERSION, throw exception if version below
  }

  private sendPing = (): PingPacket => {
    this.lastPingId = uuidv1();
    const packet = new PingPacket({ id: this.lastPingId! });

    this.sendPacket(packet);

    return packet;
  }

  private handlePing = (packet: PingPacket): void  => {
    const { id } = packet.body;

    if (!id) {
      return;
    }

    this.sendPong(id + 1);
  }

  private sendPong = (id: string): PongPacket => {
    const packet = new PongPacket({ id });

    this.sendPacket(packet);

    return packet;
  }

  private handlePong = (packet: PongPacket): boolean => {
    const { id } = packet.body;
    if (!this.lastPingId) {
      this.logger.debug(`Peer sent an unsolicited pong (${this.id})`);
      return false;
    }

    if (id !== this.lastPingId) {
      this.logger.debug(`Peer sent an invalid pong id (${this.id})`);
      return false;
    }

    this.lastPingId = null;
    return true;
  }
}

class ResponseEntry {
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
