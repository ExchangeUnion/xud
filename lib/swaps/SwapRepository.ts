import { db } from '../types';
import Bluebird from 'bluebird';
import { Models } from '../db/DB';

class SwapRepository {

  constructor(private models: Models) {}

  public getSwapDeals = (): Bluebird<db.SwapDealInstance[]> => {
    return this.models.SwapDeal.findAll();
  }

  public getSwapDeal = async (rHash: string): Promise<db.SwapDealInstance | null> => {
    return this.models.SwapDeal.findOne({
      where: {
        rHash,
      },
    });
  }

  public addSwapDeal = (swapDeal: db.SwapDealFactory): Bluebird<db.SwapDealInstance> => {
    return this.models.SwapDeal.create(<db.SwapDealAttributes>swapDeal);
  }
}
export default SwapRepository;
