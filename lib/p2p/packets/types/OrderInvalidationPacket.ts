import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

type OrderInvalidationPacketBody = {
  orderId: string;
  pairId: string;
  // quantity: number;  TODO: implement quantity invalidation
};

class OrderInvalidationPacket extends Packet<OrderInvalidationPacketBody> {
  public get type() {
    return PacketType.ORDER_INVALIDATION;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default OrderInvalidationPacket;
