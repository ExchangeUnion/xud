import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { orders } from '../../../types';

type OrdersPacketBody = {
  orders: orders.OutgoingOrder[],
};

class OrdersPacket extends Packet<OrdersPacketBody> {
  public get type() {
    return PacketType.ORDERS;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default OrdersPacket;
