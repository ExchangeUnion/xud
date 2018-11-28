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

  public serialize(): Uint8Array {
    const msg = new pb.Hello();
    //  msg.setVersion(this.body!.version)
    //  msg.setNodepubkey(this.body!.nodePubKey)
    return msg.serializeBinary();
  }
}

export default SwapRequestPacket;
