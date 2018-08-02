import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

class GetHostsPacket extends Packet<undefined> {
  public get type() {
    return PacketType.GET_HOSTS;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default GetHostsPacket;
