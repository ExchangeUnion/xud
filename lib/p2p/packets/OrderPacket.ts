import Packet from './Packet';
import PacketType from './PacketType';
import { OutgoingOrder } from '../../types';

type OrderPacketBody = {
  id: string;
  pairId: string;
  quantity: number;
  price: number;
  invoice: string;
};

class OrderPacket extends Packet {
  public type: PacketType = PacketType.ORDER;

  constructor(public body: OrderPacketBody) {
    super();
  }

  static fromOutgoingOrder(order: OutgoingOrder) {
    const { id, pairId, quantity, price, invoice } = order;
    return new OrderPacket({ id, pairId, quantity, price, invoice });
  }

  static fromRaw(body: string): OrderPacket {
    const bodyObject = JSON.parse(body);
    return new OrderPacket(bodyObject);
  }

  public toRaw(): string {
    return JSON.stringify(this.body);
  }
}

export default OrderPacket;
