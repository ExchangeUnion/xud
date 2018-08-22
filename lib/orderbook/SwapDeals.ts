import Logger from '../Logger';
import { CurrencyType, SwapDealRole } from '../types/enums';

export type SwapDeal = {
  // TODO: consider to change myRole to isTaker or is Maker and make it boolean
  myRole: SwapDealRole;
  /** global order it in XU network */
  orderId?: string;
  takerDealId: string;
  takerAmount: number;
  /** takerCoin is the name of the coin the taker is expecting to get */
  takerCoin: CurrencyType;
  takerPubKey: string;
  makerDealId?: string;
  makerAmount: number;
  /** makerCoin is the name of the coin the maker is expecting to get */
  // TODO: consider to use currency instead of CurrencyType
  makerCoin: CurrencyType;
  makerPubKey?: string;
  r_hash?: string;
  preImage?: string;
  createTime: number;
  executeTime?: number;
  competionTime?: number
};

export class SwapDeals {
  private deals: SwapDeal[] = [];

  constructor(private logger: Logger) {
  }

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
