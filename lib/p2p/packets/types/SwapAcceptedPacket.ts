import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

// TODO: proper error handling
export type SwapAcceptedPacketBody = {
  rHash: string;
  /** Specifies the accepted quantity (which may be less than the proposed quantity). */
  quantity: number;
  makerCltvDelta: number;
};

class SwapAcceptedPacket extends Packet<SwapAcceptedPacketBody> {
  public get type() {
    return PacketType.SwapAccepted;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize(binary: Uint8Array): SwapAcceptedPacket | undefined {
    const msg = pb.SwapAcceptedPacket.deserializeBinary(binary).toObject();
    return SwapAcceptedPacket.validate(msg) ? SwapAcceptedPacket.convert(msg) : undefined;
  }

  private static validate(msg: pb.SwapAcceptedPacket.AsObject): boolean {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && msg.header.reqid
      && msg.rhash
      && msg.quantity
      && msg.makercltvdelta
    );
  }

  private static convert = (msg: pb.SwapAcceptedPacket.AsObject): SwapAcceptedPacket => {
    return new SwapAcceptedPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
        reqId: msg.header!.reqid,
      },
      body: {
        rHash: msg.rhash,
        quantity: msg.quantity,
        makerCltvDelta: msg.makercltvdelta,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);
    pbHeader.setReqid(this.header.reqId!);

    const msg = new pb.SwapAcceptedPacket();
    msg.setHeader(pbHeader);
    msg.setRhash(this.body!.rHash);
    msg.setQuantity(this.body!.quantity);
    msg.setMakercltvdelta(this.body!.makerCltvDelta);

    return msg.serializeBinary();
  }
}

export default SwapAcceptedPacket;
