import Packet, { MessageType } from '../Packet';
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
  public body!: OrderPacketBody;

  public init(args: OrderPacketBody): OrderPacket {
    this.body = args;
    this.header = this.createHeader(this.body);
    return this;
  }

  public fromOutgoingOrder(order: orders.OutgoingOrder): OrderPacket {
    return this.init(order);
  }
}

export default OrderPacket;
