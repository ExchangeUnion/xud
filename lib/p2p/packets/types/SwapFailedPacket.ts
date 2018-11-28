import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

// TODO: proper error handling
export type SwapFailedPacketBody = {
  rHash: string;
  errorMessage: string;
};

class SwapFailedPacket extends Packet<SwapFailedPacketBody> {
  public get type() {
    return PacketType.SwapError;
  }

  public get direction(): PacketDirection {
    // SwapFailedPacket may serve as a response to SwapRequest packet
    if (this.header.reqId) {
      return PacketDirection.Response;
    }
    return PacketDirection.Unilateral;
  }

  public serialize(): Uint8Array {
    const msg = new pb.Hello();
    //  msg.setVersion(this.body!.version)
    //  msg.setNodepubkey(this.body!.nodePubKey)
    return msg.serializeBinary();
  }
}

export default SwapFailedPacket;
