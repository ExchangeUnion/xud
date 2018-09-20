import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class GetOrdersPacket extends Packet<undefined> {
  public get type() {
    return PacketType.GetOrders;
  }

  public get direction() {
    return PacketDirection.Request;
  }
}

export default GetOrdersPacket;
