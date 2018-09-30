import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OrderPortion } from '../../../types/orders';

type OrderInvalidationPacketBody = OrderPortion;

class OrderInvalidationPacket extends Packet<OrderInvalidationPacketBody> {
  public get type() {
    return PacketType.OrderInvalidation;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }
}

export default OrderInvalidationPacket;
