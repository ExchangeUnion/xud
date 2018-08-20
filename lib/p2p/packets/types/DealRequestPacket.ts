import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { CurrencyType } from '../../../types/enums';

export type DealRequestPacketBody = {
  takerDealId: string;
  takerAmount: number;
  takerCoin: CurrencyType;
  makerAmount: number;
  makerCoin: CurrencyType;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey: string;
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
