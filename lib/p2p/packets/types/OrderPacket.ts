import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { OutgoingOrder } from '../../../types/orders';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';

class OrderPacket extends Packet<OutgoingOrder> {
  public get type() {
    return PacketType.Order;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): OrderPacket | undefined => {
    const msg = pb.OrderPacket.deserializeBinary(binary).toObject();
    return OrderPacket.validate(msg) ? OrderPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.OrderPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.id
      && msg.pairid
      && msg.price
      && msg.quantity
    );
  }

  private static convert = (msg: pb.OrderPacket.AsObject): OrderPacket => {
    return new OrderPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: {
        id: msg.id,
        pairId: msg.pairid,
        price: msg.price,
        quantity: msg.quantity,
        isBuy: msg.isbuy,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.OrderPacket();
    msg.setHeader(pbHeader);
    msg.setId(this.body!.id);
    msg.setPairid(this.body!.pairId);
    msg.setPrice(this.body!.price);
    msg.setQuantity(this.body!.quantity);
    msg.setIsbuy(this.body!.isBuy);

    return msg.serializeBinary();
  }
}

export default OrderPacket;
