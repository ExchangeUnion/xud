import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

// TODO: proper error handling
export type DealResponsePacketBody = {
  r_hash?: string;
  takerDealId: string,
  makerDealId?: string;
  /** Maker's lnd pubkey on the maker currency's network. */
  makerPubKey?: string;
};

class DealResponsePacket extends Packet<DealResponsePacketBody> {
  public get type() {
    return PacketType.DEAL_RESPONSE;
  }

  public get direction() {
    return PacketDirection.RESPONSE;
  }
}

export default DealResponsePacket;
