import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OutgoingOrder } from '../../../types/orders';

class OrderPacket extends Packet<OutgoingOrder> {
  public get type() {
    return PacketType.Order;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }
}

export default OrderPacket;
