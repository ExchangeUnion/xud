import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { DisconnectionReason } from '../../../types/enums';

export type DisconnectingPacketBody = {
  reason: DisconnectionReason;
  payload?: string;
};

class DisconnectingPacket extends Packet<DisconnectingPacketBody> {
  public get type() {
    return PacketType.Disconnecting;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }
}

export default DisconnectingPacket;
