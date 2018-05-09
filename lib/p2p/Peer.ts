import assert from 'assert';
import net, { Socket } from 'net';
import { EventEmitter } from 'events';
import SocketAddress from './SocketAddress';
import Parser, { ParserError, ParserErrorType } from './Parser';
import Logger from '../Logger';

const pubKey = `tempPK_${Math.floor(1000 + (Math.random() * 9000))}`;

enum ConnectionDirection {
  INBOUND,
  OUTBOUND,
}

/** Represents a remote XU peer */
class Peer extends EventEmitter {
  public address!: SocketAddress;
  private logger: Logger = Logger.global;
  private connected: boolean = false;
  private opened: boolean = false;
  private direction?: ConnectionDirection;
  private socket!: Socket;
  private parser: Parser = new Parser();
  private destroyed: boolean = false;
  private connectTimeout?: NodeJS.Timer;
  private connectTime: number = 0;
  private banScore: number = 0;
  private lastRecv: number = 0;
  private lastSend: number = 0;

  get id(): string {
    assert(this.address);
    return this.address.toString();
  }

  get statusString(): string {
    if (this.connected) {
      return `Connected to peer (${this.id})`;
    } else {
      return 'Not connected';
    }
  }

  constructor() {
    super();

    this.bindParser(this.parser);
  }

  static fromOutbound(address: SocketAddress): Peer {
    const peer = new Peer();
    peer.connect(address);
    return peer;
  }

  static fromInbound(socket: Socket): Peer {
    const peer = new Peer();
    peer.accept(socket);
    return peer;
  }

  public open = async (): Promise<void> => {
    this.opened = true;

    await this.initConnection();
    // handshake process here

    this.emit('open');
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
  }

  public sendOrder = (order: any): void => { // TODO: change to Order type
    this.send('order', { order, pubKey });
  }

  private send = (packetType: string, payload: any) => { // TODO: change packetType to enum, perhaps make a payload base class / dummy interface
    this.lastSend = Date.now();
    this.socket.write(`${packetType} ${JSON.stringify(payload)}\r\n`);
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
      this.logger.debug(this.statusString);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = undefined;
        }
        this.socket.removeListener('error', onError);
      };

      const onError = (err) => {
        cleanup();
        reject(err);
      };

      this.socket.once('connect', () => {
        this.connectTime = Date.now();
        this.connected = true;
        this.logger.debug(this.statusString);
        this.emit('connect');

        cleanup();
        resolve();
      });

      this.socket.once('error', onError);

      this.connectTimeout = setTimeout(() => {
        this.connectTimeout = undefined;
        cleanup();
        reject(new Error('Connection timed out.'));
      }, 10000);
    });
  }

  private connect = (address: SocketAddress): void => {
    assert(!this.socket);

    const socket = net.connect(address.port, address.host);

    this.address = address;
    this.direction = ConnectionDirection.OUTBOUND;
    this.connected = false;

    this.bindSocket(socket);
  }

  private accept = (socket: Socket): void => {
    assert(!this.socket);

    this.address = SocketAddress.fromSocket(socket);
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
    parser.on('packet', async (packet) => {

      // handle packet in the Peer level here, if necessary.

      this.emit('packet', packet);
    });

    parser.on('error', (err: ParserError) => {
      if (this.destroyed) {
        return;
      }

      switch (err.type) {
        case ParserErrorType.UNPARSABLE_MESSAGE: {
          this.logger.warn(`Unparsable peer message: ${err.payload}`);
          this.error(err);
          this.increaseBan(10);
          break;
        }
        case ParserErrorType.UNKNOWN_PACKET_TYPE: {
          this.logger.warn(`Unknown peer message type: ${err.payload}`);
          this.error(err);
          this.increaseBan(20);
        }
      }
    });
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
}

export default Peer;
