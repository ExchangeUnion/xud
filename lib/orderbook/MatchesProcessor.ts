import Logger from '../Logger';
import { OrderMatch } from '../types/matchingEngine';
import { isPeerOrder, StampedPeerOrder, StampedOwnOrder } from '../types/orders';
import RaidenClient from '../raidenclient/RaidenClient';
import Pool from '../p2p/Pool';
import * as packets from '../p2p/packets';
import uuidv1 from 'uuid/v1';
import { SwapDeal } from './SwapDeals';
import { SwapDealRole } from '../types/enums';

class MatchesProcessor {
  constructor(private logger: Logger, private pool?: Pool, private raidenClient?: RaidenClient) { }

  public process = (match: OrderMatch) => {
    if (isPeerOrder(match.maker)) {
      this.executeSwap(match);
    } else {
      // internal match
      this.notifyClient(match);
    }
  }

  private notifyClient(_match: OrderMatch) {
    // TODO: notify the local exchange client on the match
  }

  private executeSwap = (match: OrderMatch) => {
    if (this.pool) {
      /** The remote maker order we are filling. */
      const maker = match.maker as StampedPeerOrder;
      /** Our local taker order. */
      const taker = match.taker as StampedOwnOrder;

      const peer = this.pool.getPeer(maker.peerPubKey);

      const [baseCurrency, quoteCurrency] = maker.pairId.split('/');

      let takerCurrency: string;
      let makerCurrency: string;
      let takerAmount: number;
      let makerAmount: number;
       // TODO: use configurable amount of subunits/satoshis per token for each currency
      if (taker.quantity > 0) {
        // we are buying the base currency
        takerCurrency = baseCurrency;
        makerCurrency = quoteCurrency;
        takerAmount = taker.quantity * 100000000;
        makerAmount = taker.quantity * maker.price * 100000000;
      } else {
        // we are selling the base currency
        takerCurrency = quoteCurrency;
        makerCurrency = baseCurrency;
        takerAmount = taker.quantity * maker.price * -100000000;
        makerAmount = taker.quantity * -100000000;
      }

      const dealRequestBody: packets.DealRequestPacketBody = {
        takerCurrency,
        makerCurrency,
        takerAmount,
        makerAmount,
        takerPubKey: takerCurrency === 'BTC' ? this.pool.handshakeData.lndbtcPubKey! : this.pool.handshakeData.lndltcPubKey!,
        takerDealId: uuidv1(),
        orderId: maker.id,
      };

      const deal: SwapDeal = {
        ...dealRequestBody,
        myRole : SwapDealRole.Taker,
        peerPubKey: this.pool.handshakeData.nodePubKey,
        createTime: Date.now(),
      };

      // TODO: Put swapped amount on hold

      this.pool.swapDeals.add(deal);
      this.logger.debug('Initiating swap deal: ' + JSON.stringify(deal));

      // TODO: Subscribe to swap events to handle swap resolution

      const packet = new packets.DealRequest(dealRequestBody);

      peer.sendPacket(packet);
    }
  }
}

export default MatchesProcessor;
