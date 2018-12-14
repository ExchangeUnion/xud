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

  public static deserialize = (binary: Uint8Array): SwapRequestPacket | pb.SwapRequestPacket.AsObject => {
    const obj = pb.SwapRequestPacket.deserializeBinary(binary).toObject();
    return SwapRequestPacket.validate(obj) ? SwapRequestPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SwapRequestPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.proposedquantity
      && obj.pairid
      && obj.orderid
      && obj.rhash
      && obj.takercltvdelta
    );
  }

  private static convert = (obj: pb.SwapRequestPacket.AsObject): SwapRequestPacket => {
    return new SwapRequestPacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: {
        proposedQuantity: obj.proposedquantity,
        pairId: obj.pairid,
        orderId: obj.orderid,
        rHash: obj.rhash,
        takerCltvDelta: obj.takercltvdelta,
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.SwapRequestPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setProposedquantity(this.body!.proposedQuantity);
    msg.setPairid(this.body!.pairId);
    msg.setOrderid(this.body!.orderId);
    msg.setRhash(this.body!.rHash);
    msg.setTakercltvdelta(this.body!.takerCltvDelta);

    return msg.serializeBinary();
  }
}

export default SwapRequestPacket;
