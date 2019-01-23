import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

export type SwapCompletePacketBody = {
  rHash: string;
};

class SwapCompletePacket extends Packet<SwapCompletePacketBody> {
  public get type() {
    return PacketType.SwapComplete;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): SwapCompletePacket | pb.SwapCompletePacket.AsObject => {
    const obj = pb.SwapCompletePacket.deserializeBinary(binary).toObject();
    return SwapCompletePacket.validate(obj) ? SwapCompletePacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SwapCompletePacket.AsObject): boolean => {
    return !!(obj.id
      && obj.rHash
    );
  }

  private static convert = (obj: pb.SwapCompletePacket.AsObject): SwapCompletePacket => {
    return new SwapCompletePacket({
      header: {
        id: obj.id,
      },
      body: {
        rHash: obj.rHash,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SwapCompletePacket();
    msg.setId(this.header.id);
    msg.setRHash(this.body!.rHash);

    return msg.serializeBinary();
  }
}

export default SwapCompletePacket;
