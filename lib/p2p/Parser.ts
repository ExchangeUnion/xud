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
  public feed = (data: Buffer): void => {
    const dataStr = data.toString();
    const packetLines = dataStr.split('\r\n');
    packetLines.forEach((packetStr) => {
      if (!packetStr) {
        return;
      }
      try {
        const packet = fromRaw(packetStr);
        this.emit('packet', packet);
      } catch (err) {
        this.emit('error', err);
      }
    });
  }
}

export { ParserError, ParserErrorType };
export default Parser;
