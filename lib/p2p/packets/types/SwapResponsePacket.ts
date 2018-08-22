import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { CurrencyType } from '../../../types/enums';

export type SwapResponsePacketBody = {
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
