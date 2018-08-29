import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

export type DealRequestPacketBody = {
  takerDealId: string;
  takerAmount: number;
  takerCurrency: string;
  makerAmount: number;
  makerCurrency: string;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey: string;
  orderId?: string; // TODO: make this non-nullable and remove amount/currency
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
