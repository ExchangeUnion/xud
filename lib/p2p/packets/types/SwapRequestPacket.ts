import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type SwapRequestPacketBody = {
  proposedQuantity: number;
  pairId: string;
  takerAmount: number;
  takerCurrency: string;
  makerAmount: number;
  makerCurrency: string;
  orderId: string;
  r_hash: string;
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
