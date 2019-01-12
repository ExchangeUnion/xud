/* tslint:disable brace-style */
import { EventEmitter } from 'events';
import { PacketType } from './packets';
import Packet, { isPacket } from './packets/Packet';
import * as packetTypes from './packets/types';
import Framer, { WireMsgHeader }   from './Framer';

class ParserError {
  constructor(public type: ParserErrorType, public payload: string) { }
}

enum ParserErrorType {
  InvalidPacket,
  UnknownPacketType,
  DataIntegrityError,
  MaxBufferSizeExceeded,
}

const parsePacket = (header: WireMsgHeader, payload: Uint8Array): Packet => {
  let packetOrPbObj;
  switch (header.type) {
    case PacketType.HelloRequest:
      packetOrPbObj = packetTypes.HelloRequestPacket.deserialize(payload);
      break;
    case PacketType.HelloResponse:
      packetOrPbObj = packetTypes.HelloResponsePacket.deserialize(payload);
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
      throw new ParserError(ParserErrorType.UnknownPacketType, PacketType[header.type]);
  }

  if (!isPacket(packetOrPbObj)) {
    throw new ParserError(ParserErrorType.InvalidPacket, `${PacketType[header.type]} ${JSON.stringify(packetOrPbObj)}`);
  }

  const packet = packetOrPbObj;
  if (header.checksum !== packet.checksum().readUInt32LE(0, true)) {
    throw new ParserError(ParserErrorType.DataIntegrityError, `${PacketType[header.type]} ${JSON.stringify(packet)}`);
  }

  return packet;
};

interface Parser {
  on(event: 'packet', packet: (order: Packet) => void): this;
  on(event: 'error', err: (order: ParserError) => void): this;
  emit(event: 'packet', packet: Packet): boolean;
  emit(event: 'error', err: ParserError): boolean;
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
    const totalSize = this.pending
      .map(buffer => buffer.length)
      .reduce((acc, curr) => acc + curr, 0) + chunk.length;
    if (totalSize > this.maxBufferSize) {
      this.resetCycle();
      this.emit('error', new ParserError(ParserErrorType.MaxBufferSizeExceeded, totalSize.toString()));
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
      const length = this.framer.parseLength(data, !!this.encryptionKey);
      this.pending = [];
      this.read(length + this.msgHeaderLength, data);
    }

    // starting to read a new message which is split on the header
    else if (chunk.length < this.msgHeaderLength) {
      this.pending.push(chunk);
      this.waitingHeader = this.msgHeaderLength - chunk.length;
    }

    // start to read a new message
    else {
      const length =  this.framer.parseLength(chunk, !!this.encryptionKey);
      this.read(length + this.msgHeaderLength, chunk);
    }
  }

  private read = (length: number, chunk: Buffer) => {
    this.pending.push(chunk.slice(0, length));

    if (length > chunk.length) { // message isn't complete
      this.waiting = length - chunk.length;
    } else { // chunk is finalizing the message
      this.parseMessage(this.pending);
      this.resetCycle();
      if (length < chunk.length) { // multiple messages
        this.feed(chunk.slice(length));
      }
    }
  }

  private resetCycle = () => {
    this.waiting = 0;
    this.waitingHeader = 0;
    this.pending = [];
  }

  private parseMessage = (chunks: Buffer[]): void => {
    try {
      const msg = Buffer.concat(chunks);
      const { header, packet } = this.framer.unframe(msg, this.encryptionKey);

      const parsedPacket = parsePacket(header, Uint8Array.from(packet));
      this.emit('packet', parsedPacket);
    } catch (err) {
      this.emit('error', err);
    }
  }
}

export { ParserError, ParserErrorType };
export default Parser;
