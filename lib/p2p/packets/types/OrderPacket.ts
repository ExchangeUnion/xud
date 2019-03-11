import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OutgoingOrder } from '../../../orderbook/types';
import * as pb from '../../../proto/xudp2p_pb';

class OrderPacket extends Packet<OutgoingOrder> {
  public get type() {
    return PacketType.Order;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): OrderPacket | pb.OrderPacket.AsObject => {
    const obj = pb.OrderPacket.deserializeBinary(binary).toObject();
    return OrderPacket.validate(obj) ? OrderPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.OrderPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.order
      && obj.order.id
      && obj.order.pairId
      && obj.order.price > 0
      && obj.order.quantity > 0
    );
  }

  private static convert = (obj: pb.OrderPacket.AsObject): OrderPacket => {
    return new OrderPacket({
      header: {
        id: obj.id,
      },
      body: {
        id: obj.order!.id,
        pairId: obj.order!.pairId,
        price: obj.order!.price,
        quantity: obj.order!.quantity,
        isBuy: obj.order!.isBuy,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const pbOrder = new pb.Order();
    pbOrder.setId(this.body!.id);
    pbOrder.setPairId(this.body!.pairId);
    pbOrder.setPrice(this.body!.price);
    pbOrder.setQuantity(this.body!.quantity);
    pbOrder.setIsBuy(this.body!.isBuy);

    const msg = new pb.OrderPacket();
    msg.setId(this.header.id);
    msg.setOrder(pbOrder);

    return msg.serializeBinary();
  }
}

export default OrderPacket;
