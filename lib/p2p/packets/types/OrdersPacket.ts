import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { orders } from '../../../types';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import OrderPacket from './OrderPacket';

type OrdersPacketBody = orders.OutgoingOrder[];

class OrdersPacket extends Packet<OrdersPacketBody> {
  public get type() {
    return PacketType.Orders;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize = (binary: Uint8Array): OrdersPacket | undefined => {
    const msg = pb.OrdersPacket.deserializeBinary(binary).toObject();
    return OrdersPacket.validate(msg) ? OrdersPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.OrdersPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && msg.header.reqid
      && msg.ordersList.filter(order =>
        order.id
        && order.pairid
        && order.price
        && order.quantity,
      ).length === msg.ordersList.length
    );
  }

  private static convert = (msg: pb.OrdersPacket.AsObject): OrdersPacket => {
    return new OrdersPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
        reqId: msg.header!.reqid,
      },
      body: msg.ordersList.map(pbOrder => ({
        id: pbOrder.id,
        pairId: pbOrder.pairid,
        price: pbOrder.price,
        quantity: pbOrder.quantity,
        isBuy: pbOrder.isbuy,
      })),
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);
    pbHeader.setReqid(this.header.reqId!);

    const msg = new pb.OrdersPacket();
    msg.setHeader(pbHeader);
    msg.setOrdersList(this.body!.map((order) => {
      const pbOrder = new pb.Order();
      pbOrder.setId(order.id);
      pbOrder.setPairid(order.pairId);
      pbOrder.setPrice(order.price);
      pbOrder.setQuantity(order.quantity);
      pbOrder.setIsbuy(order.isBuy);
      return pbOrder;
    }));

    return msg.serializeBinary();
  }
}

export default OrdersPacket;
