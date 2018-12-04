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

  public static deserialize = (binary: Uint8Array): OrderInvalidationPacket | undefined => {
    const msg = pb.OrderPacket.deserializeBinary(binary).toObject();
    return OrderInvalidationPacket.validate(msg) ? OrderInvalidationPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.OrderInvalidationPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.id
      && msg.pairid
      && msg.quantity
    );
  }

  private static convert = (msg: pb.OrderInvalidationPacket.AsObject): OrderPacket => {
    return new OrderPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: {
        id: msg.id,
        pairId: msg.pairid,
        quantity: msg.quantity,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.OrderInvalidationPacket();
    msg.setHeader(pbHeader);
    msg.setId(this.body!.id);
    msg.setPairid(this.body!.pairId);
    msg.setQuantity(this.body!.quantity);

    return msg.serializeBinary();
  }
}

export default OrderInvalidationPacket;
