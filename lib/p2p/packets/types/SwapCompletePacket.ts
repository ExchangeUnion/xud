import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

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
}

export default SwapCompletePacket;
