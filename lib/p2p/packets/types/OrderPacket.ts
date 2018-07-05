import Packet, { MessageType, PacketHeader } from '../Packet';
import PacketType from '../PacketType';
import { orders } from '../../../types/index';

type OrderPacketBody = {
  id: string;
  pairId: string;
  quantity: number;
  price: number;
  invoice: string;
};

class OrderPacket extends Packet {
  public type: PacketType = PacketType.ORDER;
  public messageType: MessageType = MessageType.UNILATERAL;

  constructor(public body: OrderPacketBody, header?: PacketHeader) {
    super(body, header);
  }

  public static fromOutgoingOrder(order: orders.OutgoingOrder) {
    const { id, pairId, quantity, price, invoice } = order;
    return new OrderPacket({ id, pairId, quantity, price, invoice });
  }

  public static fromRaw(packet: string): OrderPacket {
    const { header, body } = JSON.parse(packet);
    return new OrderPacket(body, header);
  }
}

export default OrderPacket;
