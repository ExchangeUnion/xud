import PacketType from './PacketType';
import OrderPacket from './OrderPacket';

const fromRaw = (type:string, body:string) => {
  switch (type) {
    case PacketType.ORDER:
      return OrderPacket.fromRaw(body);
    default:
      return null;
  }
};

export default {
  fromRaw,
};
