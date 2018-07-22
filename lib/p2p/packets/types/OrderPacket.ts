import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

type OrderPacketBody = {
  id: string;
  pairId: string;
  quantity: number;
  price: number;
  invoice: string;
};

class OrderPacket extends Packet<OrderPacketBody> {
  public get type() {
    return PacketType.HELLO;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default OrderPacket;
