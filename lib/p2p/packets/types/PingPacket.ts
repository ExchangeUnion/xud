import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

type PingPacketBody = {
  ts: number;
};

class PingPacket extends Packet<PingPacketBody> {
  public get type() {
    return PacketType.PING;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default PingPacket;
