import { Models } from '../db/DB';
import * as db from '../db/types';

class SwapRepository {
  constructor(private models: Models) {}

  public getSwapDeals = (): Promise<db.SwapDealInstance[]> => {
    return this.models.SwapDeal.findAll({ include: [this.models.Node, this.models.Order] });
  };

  public getSwapDeal = async (rHash: string): Promise<db.SwapDealInstance | null> => {
    return this.models.SwapDeal.findOne({
      where: { rHash },
      include: [this.models.Node, this.models.Order],
    });
  };

  public saveSwapDeal = async (swapDeal: db.SwapDealCreationAttributes, swapOrder?: db.OrderCreationAttributes) => {
    if (swapOrder) {
      await this.models.Order.upsert(swapOrder);
    }

    const node = await this.models.Node.findOne({ where: { nodePubKey: swapDeal.peerPubKey } });
    const attributes = { ...swapDeal, nodeId: node!.id } as db.SwapDealAttributes;
    await this.models.SwapDeal.upsert(attributes);
  };
}
export default SwapRepository;
