import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OrderIdentifier } from '../../../types/orders';

type OrderInvalidationPacketBody = OrderIdentifier;

class OrderInvalidationPacket extends Packet<OrderInvalidationPacketBody> {
  public get type() {
    return PacketType.ORDER_INVALIDATION;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default OrderInvalidationPacket;
