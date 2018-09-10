import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type DealRequestPacketBody = {
  dealId: string;
  proposedQuantity: number;
  pairId: string;
  takerAmount: number;
  takerCurrency: string;
  makerAmount: number;
  makerCurrency: string;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey: string;
  orderId: string;
};

class DealRequestPacket extends Packet<DealRequestPacketBody> {
  public get type() {
    return PacketType.DEAL_REQUEST;
  }

  public get direction() {
    return PacketDirection.REQUEST;
  }
}

export default DealRequestPacket;
