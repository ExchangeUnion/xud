import { EventEmitter } from 'events';
import { PacketType } from './packets';
import Packet, { isPacket } from './packets/Packet';
import * as packetTypes from './packets/types';

class ParserError {
  constructor(public type: ParserErrorType, public payload: string) { }
}

enum ParserErrorType {
  InvalidPacket,
  UnknownPacketType,
  MaxBufferSizeExceeded,
}

const fromRaw = (type: number, binary: Uint8Array): Packet => {
  let packetOrPbObj;
  switch (type) {
    case PacketType.Hello:
      packetOrPbObj = packetTypes.HelloPacket.deserialize(binary);
      break;
    case PacketType.Disconnecting:
      packetOrPbObj = packetTypes.DisconnectingPacket.deserialize(binary);
      break;
    case PacketType.Ping:
      packetOrPbObj = packetTypes.PingPacket.deserialize(binary);
      break;
    case PacketType.Pong:
      packetOrPbObj = packetTypes.PongPacket.deserialize(binary);
      break;
    case PacketType.Order:
      packetOrPbObj = packetTypes.OrderPacket.deserialize(binary);
      break;
    case PacketType.OrderInvalidation:
      packetOrPbObj = packetTypes.OrderInvalidationPacket.deserialize(binary);
      break;
    case PacketType.GetOrders:
      packetOrPbObj = packetTypes.GetOrdersPacket.deserialize(binary);
      break;
    case PacketType.Orders:
      packetOrPbObj = packetTypes.OrdersPacket.deserialize(binary);
      break;
    case PacketType.GetNodes:
      packetOrPbObj = packetTypes.GetNodesPacket.deserialize(binary);
      break;
    case PacketType.Nodes:
      packetOrPbObj = packetTypes.NodesPacket.deserialize(binary);
      break;
    case PacketType.SwapRequest:
      packetOrPbObj = packetTypes.SwapRequestPacket.deserialize(binary);
      break;
    case PacketType.SwapAccepted:
      packetOrPbObj = packetTypes.SwapAcceptedPacket.deserialize(binary);
      break;
    case PacketType.SwapComplete:
      packetOrPbObj = packetTypes.SwapCompletePacket.deserialize(binary);
      break;
    case PacketType.SwapFailed:
      packetOrPbObj = packetTypes.SwapFailedPacket.deserialize(binary);
      break;
    default:
      throw new ParserError(ParserErrorType.UnknownPacketType, PacketType[type]);
  }

  if (!isPacket(packetOrPbObj)) {
    throw new ParserError(ParserErrorType.InvalidPacket, `${PacketType[type]} ${JSON.stringify(packetOrPbObj)}`);
  }

  return packetOrPbObj;
};

interface Parser {
  on(event: 'packet', packet: (order: Packet) => void): this;
  on(event: 'error', err: (order: ParserError) => void): this;
  emit(event: 'packet', packet: Packet): boolean;
  emit(event: 'error', err: ParserError): boolean;
}

/** Protocol packet parser */
class Parser extends EventEmitter {

  public static readonly PACKET_METADATA_SIZE = 5; // in bytes
  private pending: Buffer[] = [];
  private waiting = 0;
  private waitingMetadata = 0;
  private type = 0;
  private static readonly MAX_BUFFER_SIZE = (4 * 1024 * 1024); // in bytes

  constructor(private packetMetadataSize: number = Parser.PACKET_METADATA_SIZE, private maxBufferSize: number = Parser.MAX_BUFFER_SIZE) {
    super();
  }

  public feed = (data: Buffer): void => {
    const totalSize = this.pending
      .map(buffer => buffer.length)
      .reduce((acc, curr) => acc + curr, 0) + data.length;
    if (totalSize > this.maxBufferSize) {
      this.resetCycle();
      this.emit('error', new ParserError(ParserErrorType.MaxBufferSizeExceeded, totalSize.toString()));
      return;
    }

    if (this.waiting) {
      this.read(this.waiting, data);
    } else if (this.waitingMetadata) {
      this.pending.push(data.slice(0, this.waitingMetadata));
      const { type, size } = this.readMetadata(Buffer.concat(this.pending));
      this.type = type;
      this.pending = [];
      this.read(size, data.slice(this.waitingMetadata));
    } else if (data.length < this.packetMetadataSize) {
      this.pending.push(data);
      this.waitingMetadata = this.packetMetadataSize - data.length;
    } else {
      const { type, size } = this.readMetadata(data);
      this.type = type;
      this.read(size, data.slice(this.packetMetadataSize));
    }
  }

  private readMetadata = (data: Buffer): { type: number, size: number } => {
    // first byte is the packet type
    const type = data.readUInt8(0, true);
    // next 4 bytes are the size of the packet
    const size = data.readUInt32LE(1, true);

    return { type, size };
  }

  private read = (size: number, chunk: Buffer) => {
    this.pending.push(chunk.slice(0, size));

    if (size > chunk.length) { // packet isn't complete
      this.waiting = size - chunk.length;
    } else { // chunk is finalizing the packet
      this.parsePacket(this.type, this.pending);
      this.resetCycle();
      if (size < chunk.length) { // multiple packets
        this.feed(chunk.slice(size));
      }
    }
  }

  private resetCycle = () => {
    this.waiting = 0;
    this.waitingMetadata = 0;
    this.pending = [];
  }

  private parsePacket = (type: number, chunks: Buffer[]): void => {
    try {
      const buffer = Buffer.concat(chunks);
      const binary = Uint8Array.from(buffer);

      const packet = fromRaw(type, binary);
      this.emit('packet', packet);
    } catch (err) {
      this.emit('error', err);
    }
  }
}

export { ParserError, ParserErrorType };
export default Parser;
