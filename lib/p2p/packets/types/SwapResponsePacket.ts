import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

// TODO: proper error handling
export type SwapResponsePacketBody = {
  r_hash: string;
  quantity: number;
};

class SwapResponsePacket extends Packet<SwapResponsePacketBody> {
  public get type() {
    return PacketType.SwapResponse;
  }

  public get direction() {
    return PacketDirection.Response;
  }
}

export default SwapResponsePacket;
