import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

type PongPacketBody = {
  ts: number;
};

class PongPacket extends Packet<PongPacketBody> {
  public get type() {
    return PacketType.PONG;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default PongPacket;
