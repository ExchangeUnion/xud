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

  public serialize(): Uint8Array {
    const msg = new pb.Hello();
    //  msg.setVersion(this.body!.version)
    //  msg.setNodepubkey(this.body!.nodePubKey)
    return msg.serializeBinary();
  }
}

export default SwapCompletePacket;
