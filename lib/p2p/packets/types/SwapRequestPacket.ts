import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type SwapRequestPacketBody = {
  proposedQuantity: number;
  pairId: string;
  orderId: string;
  rHash: string;
  takerCltvDelta: number;
};

class SwapRequestPacket extends Packet<SwapRequestPacketBody> {
  public get type() {
    return PacketType.SwapRequest;
  }

  public get direction() {
    return PacketDirection.Request;
  }
}

export default SwapRequestPacket;
