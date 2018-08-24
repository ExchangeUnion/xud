import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OutgoingOrder } from '../../../types/orders';

class OrderPacket extends Packet<OutgoingOrder> {
  public get type() {
    return PacketType.ORDER;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default OrderPacket;
