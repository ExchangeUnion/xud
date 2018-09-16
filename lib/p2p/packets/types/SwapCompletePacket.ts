import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type SwapCompletePacketBody = {
  r_hash: string;
};

class SwapCompletePacket extends Packet<SwapCompletePacketBody> {
  public get type() {
    return PacketType.SWAP_COMPLETE;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default SwapCompletePacket;
