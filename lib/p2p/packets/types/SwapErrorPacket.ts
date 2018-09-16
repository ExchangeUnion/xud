import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

// TODO: proper error handling
export type SwapErrorPacketBody = {
  r_hash: string;
  errorMessage: string;
};

class SwapErrorPacket extends Packet<SwapErrorPacketBody> {
  public get type() {
    return PacketType.SWAP_ERROR;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default SwapErrorPacket;
