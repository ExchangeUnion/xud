import PacketType from './PacketType';
import Packet from './Packet';
import * as packetTypes from './types';

const fromRaw = (type: string, packet: string): Packet | void => {
  switch (type) {
    case PacketType.HELLO:
      return packetTypes.HelloPacket.fromRaw(packet);
    case PacketType.PING:
      return packetTypes.PingPacket.fromRaw(packet);
    case PacketType.PONG:
      return packetTypes.PongPacket.fromRaw(packet);
    case PacketType.ORDER:
      return packetTypes.OrderPacket.fromRaw(packet);
    default:
      return;
  }
};

export default {
  fromRaw,
};
