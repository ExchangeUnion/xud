import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import { OrderPortion } from '../../../orderbook/types';
import * as pb from '../../../proto/xudp2p_pb';

type OrderInvalidationPacketBody = OrderPortion;

class OrderInvalidationPacket extends Packet<OrderInvalidationPacketBody> {
  public get type(): PacketType {
    return PacketType.OrderInvalidation;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Unilateral;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): OrderInvalidationPacket | pb.OrderInvalidationPacket.AsObject => {
    const obj = pb.OrderInvalidationPacket.deserializeBinary(binary).toObject();
    return OrderInvalidationPacket.validate(obj) ? OrderInvalidationPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.OrderInvalidationPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.orderId
      && obj.pairId
      && obj.quantity > 0
    );
  }

  private static convert = (obj: pb.OrderInvalidationPacket.AsObject): OrderInvalidationPacket => {
    return new OrderInvalidationPacket({
      header: {
        id: obj.id,
      },
      body: {
        id: obj.orderId,
        pairId: obj.pairId,
        quantity: obj.quantity,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.OrderInvalidationPacket();
    msg.setId(this.header.id);
    msg.setOrderId(this.body!.id);
    msg.setPairId(this.body!.pairId);
    msg.setQuantity(this.body!.quantity);

    return msg.serializeBinary();
  }
}

export default OrderInvalidationPacket;
