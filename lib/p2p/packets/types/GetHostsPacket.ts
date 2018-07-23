import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

type GetHostsPacketBody = {
  ts: number;
};

class GetHostsPacket extends Packet<GetHostsPacketBody> {
  public get type() {
    return PacketType.GET_HOSTS;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default GetHostsPacket;
