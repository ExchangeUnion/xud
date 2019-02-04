import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as orders from '../../../orderbook/types';
import * as pb from '../../../proto/xudp2p_pb';

type OrdersPacketBody = orders.OutgoingOrder[];

class OrdersPacket extends Packet<OrdersPacketBody> {
  public get type() {
    return PacketType.Orders;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize = (binary: Uint8Array): OrdersPacket | pb.OrdersPacket.AsObject => {
    const obj = pb.OrdersPacket.deserializeBinary(binary).toObject();
    return OrdersPacket.validate(obj) ? OrdersPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.OrdersPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.reqId
      && obj.ordersList.every(order =>
        !!order.id
        && !!order.pairId
        && order.price > 0
        && order.quantity > 0,
      )
    );
  }

  private static convert = (obj: pb.OrdersPacket.AsObject): OrdersPacket => {
    return new OrdersPacket({
      header: {
        id: obj.id,
        reqId: obj.reqId,
      },
      body: obj.ordersList.map(pbOrder => ({
        id: pbOrder.id,
        pairId: pbOrder.pairId,
        price: pbOrder.price,
        quantity: pbOrder.quantity,
        isBuy: pbOrder.isBuy,
      })),
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.OrdersPacket();
    msg.setId(this.header.id);
    msg.setReqId(this.header.reqId!);
    msg.setOrdersList(this.body!.map((order) => {
      const pbOrder = new pb.Order();
      pbOrder.setId(order.id);
      pbOrder.setPairId(order.pairId);
      pbOrder.setPrice(order.price);
      pbOrder.setQuantity(order.quantity);
      pbOrder.setIsBuy(order.isBuy);
      return pbOrder;
    }));

    return msg.serializeBinary();
  }
}

export default OrdersPacket;
