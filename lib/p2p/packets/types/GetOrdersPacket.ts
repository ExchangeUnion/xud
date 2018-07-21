import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class GetOrdersPacket extends Packet<{}> {
  public get type() {
    return PacketType.GETORDERS;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default GetOrdersPacket;
