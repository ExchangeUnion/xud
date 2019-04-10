import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

export type SessionAckPacketBody = {
  ephemeralPubKey: string;
};

class SessionAckPacket extends Packet<SessionAckPacketBody> {
  public get type(): PacketType {
    return PacketType.SessionAck;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Response;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): SessionAckPacket | pb.SessionAckPacket.AsObject => {
    const obj = pb.SessionAckPacket.deserializeBinary(binary).toObject();
    return SessionAckPacket.validate(obj) ? SessionAckPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SessionAckPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.reqId
      && obj.ephemeralPubKey
    );
  }

  private static convert = (obj: pb.SessionAckPacket.AsObject): SessionAckPacket => {
    return new SessionAckPacket({
      header: {
        id: obj.id,
        reqId: obj.reqId,
      },
      body: {
        ephemeralPubKey: obj.ephemeralPubKey,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SessionAckPacket();
    msg.setId(this.header.id);
    msg.setReqId(this.header.reqId!);
    msg.setEphemeralPubKey(this.body!.ephemeralPubKey);

    return msg.serializeBinary();
  }
}

export default SessionAckPacket;
