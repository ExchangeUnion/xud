import { EventEmitter } from 'events';
import { Packet, PacketType } from './packets';
import { PacketInterface } from './packets/Packet';
import * as packetTypes from './packets/types';

class ParserError {
  constructor(public type: ParserErrorType, public payload: string) { }
}

enum ParserErrorType {
  INVALID_MESSAGE,
  UNKNOWN_PACKET_TYPE,
  UNPARSEABLE_MESSAGE,
}

const fromRaw = (raw: string): Packet => {
  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    throw new ParserError(ParserErrorType.UNPARSEABLE_MESSAGE, `${raw}: ${err}`);
  }

  // check that we have the required fields for an incoming packet
  if (typeof json.header === 'object' && typeof json.header.type === 'string' && typeof json.header.id === 'string') {
    const packet = json as PacketInterface;
    switch (packet.header.type) {
      case PacketType.HELLO:
        return new packetTypes.HelloPacket(packet);
      case PacketType.PING:
        return new packetTypes.PingPacket(packet);
      case PacketType.PONG:
        return new packetTypes.PongPacket(packet);
      case PacketType.ORDER:
        return new packetTypes.OrderPacket(packet);
      case PacketType.ORDER_INVALIDATION:
        return new packetTypes.OrderInvalidationPacket(packet);
      case PacketType.GET_ORDERS:
        return new packetTypes.GetOrdersPacket(packet);
      case PacketType.ORDERS:
        return new packetTypes.OrdersPacket(packet);
      case PacketType.GET_HOSTS:
        return new packetTypes.GetHostsPacket(packet);
      case PacketType.HOSTS:
        return new packetTypes.HostsPacket(packet);
      default:
        throw new ParserError(ParserErrorType.UNKNOWN_PACKET_TYPE, packet.header.type!);
    }
  } else {
    throw new ParserError(ParserErrorType.INVALID_MESSAGE, `${raw}`);
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
  private pending: Buffer[] = [];
  private waiting: number = 0;

  public feed = (data: Buffer): void => {
    if (this.waiting) {
      this.read(this.waiting, data);
    } else {
      // first 4 bytes are the size of the packet
      const size = data.readUInt32LE(0, true);
      this.read(size, data.slice(4));
    }
  }

  private read = (size: number, chunk: Buffer) => {
    this.pending.push(chunk.slice(0, size));

    if (size > chunk.length) { // packet isn't complete
      this.waiting = size - chunk.length;
    } else { // chunk is finalizing the packet
      this.parsePacket(this.pending);
      this.resetCycle();
      if (size < chunk.length) { // multiple packets
        this.feed(chunk.slice(size));
      }
    }
  }

  private resetCycle = () => {
    this.waiting = 0;
    this.pending = [];
  }

  private parsePacket = (chunks: Buffer[]): void => {
    try {
      const packetStr = chunks.map(chunk => chunk.toString()).join('');
      const packet = fromRaw(packetStr);
      this.emit('packet', packet);
    } catch (err) {
      this.emit('error', err);
    }
  }
}

export { ParserError, ParserErrorType };
export default Parser;
