import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

export type SanitySwapPacketBody = {
  currency: string;
  rHash: string;
};

class SanitySwapPacket extends Packet<SanitySwapPacketBody> {
  public get type() {
    return PacketType.SanitySwap;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): SanitySwapPacket | pb.SanitySwapPacket.AsObject => {
    const obj = pb.SanitySwapPacket.deserializeBinary(binary).toObject();
    return SanitySwapPacket.validate(obj) ? SanitySwapPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SanitySwapPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.currency
      && obj.rHash);
  }

  private static convert = (obj: pb.SanitySwapPacket.AsObject): SanitySwapPacket => {
    return new SanitySwapPacket({
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
    const msg = new pb.SanitySwapPacket();
    msg.setId(this.header.id);
    msg.setCurrency(this.body!.currency);
    msg.setRHash(this.body!.rHash);

    return msg.serializeBinary();
  }
}

export default SanitySwapPacket;
