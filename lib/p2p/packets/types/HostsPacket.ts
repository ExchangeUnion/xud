import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { HostFactory } from '../../../types/db';

class HostsPacket extends Packet<HostFactory[]> {
  public get type() {
    return PacketType.HOSTS;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default HostsPacket;
