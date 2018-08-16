import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeConnectionInfo } from '../../../types/p2p';

class NodesPacket extends Packet<NodeConnectionInfo[]> {
  public get type() {
    return PacketType.NODES;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default NodesPacket;
