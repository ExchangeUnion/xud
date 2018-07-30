import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class PongPacket extends Packet<undefined> {
  public get type() {
    return PacketType.PONG;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default PongPacket;
