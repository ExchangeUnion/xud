import PacketType from './PacketType';
import Packet from './Packet';
import * as packetTypes from './types';

const fromRaw = (type: string, packet: string): Packet | void => {
  switch (type) {
    case PacketType.HELLO:
      return new packetTypes.HelloPacket(packet);
    case PacketType.PING:
      return new packetTypes.PingPacket(packet);
    case PacketType.PONG:
      return new packetTypes.PongPacket(packet);
    case PacketType.ORDER:
      return new packetTypes.OrderPacket(packet);
    case PacketType.GET_ORDERS:
      return new packetTypes.GetOrdersPacket(packet);
    case PacketType.ORDERS:
      return new packetTypes.OrdersPacket(packet);
    case PacketType.GET_HOSTS:
      return new packetTypes.GetHostsPacket(packet);
    case PacketType.HOSTS:
      return new packetTypes.HostsPacket(packet);
    default:
      return;
  }
};

export default {
  fromRaw,
};
