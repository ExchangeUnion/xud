import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeConnectionInfo } from '../../../types/p2p';

class NodesPacket extends Packet<NodeConnectionInfo[]> {
  public get type() {
    return PacketType.Nodes;
  }

  public get direction() {
    return PacketDirection.Response;
  }
}

export default NodesPacket;
