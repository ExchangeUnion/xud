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

const fromRaw = (raw: string): Packet => {
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
};

interface Parser {
  on(event: 'packet', packet: (order: Packet) => void): this;
  on(event: 'error', err: (order: ParserError) => void): this;
  emit(event: 'packet', packet: Packet): boolean;
  emit(event: 'error', err: ParserError): boolean;
}

/** Protocol packet parser */
class Parser extends EventEmitter {
  private buffer = '';

  private static MAX_BUFFER_SIZE = (4 * 1024 * 1024); // in bytes

  constructor(private delimiter: string, private maxBufferSize: number = Parser.MAX_BUFFER_SIZE) {
    super();
  }

  public feed = (data: string): void => {
    const total = Buffer.byteLength(this.buffer) + Buffer.byteLength(data);
    if (total > this.maxBufferSize) {
      this.buffer = '';
      this.emit('error', new ParserError(ParserErrorType.MaxBufferSizeExceeded, total.toString()));
      return;
    }
    this.buffer += data;
    const index = this.buffer.indexOf(this.delimiter);
    if (index > -1) {
      this.parsePacket(this.buffer.slice(0, index));
      const next = this.buffer.slice(index + this.delimiter.length);
      this.buffer = '';
      this.feed(next);
    }
  }

  private parsePacket = (packetStr: string): void => {
    try {
      const packet = fromRaw(packetStr);
      this.emit('packet', packet);
    } catch (err) {
      this.emit('error', err);
    }
  }
}

export { ParserError, ParserErrorType };
export default Parser;
