import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { DisconnectionReason } from '../../../constants/enums';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';

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

  public static deserialize = (binary: Uint8Array): DisconnectingPacket | pb.DisconnectingPacket.AsObject => {
    const obj = pb.DisconnectingPacket.deserializeBinary(binary).toObject();
    return DisconnectingPacket.validate(obj) ? DisconnectingPacket.convert(obj) : obj;
  }

  private static validate = (msg: pb.DisconnectingPacket.AsObject): boolean => {
    return !!(msg.id
      && msg.reason
    );
  }

  private static convert = (obj: pb.DisconnectingPacket.AsObject): DisconnectingPacket => {
    return new DisconnectingPacket({
      header: {
        id: obj.id,
      },
      body: removeUndefinedProps({
        reason: obj.reason,
        payload: obj.payload || undefined,
      }),
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.DisconnectingPacket();
    msg.setId(this.header.id);
    msg.setReason(this.body!.reason);
    msg.setPayload(this.body!.payload!);

    return msg.serializeBinary();
  }
}

export default DisconnectingPacket;
