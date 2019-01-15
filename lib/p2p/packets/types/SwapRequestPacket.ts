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
      && obj.proposedQuantity
      && obj.pairId
      && obj.orderId
      && obj.rHash
      && obj.takerCltvDelta
    );
  }

  private static convert = (obj: pb.SwapRequestPacket.AsObject): SwapRequestPacket => {
    return new SwapRequestPacket({
      header: {
        id: obj.id,
      },
      body: {
        proposedQuantity: obj.proposedQuantity,
        pairId: obj.pairId,
        orderId: obj.orderId,
        rHash: obj.rHash,
        takerCltvDelta: obj.takerCltvDelta,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SwapRequestPacket();
    msg.setId(this.header.id);
    msg.setProposedQuantity(this.body!.proposedQuantity);
    msg.setPairId(this.body!.pairId);
    msg.setOrderId(this.body!.orderId);
    msg.setRHash(this.body!.rHash);
    msg.setTakerCltvDelta(this.body!.takerCltvDelta);

    return msg.serializeBinary();
  }
}

export default SwapRequestPacket;
