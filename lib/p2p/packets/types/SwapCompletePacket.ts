import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import SwapAcceptedPacket from './SwapAcceptedPacket';

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

  public static deserialize(binary: Uint8Array): SwapCompletePacket | undefined {
    const msg = pb.SwapCompletePacket.deserializeBinary(binary).toObject();
    return SwapCompletePacket.validate(msg) ? SwapCompletePacket.convert(msg) : undefined;
  }

  private static validate(msg: pb.SwapCompletePacket.AsObject): boolean {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.rhash
    );
  }

  private static convert = (msg: pb.SwapCompletePacket.AsObject): SwapCompletePacket => {
    return new SwapCompletePacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: {
        rHash: msg.rhash,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.SwapCompletePacket();
    msg.setHeader(pbHeader);
    msg.setRhash(this.body!.rHash);

    return msg.serializeBinary();
  }
}

export default SwapCompletePacket;
