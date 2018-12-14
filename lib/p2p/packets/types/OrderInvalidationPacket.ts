import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OrderPortion } from '../../../types/orders';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';
import OrderPacket from './OrderPacket';

type OrderInvalidationPacketBody = OrderPortion;

class OrderInvalidationPacket extends Packet<OrderInvalidationPacketBody> {
  public get type() {
    return PacketType.OrderInvalidation;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): OrderInvalidationPacket | pb.OrderInvalidationPacket.AsObject => {
    const obj = pb.OrderInvalidationPacket.deserializeBinary(binary).toObject();
    return OrderInvalidationPacket.validate(obj) ? OrderInvalidationPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.OrderInvalidationPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.orderId
      && obj.pairid
      && obj.quantity
    );
  }

  private static convert = (obj: pb.OrderInvalidationPacket.AsObject): OrderPacket => {
    return new OrderPacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: {
        id: obj.orderId,
        pairId: obj.pairid,
        quantity: obj.quantity,
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.OrderInvalidationPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setOrderId(this.body!.id);
    msg.setPairid(this.body!.pairId);
    msg.setQuantity(this.body!.quantity);

    return msg.serializeBinary();
  }
}

export default OrderInvalidationPacket;
