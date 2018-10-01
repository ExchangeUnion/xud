import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type GetOrdersPacketBody = {
  pairIds: string[],
};

class GetOrdersPacket extends Packet<GetOrdersPacketBody> {
  public get type() {
    return PacketType.GetOrders;
  }

  public get direction() {
    return PacketDirection.Request;
  }
}

export default GetOrdersPacket;
