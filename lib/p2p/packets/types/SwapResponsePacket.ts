import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type SwapResponsePacketBody = {
  // TODO: add deal id
  r_preimage?: string;
};

class SwapResponsePacket extends Packet<SwapResponsePacketBody> {
  public get type() {
    return PacketType.SWAP_RESPONSE;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default SwapResponsePacket;
