import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class GetNodesPacket extends Packet<undefined> {
  public get type() {
    return PacketType.GetNodes;
  }

  public get direction() {
    return PacketDirection.Request;
  }
}

export default GetNodesPacket;
