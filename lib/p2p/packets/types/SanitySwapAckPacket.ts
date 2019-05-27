import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

export type SanitySwapAckPacketBody = { };

class SanitySwapAckPacket extends Packet<SanitySwapAckPacketBody> {
  public get type() {
    return PacketType.SanitySwapAck;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): SanitySwapAckPacket | pb.SanitySwapAckPacket.AsObject => {
    const obj = pb.SanitySwapAckPacket.deserializeBinary(binary).toObject();
    return SanitySwapAckPacket.validate(obj) ? SanitySwapAckPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SanitySwapAckPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.reqId
    );
  }

  private static convert = (obj: pb.SanitySwapAckPacket.AsObject): SanitySwapAckPacket => {
    return new SanitySwapAckPacket({
      header: {
        id: obj.id,
        reqId: obj.reqId,
      },
      body: { },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SanitySwapAckPacket();
    msg.setId(this.header.id);
    msg.setReqId(this.header.reqId!);

    return msg.serializeBinary();
  }
}

export default SanitySwapAckPacket;
