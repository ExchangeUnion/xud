import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

export type SwapRequestPacketBody = {
  proposedQuantity: number;
  pairId: string;
  orderId: string;
  rHash: string;
  takerCltvDelta: number;
};

class SwapRequestPacket extends Packet<SwapRequestPacketBody> {
  public get type() {
    return PacketType.SwapRequest;
  }

  public get direction() {
    return PacketDirection.Request;
  }

  public static deserialize = (binary: Uint8Array): SwapRequestPacket | undefined => {
    const msg = pb.SwapRequestPacket.deserializeBinary(binary).toObject();
    return SwapRequestPacket.validate(msg) ? SwapRequestPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.SwapRequestPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.proposedquantity
      && msg.pairid
      && msg.orderid
      && msg.rhash
      && msg.takercltvdelta
    );
  }

  private static convert = (msg: pb.SwapRequestPacket.AsObject): SwapRequestPacket => {
    return new SwapRequestPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: {
        proposedQuantity: msg.proposedquantity,
        pairId: msg.pairid,
        orderId: msg.orderid,
        rHash: msg.rhash,
        takerCltvDelta: msg.takercltvdelta,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.SwapRequestPacket();
    msg.setHeader(pbHeader);
    msg.setProposedquantity(this.body!.proposedQuantity);
    msg.setPairid(this.body!.pairId);
    msg.setOrderid(this.body!.orderId);
    msg.setRhash(this.body!.rHash);
    msg.setTakercltvdelta(this.body!.takerCltvDelta);

    return msg.serializeBinary();
  }
}

export default SwapRequestPacket;
