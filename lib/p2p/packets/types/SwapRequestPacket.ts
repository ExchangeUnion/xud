import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type SwapRequestPacketBody = {
  dealId: string;
};

class SwapRequestPacket extends Packet<SwapRequestPacketBody> {
  public get type() {
    return PacketType.SWAP_REQUEST;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default SwapRequestPacket;
