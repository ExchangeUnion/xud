import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class PingPacket extends Packet<undefined> {
  public get type() {
    return PacketType.Ping;
  }

  public get direction() {
    return PacketDirection.Request;
  }
}

export default PingPacket;
