import * as db from '../db/types';
import Bluebird from 'bluebird';
import { Models } from '../db/DB';
import { SwapState } from '../constants/enums';

class SwapRepository {

  constructor(private models: Models) {}

  public getSwapDeals = (status = SwapState.Completed, limit?: number): Bluebird<db.SwapDealInstance[]> => {
    const query = status ? status : {};

    if (limit) {
      return this.models.SwapDeal.findAll({
        limit,
        where : query,
        include: [this.models.Node, this.models.Order] });
    } else {
      return this.models.SwapDeal.findAll({ where : query, include: [this.models.Node, this.models.Order] });
    }
  }

  public getSwapDeal = async (rHash: string): Promise<db.SwapDealInstance | null> => {
    return this.models.SwapDeal.findOne({
      where: {
        rHash,
      },
      include: [this.models.Node, this.models.Order],
    });
  }

  public addSwapDeal = async (swapDeal: db.SwapDealFactory): Promise<db.SwapDealInstance> => {
    const node = await this.models.Node.findOne({
      where: {
        nodePubKey: swapDeal.peerPubKey,
      },
    });
    const attributes = { ...swapDeal, nodeId: node!.id } as db.SwapDealAttributes;
    return this.models.SwapDeal.create(attributes);
  }
}

export default SwapRepository;
