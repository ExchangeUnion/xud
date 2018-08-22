import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class PingPacket extends Packet<undefined> {
  public get type() {
    return PacketType.PING;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default PingPacket;
