import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { DisconnectionReason } from '../../../types/enums';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';

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

  public static deserialize = (binary: Uint8Array): DisconnectingPacket | undefined => {
    const msg = pb.DisconnectingPacket.deserializeBinary(binary).toObject();
    return DisconnectingPacket.validate(msg) ? DisconnectingPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.DisconnectingPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.reason
    );
  }

  private static convert = (msg: pb.DisconnectingPacket.AsObject): DisconnectingPacket => {
    return new DisconnectingPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: removeUndefinedProps({
        reason: msg.reason,
        payload: msg.payload || undefined,
      }),
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.DisconnectingPacket();
    msg.setHeader(pbHeader);
    msg.setReason(this.body!.reason);
    msg.setPayload(this.body!.payload!);

    return msg.serializeBinary();
  }
}

export default DisconnectingPacket;
