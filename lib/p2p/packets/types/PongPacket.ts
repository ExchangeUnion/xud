import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class PongPacket extends Packet<undefined> {
  public get type() {
    return PacketType.Pong;
  }

  public get direction() {
    return PacketDirection.Response;
  }
}

export default PongPacket;
