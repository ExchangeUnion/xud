import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type DisconnectingPacketBody = {
  reason: DisconnectionReason;
  payload?: string;
};

export enum DisconnectionReason {
  ResponseStalling,
  IncompatibleProtocolVersion,
  UnexpectedIdentity,
  ForbiddenIdentityUpdate,
  ConnectedToSelf,
  NotReadyForConnections,
  Banned,
  AlreadyConnected,
  Shutdown,
}

class DisconnectingPacket extends Packet<DisconnectingPacketBody> {
  public get type() {
    return PacketType.Disconnecting;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }
}

export default DisconnectingPacket;
