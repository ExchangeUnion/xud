import { SwapDealRole } from '../types/enums';

type SwapDeal = {
  /** The role of the local node in the swap. */
  myRole: SwapDealRole; // TODO: consider changing myRole to boolean named isTaker or isMaker
  /** The global XU order id for the maker's order. */
  orderId?: string; // TODO: make this non-nullable and remove amount/currency
  takerDealId: string;
  takerAmount: number;
  /** The currency the taker is expecting to receive. */
  takerCurrency: string;
  /** The lnd pub key of the taker. */
  takerPubKey: string;
  makerDealId?: string;
  makerAmount: number;
  /** The currency the maker is expecting to receive. */
  makerCurrency: string;
  /** The lnd pub key of the maker. */
  makerPubKey?: string;
  /** The xud node pub key of remote node. */
  peerPubKey?: string; // TODO: make required
  /** The hash of the preimage. */
  r_hash?: string;
  r_preimage?: string;
  createTime: number;
  executeTime?: number;
  completeTime?: number
};

export class SwapDeals {
  private deals: SwapDeal[] = [];

  public get = (role: SwapDealRole, dealId: string): SwapDeal | undefined => {
    for (const deal of this.deals) {
      if (role === SwapDealRole.Maker && deal.makerDealId === dealId) {
        return deal;
      }
      if (role === SwapDealRole.Taker && deal.takerDealId === dealId) {
        return deal;
      }
    }
    return undefined;
  }

  public findByHash = (hash: string): SwapDeal | undefined => {
    for (const deal of this.deals) {
      if (hash === deal.r_hash) {
        return deal;
      }
    }
    return undefined;
  }

  public add = (deal: SwapDeal) => {
    this.deals.push(deal);
  }
}

export default SwapDeals;
export { SwapDeal };
