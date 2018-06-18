import PacketType from './PacketType';
import Packet from './Packet';
import OrderPacket from './OrderPacket';
import HelloPacket from './HelloPacket';
import PingPacket from './PingPacket';
import PongPacket from './PongPacket';


const fromRaw = (type:string, body:string): Packet|void => {
  switch (type) {
    case PacketType.HELLO:
      return HelloPacket.fromRaw(body);
    case PacketType.PING:
      return PingPacket.fromRaw(body);
    case PacketType.PONG:
      return PongPacket.fromRaw(body);
    case PacketType.ORDER:
      return OrderPacket.fromRaw(body);
    default:
      return;
  }
};

export default {
  fromRaw,
};
