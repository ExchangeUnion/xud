import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { orders } from '../../../types';

type OrdersPacketBody = orders.OutgoingOrder[];

class OrdersPacket extends Packet<OrdersPacketBody> {
  public get type() {
    return PacketType.Orders;
  }

  public get direction() {
    return PacketDirection.Response;
  }
}

export default OrdersPacket;
