/* tslint:disable brace-style */
import { EventEmitter } from 'events';
import { PacketType } from './packets';
import Packet, { isPacket } from './packets/Packet';
import * as packetTypes from './packets/types';
import Framer, { WireMsgHeader }   from './Framer';
import errors from './errors';

interface Parser {
  on(event: 'packet', packet: (order: Packet) => void): this;
  on(event: 'error', err: (order: {message: string, code: string}) => void): this;
  emit(event: 'packet', packet: Packet): boolean;
  emit(event: 'error', err: {message: string, code: string}): boolean;
}

/** Wire protocol msg parser */
class Parser extends EventEmitter {
  private pending: Buffer[] = [];
  private waiting = 0;
  private waitingHeader = 0;
  private encryptionKey?: Buffer;
  private static readonly MAX_BUFFER_SIZE = (4 * 1024 * 1024); // in bytes

  constructor(
    private framer: Framer,
    private msgHeaderLength: number = Framer.MSG_HEADER_LENGTH,
    private maxBufferSize: number = Parser.MAX_BUFFER_SIZE,
  ) {
    super();
  }

  public setEncryptionKey = (key: Buffer) => {
    this.encryptionKey = key;
    this.msgHeaderLength = Framer.ENCRYPTED_MSG_HEADER_LENGTH;
  }

  public feed = (chunk: Buffer): void => {
    // verify that total size isn't exceeding
    const totalSize = this.getTotalSize(chunk);
    if (totalSize > this.maxBufferSize) {
      this.error(errors.PARSER_MAX_BUFFER_SIZE_EXCEEDED(totalSize));
      return;
    }

    // reading through a split message
    if (this.waiting) {
      this.read(this.waiting, chunk);
    }

    // reading through a message which is split on the header
    else if (this.waitingHeader) {
      this.pending.push(chunk);
      const data = Buffer.concat(this.pending);
      const length = this.parseLength(data);
      if (!length) {
        return;
      }
      this.pending = [];
      this.read(length + this.msgHeaderLength, data);
    }

    // starting to read a new message which is split on the header
    else if (chunk.length < this.msgHeaderLength) {
      this.pending.push(chunk);
      this.waitingHeader = this.msgHeaderLength - chunk.length;
    }

    // starting to read a new message
    else {
      const length =  this.parseLength(chunk);
      if (!length) {
        return;
      }
      this.read(length + this.msgHeaderLength, chunk);
    }
  }

  private read = (length: number, chunk: Buffer) => {
    this.pending.push(chunk.slice(0, length));

    // message isn't complete
    if (length > chunk.length) {
      this.waiting = length - chunk.length;
    }

    // chunk is finalizing the msg
    else {
      this.parseMessage(this.pending);
      this.resetBuffer();

      // chunk is containing more messages
      if (length < chunk.length) {
        this.feed(chunk.slice(length));
      }
    }
  }

  private getTotalSize = (chunk: Buffer): number => {
    const current = this.pending
      .map(buffer => buffer.length)
      .reduce((acc, curr) => acc + curr, 0);

    return current + chunk.length;
  }

  private resetBuffer = () => {
    this.waiting = 0;
    this.waitingHeader = 0;
    this.pending = [];
  }

  private parseLength = (data: Buffer): number => {
    try {
      return this.framer.parseLength(data, !!this.encryptionKey);
    } catch (err) {
      this.error(err);
      return 0;
    }
  }

  private parseMessage = (chunks: Buffer[]): void => {
    try {
      const msg = Buffer.concat(chunks);
      const { header, packet } = this.framer.unframe(msg, this.encryptionKey);
      const parsedPacket = this.parsePacket(header, Uint8Array.from(packet));
      this.emit('packet', parsedPacket);
    } catch (err) {
      this.error(err);
    }
  }

  private parsePacket = (header: WireMsgHeader, payload: Uint8Array): Packet => {
    let packetOrPbObj;
    switch (header.type) {
      case PacketType.SessionInit:
        packetOrPbObj = packetTypes.SessionInitPacket.deserialize(payload);
        break;
      case PacketType.SessionAck:
        packetOrPbObj = packetTypes.SessionAckPacket.deserialize(payload);
        break;
      case PacketType.NodeStateUpdate:
        packetOrPbObj = packetTypes.NodeStateUpdatePacket.deserialize(payload);
        break;
      case PacketType.Disconnecting:
        packetOrPbObj = packetTypes.DisconnectingPacket.deserialize(payload);
        break;
      case PacketType.Ping:
        packetOrPbObj = packetTypes.PingPacket.deserialize(payload);
        break;
      case PacketType.Pong:
        packetOrPbObj = packetTypes.PongPacket.deserialize(payload);
        break;
      case PacketType.Order:
        packetOrPbObj = packetTypes.OrderPacket.deserialize(payload);
        break;
      case PacketType.OrderInvalidation:
        packetOrPbObj = packetTypes.OrderInvalidationPacket.deserialize(payload);
        break;
      case PacketType.GetOrders:
        packetOrPbObj = packetTypes.GetOrdersPacket.deserialize(payload);
        break;
      case PacketType.Orders:
        packetOrPbObj = packetTypes.OrdersPacket.deserialize(payload);
        break;
      case PacketType.GetNodes:
        packetOrPbObj = packetTypes.GetNodesPacket.deserialize(payload);
        break;
      case PacketType.Nodes:
        packetOrPbObj = packetTypes.NodesPacket.deserialize(payload);
        break;
      case PacketType.SanitySwap:
        packetOrPbObj = packetTypes.SanitySwapPacket.deserialize(payload);
        break;
      case PacketType.SwapRequest:
        packetOrPbObj = packetTypes.SwapRequestPacket.deserialize(payload);
        break;
      case PacketType.SwapAccepted:
        packetOrPbObj = packetTypes.SwapAcceptedPacket.deserialize(payload);
        break;
      case PacketType.SwapComplete:
        packetOrPbObj = packetTypes.SwapCompletePacket.deserialize(payload);
        break;
      case PacketType.SwapFailed:
        packetOrPbObj = packetTypes.SwapFailedPacket.deserialize(payload);
        break;
      default:
        throw errors.PARSER_UNKNOWN_PACKET_TYPE(header.type.toString());
    }

    if (!isPacket(packetOrPbObj)) {
      throw errors.PARSER_INVALID_PACKET(`${PacketType[header.type]} ${JSON.stringify(packetOrPbObj)}`);
    }

    const packet = packetOrPbObj;
    if (header.checksum && header.checksum !== packet.checksum()) {
      throw errors.PARSER_DATA_INTEGRITY_ERR(`${PacketType[header.type]} ${JSON.stringify(packet)}`);
    }

    return packet;
  }

  private error = (err: any) => {
    this.emit('error', err);
    this.resetBuffer();
  }
}

export default Parser;
