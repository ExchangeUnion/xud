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
    return PacketType.SwapResponse;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public serialize(): Uint8Array {
    const msg = new pb.Hello();
    //  msg.setVersion(this.body!.version)
    //  msg.setNodepubkey(this.body!.nodePubKey)
    return msg.serializeBinary();
  }
}

export default SwapAcceptedPacket;
