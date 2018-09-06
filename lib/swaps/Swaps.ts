import { SwapDealRole } from '../types/enums';
import Peer from '../p2p/Peer';
import uuidv1 from 'uuid/v1';
import * as packets from '../p2p/packets/types';
import { randomBytes, createHash } from 'crypto';
import Logger from '../Logger';
import * as lndrpc from '../proto/lndrpc_pb';
import LndClient from '../lndclient/LndClient';
import Pool from '../p2p/Pool';
import { EventEmitter } from 'events';
import { StampedPeerOrder, StampedOwnOrder } from '../types/orders';

type SwapDeal = {
  /** The role of the local node in the swap. */
  myRole: SwapDealRole;
  /** The xud node pub key of the counterparty to this swap deal. */
  peerPubKey: string;
  /** Global order id in the XU network. */
  orderId?: string;
  takerDealId: string;
  /** The number of satoshis (or equivalent) the taker is expecting to receive. */
  takerAmount: number;
  /** The currency the taker is expecting to receive. */
  takerCurrency: string;
  /** The lnd pub key of the taker. */
  takerPubKey: string;
  makerDealId?: string;
  /** The number of satoshis (or equivalent) the maker is expecting to receive. */
  makerAmount: number;
  /** The currency the maker is expecting to receive. */
  makerCurrency: string;
  /** The lnd pub key of the maker. */
  makerPubKey?: string;
  /** The hash of the preimage. */
  r_hash?: string;
  r_preimage?: string;
  createTime: number;
  executeTime?: number;
  competionTime?: number
};

export class Swaps extends EventEmitter {
  private deals: SwapDeal[] = [];

  constructor(private logger: Logger, private pool: Pool, private lndBtcClient: LndClient, private lndLtcClient: LndClient) {
    super();

    this.bind();
  }

  private bind() {
    this.pool.on('packet.dealRequest', this.handleDealRequest);
    this.pool.on('packet.dealResponse', this.handleDealResponse);
    this.pool.on('packet.swapRequest', this.handleSwapRequest);
    this.pool.on('packet.swapResponse', this.handleSwapResponse);
  }

  private getDeal = (role: SwapDealRole, dealId: string): SwapDeal | undefined => {
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

  public addDeal = (deal: SwapDeal) => {
    this.deals.push(deal);
  }

  public getDealByHash = (r_hash: string): SwapDeal | undefined => {
    for (const deal of this.deals) {
      if (r_hash === deal.r_hash) {
        return deal;
      }
    }
    return undefined;
  }

  /**
   * Begins a swap to fill an order by sending a [[DealRequestPacket]] to the maker.
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   */
  public beginSwap = (maker: StampedPeerOrder, taker: StampedOwnOrder) => {
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

    this.addDeal(deal);
    this.logger.debug('Initiating swap deal: ' + JSON.stringify(deal));

    // TODO: Subscribe to swap events to handle swap resolution

    const packet = new packets.DealRequestPacket(dealRequestBody);

    peer.sendPacket(packet);
  }

  public executeSwap = (takerCurrency: string, makerCurrency: string, takerPubKey: string,
  takerAmount: number, makerAmount: number, peer: Peer) => {
    // TODO: Remove this method after we remove Service.executeSwap()
    const dealRequestBody = {
      takerCurrency,
      makerCurrency,
      takerPubKey,
      takerAmount,
      makerAmount,
      takerDealId: uuidv1(),
    };

    const deal: SwapDeal = {
      ...dealRequestBody,
      myRole : SwapDealRole.Taker,
      peerPubKey: peer.nodePubKey!,
      createTime: Date.now(),
    };

    const packet = new packets.DealRequestPacket(dealRequestBody);
    peer.sendPacket(packet);

    this.logger.debug('New swap deal: ' + JSON.stringify(deal));
    return deal;
  }

  /**
   * Handles a request from a peer to create a swap deal. Creates a preimage to be used for the swap, creates a deal,
   * and stores the deal in the local collection of deals. Responds to the peer with a deal response packet.
   */
  private handleDealRequest = (requestPacket: packets.DealRequestPacket, peer: Peer)  => {
    const requestBody = requestPacket.body;
    if (!requestBody) {
      return;
    }
    this.logger.debug('Received deal request: ' + JSON.stringify(requestBody));

    /** The lnd pub key to use for the local (maker) side of the deal */
    let makerPubKey: string | undefined;
    switch (requestBody.makerCurrency){
      case 'BTC':
        makerPubKey = this.pool.handshakeData.lndbtcPubKey;
        break;
      case 'LTC':
        makerPubKey = this.pool.handshakeData.lndltcPubKey;
        break;
    }

    let responsePacket: packets.DealResponsePacket;
    if (!makerPubKey) {
      // we don't support this currency, respond with an empty packet to reject the deal
      // TODO: check if we support taker currency as well
      responsePacket = new packets.DealResponsePacket({ takerDealId: requestBody.takerDealId }, requestPacket.header.id);
    } else {
      // accept the deal
      const r_preimage = randomBytes(32);
      const hash = createHash('sha256');
      const r_hash = hash.update(r_preimage).digest('hex');
      const makerDealId = randomBytes(32).toString('hex');

      const deal: SwapDeal = {
        ...requestBody,
        makerDealId,
        makerPubKey,
        r_hash,
        r_preimage: r_preimage.toString('hex'),
        peerPubKey: peer.nodePubKey!,
        myRole: SwapDealRole.Maker,
        createTime: Date.now(),
      };

      this.addDeal(deal);
      this.logger.debug('[SWAP] New deal: ' + JSON.stringify(deal));

      const responseBody: packets.DealResponsePacketBody = {
        makerPubKey,
        makerDealId,
        r_hash,
        takerDealId: requestBody.takerDealId,
      };

      responsePacket = new packets.DealResponsePacket(responseBody, requestPacket.header.id);
    }
    this.logger.debug('Sending deal response to peer: ' + JSON.stringify(responsePacket.body));
    peer.sendPacket(responsePacket);
  }

  /**
   * Handles a response from a peer to confirm a swap deal and updates the deal. If the deal is
   * accepted, sends a [[SwapRequestPacket]] to initiate the deal.
   */
  private handleDealResponse = (responsePacket: packets.DealResponsePacket, peer: Peer): void  => {
    const responseBody = responsePacket.body!;
    const deal = this.getDeal(SwapDealRole.Taker, responseBody.takerDealId);
    if (!deal) {
      // TODO: add error handling for an unknown deal id
      return;
    }

    if (!responseBody.r_hash) {
      // Our deal request doesn't have a payment hash and therefore was rejected
      this.emit('swap.rejected');
      return;
    }

    deal.makerPubKey = responseBody.makerPubKey;
    deal.makerDealId = responseBody.makerDealId;
    deal.r_hash = responseBody.r_hash;
    this.logger.debug('[SWAP] Updated deal: ' + JSON.stringify(deal));

    const swapRequestBody: packets.SwapRequestPacketBody = {
      makerDealId: deal.makerDealId!,
    };

    const swapRequestPacket = new packets.SwapRequestPacket(swapRequestBody);

    this.logger.debug('Sending swap request to peer: ' + JSON.stringify(swapRequestBody));

    peer.sendPacket(swapRequestPacket);
  }

  /**
   * Handles a request from a peer to perform a swap. Performs the actual swap via lnd and sends
   * a [[SwapResponsePacketBody]] containing the preimage after it's complete.
   */
  private handleSwapRequest = async (requestPacket: packets.SwapRequestPacket, peer: Peer) => {
    const requestBody = requestPacket.body!;
    this.logger.debug(`Received swap request: ${JSON.stringify(requestBody)}`);

    let responseBody: packets.SwapResponsePacketBody = {};
    const deal = this.getDeal(SwapDealRole.Maker, requestBody.makerDealId);
    if (deal && deal.r_hash) {
      // we know this deal, proceed with the swap
      let cmdLnd: LndClient;

      switch (deal.makerCurrency) {
        case 'BTC':
          cmdLnd =  this.lndLtcClient;
          break;
        case 'LTC':
          cmdLnd = this.lndBtcClient;
          break;
        default:
          // TODO: handle unsupported currency
          return;
      }

      const request = new lndrpc.SendRequest();
      request.setAmt(deal.takerAmount);
      request.setDestString(deal.takerPubKey);
      request.setPaymentHashString(deal.r_hash);

      // TODO: use timeout on call

      try {
        const sendPaymentResponse = await cmdLnd.sendPaymentSync(request);
        if (sendPaymentResponse.getPaymentError()) {
          throw sendPaymentResponse.getPaymentError();
        }

        // swap succeeded!
        const r_preimage = Buffer.from(sendPaymentResponse.getPaymentPreimage_asB64(), 'base64').toString('hex');
        this.logger.debug(`swap succeeded! ${r_preimage}`);
        this.emit('swap.completed');
        responseBody = {
          r_preimage,
        };
      } catch (err) {
        this.logger.error(`Got exception from sendPaymentSync ${JSON.stringify(request.toObject())}`, err);
        this.emit('swap.failed');
      }
    } else {
      // this is not a valid deal
      // TODO: respond with a failure message, possibly penalize peer
    }

    const responsePacket = new packets.SwapResponsePacket(responseBody, requestPacket.header.id);

    this.logger.debug('Sending swap response to peer: ' + JSON.stringify(responseBody));

    peer.sendPacket(responsePacket);
  }

  private handleSwapResponse = (response: packets.SwapResponsePacket): void  => {
    // TODO: Remove this method/packet after we detect successful swap on invoice event
    if (!response.body || !response.body.r_preimage) {
      this.emit('swapFailed');
      return;
    }
    this.emit('swapCompleted');
    this.logger.debug('[SWAP] Swap completed. preimage = ' + response.body.r_preimage);
  }
}

export default Swaps;
export { SwapDeal };
