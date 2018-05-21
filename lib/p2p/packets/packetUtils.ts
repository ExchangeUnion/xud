import PacketType from './PacketType';
import Packet from './Packet';
import OrderPacket from './OrderPacket';

const fromRaw = (type:string, body:string): Packet|void => {
  switch (type) {
    case PacketType.ORDER:
      return OrderPacket.fromRaw(body);
    default:
      return;
  }
};

export default {
  fromRaw,
}
