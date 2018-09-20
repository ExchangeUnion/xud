import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

// TODO: proper error handling
export type SwapErrorPacketBody = {
  r_hash: string;
  errorMessage: string;
};

class SwapErrorPacket extends Packet<SwapErrorPacketBody> {
  public get type() {
    return PacketType.SwapError;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }
}

export default SwapErrorPacket;
