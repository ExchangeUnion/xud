import * as db from '../db/types';
import Bluebird from 'bluebird';
import { Models } from '../db/DB';

class SwapRepository {

  constructor(private models: Models) {}

  public getSwapDeals = (): Bluebird<db.SwapDealInstance[]> => {
    return this.models.SwapDeal.findAll({ include: [this.models.Node, this.models.Order] });
  }

  public getSwapDeal = async (rHash: string): Promise<db.SwapDealInstance | null> => {
    return this.models.SwapDeal.findOne({
      where: {
        rHash,
      },
      include: [this.models.Node, this.models.Order],
    });
  }

  public saveSwapDeal = async (swapDeal: db.SwapDealFactory, swapOrder?: db.OrderFactory) => {
    if (swapOrder) {
      await this.models.Order.upsert(swapOrder);
    }

    const node = await this.models.Node.findOne({
      where: {
        nodePubKey: swapDeal.peerPubKey,
      },
    });
    const attributes = { ...swapDeal, nodeId: node!.id } as db.SwapDealAttributes;
    await this.models.SwapDeal.upsert(attributes);
  }
}
export default SwapRepository;
