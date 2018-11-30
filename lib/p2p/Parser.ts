import { EventEmitter } from 'events';
import { Packet, PacketType } from './packets';
import { PacketInterface } from './packets/Packet';
import * as packetTypes from './packets/types';

class ParserError {
  constructor(public type: ParserErrorType, public payload: string) { }
}

enum ParserErrorType {
  InvalidMessage,
  UnknownPacketType,
  UnparseableMessage,
  MaxBufferSizeExceeded,
}

const fromRaw = (type: number, binary: Uint8Array): Packet => {
  let packet;
  switch (type) {
    case PacketType.Hello:
      packet = packetTypes.HelloPacket.deserialize(binary);
      break;
    case PacketType.Disconnecting:
      packet = packetTypes.DisconnectingPacket.deserialize(binary);
      break;
    case PacketType.Ping:
      packet = packetTypes.PingPacket.deserialize(binary);
      break;
    case PacketType.Pong:
      packet = packetTypes.PongPacket.deserialize(binary);
      break;
    case PacketType.Order:
      packet = packetTypes.OrderPacket.deserialize(binary);
      break;
    case PacketType.OrderInvalidation:
      packet = packetTypes.OrderInvalidationPacket.deserialize(binary);
      break;
    case PacketType.GetOrders:
      packet = packetTypes.GetOrdersPacket.deserialize(binary);
      break;
    case PacketType.Orders:
      packet = packetTypes.OrdersPacket.deserialize(binary);
      break;
    case PacketType.GetNodes:
      packet = packetTypes.GetNodesPacket.deserialize(binary);
      break;
    case PacketType.Nodes:
      packet = packetTypes.NodesPacket.deserialize(binary);
      break;
    case PacketType.SwapRequest:
      packet = packetTypes.SwapRequestPacket.deserialize(binary);
      break;
    case PacketType.SwapAccepted:
      packet = packetTypes.SwapAcceptedPacket.deserialize(binary);
      break;
    case PacketType.SwapComplete:
      packet = packetTypes.SwapCompletePacket.deserialize(binary);
      break;
    case PacketType.SwapFailed:
      packet = packetTypes.SwapFailedPacket.deserialize(binary);
      break;
    default:
      throw new ParserError(ParserErrorType.UnknownPacketType, `packet: ${PacketType[type]}`);
  }

  if (!packet) {
    throw new ParserError(ParserErrorType.InvalidMessage, `packet: ${PacketType[type]}`);
  }

  return packet;
  /*
  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    throw new ParserError(ParserErrorType.UnparseableMessage, `${raw}: ${err}`);
  }

  // check that we have the required fields for an incoming packet
  if (typeof json.header === 'object' && typeof json.header.type === 'string' && typeof json.header.id === 'string') {
    const packet = json as PacketInterface;
    switch (packet.header.type) {
      case PacketType.Hello:
        return new packetTypes.HelloPacket(packet);
      case PacketType.Disconnecting:
        return new packetTypes.DisconnectingPacket(packet);
      case PacketType.Ping:
        return new packetTypes.PingPacket(packet);
      case PacketType.Pong:
        return new packetTypes.PongPacket(packet);
      case PacketType.Order:
        return new packetTypes.OrderPacket(packet);
      case PacketType.OrderInvalidation:
        return new packetTypes.OrderInvalidationPacket(packet);
      case PacketType.GetOrders:
        return new packetTypes.GetOrdersPacket(packet);
      case PacketType.Orders:
        return new packetTypes.OrdersPacket(packet);
      case PacketType.GetNodes:
        return new packetTypes.GetNodesPacket(packet);
      case PacketType.Nodes:
        return new packetTypes.NodesPacket(packet);
      case PacketType.SwapRequest:
        return new packetTypes.SwapRequestPacket(packet);
      case PacketType.SwapResponse:
        return new packetTypes.SwapAcceptedPacket(packet);
      case PacketType.SwapComplete:
        return new packetTypes.SwapCompletePacket(packet);
      case PacketType.SwapError:
        return new packetTypes.SwapFailedPacket(packet);
      default:
        throw new ParserError(ParserErrorType.UnknownPacketType, packet.header.type!);
    }
  } else {
    throw new ParserError(ParserErrorType.InvalidMessage, `${raw}`);
  }
  */
};

interface Parser {
  on(event: 'packet', packet: (order: Packet) => void): this;
  on(event: 'error', err: (order: ParserError) => void): this;
  emit(event: 'packet', packet: Packet): boolean;
  emit(event: 'error', err: ParserError): boolean;
}

/** Protocol packet parser */
class Parser extends EventEmitter {
  private pending: Buffer[] = [];
  private waiting = 0;
  private waitingMetadata = 0;
  private type = 0;

  public static readonly PACKET_METADATA_SIZE = 5; // in bytes
  private static readonly MAX_BUFFER_SIZE = (4 * 1024 * 1024); // in bytes

  constructor(private packetMetadataSize: number = Parser.PACKET_METADATA_SIZE, private maxBufferSize: number = Parser.MAX_BUFFER_SIZE) {
    super();
  }

  public feed = (data: Buffer): void => {
    const total = this.pending
      .map(buffer => buffer.length)
      .reduce((acc, curr) => acc + curr, 0) + data.length
    if (total > this.maxBufferSize) {
      this.resetCycle();
      this.emit('error', new ParserError(ParserErrorType.MaxBufferSizeExceeded, total.toString()));
      return;
    }

    if (this.waiting) {
      this.read(this.waiting, data);
    } else if (this.waitingMetadata) {
      this.pending.push(data.slice(0, this.waitingMetadata));
      const { type, size } = this.readMetadata(Buffer.concat(this.pending));
      this.type = type;
      this.pending = []
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

    return { type, size }
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
