import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class GetNodesPacket extends Packet<undefined> {
  public get type() {
    return PacketType.GET_NODES;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default GetNodesPacket;
