import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import Host from '../../Host';

type HostsPacketBody = {
  hosts: Host[],
};

class HostsPacket extends Packet<HostsPacketBody> {
  public get type() {
    return PacketType.HOSTS;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default HostsPacket;
