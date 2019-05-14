import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

export type SanitySwapInitPacketBody = {
  currency: string;
  rHash: string;
};

class SanitySwapInitPacket extends Packet<SanitySwapInitPacketBody> {
  public get type() {
    return PacketType.SanitySwap;
  }

  public get direction() {
    return PacketDirection.Request;
  }

  public get responseType(): ResponseType {
    return PacketType.SanitySwapAck;
  }

  public static deserialize = (binary: Uint8Array): SanitySwapInitPacket | pb.SanitySwapInitPacket.AsObject => {
    const obj = pb.SanitySwapInitPacket.deserializeBinary(binary).toObject();
    return SanitySwapInitPacket.validate(obj) ? SanitySwapInitPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SanitySwapInitPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.currency
      && obj.rHash);
  }

  private static convert = (obj: pb.SanitySwapInitPacket.AsObject): SanitySwapInitPacket => {
    return new SanitySwapInitPacket({
      header: {
        id: obj.id,
      },
      body: {
        currency: obj.currency,
        rHash: obj.rHash,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SanitySwapInitPacket();
    msg.setId(this.header.id);
    msg.setCurrency(this.body!.currency);
    msg.setRHash(this.body!.rHash);

    return msg.serializeBinary();
  }
}

export default SanitySwapInitPacket;
