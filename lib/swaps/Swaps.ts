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
  orderId: string;
  dealId: string;
  /** The quantity of the order to execute as proposed by the taker. Negative when the taker is selling. */
  proposedQuantity: number;
  /** The accepted quantity of the order to execute as accepted by the maker. Negative when the taker is selling. */
  quantity?: number;
  /** The trading pair of the order. */
  pairId: string;
  /** The number of satoshis (or equivalent) the taker is expecting to receive. */
  takerAmount?: number;
  /** The currency the taker is expecting to receive. */
  takerCurrency: string;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey: string;
  /** The number of satoshis (or equivalent) the maker is expecting to receive. */
  makerAmount?: number;
  /** The currency the maker is expecting to receive. */
  makerCurrency: string;
  /** Maker's lnd pubkey on the maker currency's network. */
  makerPubKey?: string;
  /** The hash of the preimage. */
  r_hash?: string;
  r_preimage?: string;
  createTime: number;
  executeTime?: number;
  competionTime?: number
};

interface Swaps {
  on(event: 'swap.rejected', listener: (deal: SwapDeal) => void): this;
  on(event: 'swap.accepted', listener: (deal: SwapDeal, quantity: number) => void): this;
  on(event: 'swap.completed', listener: (deal: SwapDeal) => void): this;
  on(event: 'swap.failed', listener: (deal: SwapDeal) => void): this;
  emit(event: 'swap.rejected', deal: SwapDeal): boolean;
  emit(event: 'swap.accepted', deal: SwapDeal, quantity: number): boolean;
  emit(event: 'swap.completed', deal: SwapDeal): boolean;
  emit(event: 'swap.failed', deal: SwapDeal): boolean;
}

class Swaps extends EventEmitter {
  /** A mapping containing two entries for each deal, one using dealId as a key and one using r_hash as a key. */
  private deals = new Map<string, SwapDeal>();

  constructor(private logger: Logger, private pool: Pool, private lndBtcClient: LndClient, private lndLtcClient: LndClient) {
    super();

    this.bind();
  }

  /**
   * Calculates the amount of subunits/satoshis each side of a swap should receive.
   * @param quantity the quantity of the taker's order
   * @param price the price specified by the maker order being filled
   */
  private static calculateSwapAmounts = (quantity: number, price: number) => {
    let takerAmount: number;
    let makerAmount: number;
    // TODO: use configurable amount of subunits/satoshis per token for each currency
    if (quantity > 0) {
      // taker is buying the base currency
      takerAmount = Math.round(quantity * 100000000);
      makerAmount = Math.round(quantity * price * 100000000);
    } else {
      // taker is selling the base currency
      takerAmount = Math.round(quantity * price * -100000000);
      makerAmount = Math.round(quantity * -100000000);
    }

    return { takerAmount, makerAmount };
  }

  private bind() {
    this.pool.on('packet.dealRequest', this.handleDealRequest);
    this.pool.on('packet.dealResponse', this.handleDealResponse);
    this.pool.on('packet.swapRequest', this.handleSwapRequest);
    this.pool.on('packet.swapResponse', this.handleSwapResponse);
  }

  /**
   * Gets a deal by its dealId or r_hash value.
   * @param dealIdOrHash The dealId or r_hash value of the deal to get.
   * @returns A deal if one is found, otherwise undefined.
   */
  public getDeal = (dealIdOrHash: string): SwapDeal | undefined => {
    return this.deals.get(dealIdOrHash);
  }

  public addDeal = (deal: SwapDeal) => {
    this.deals.set(deal.dealId, deal);
    if (deal.r_hash) {
      this.deals.set(deal.r_hash, deal);
    }
  }

  public removeDeal = (deal: SwapDeal) => {
    this.deals.delete(deal.dealId);
    if (deal.r_hash) {
      this.deals.delete(deal.r_hash);
    }
  }

  /**
   * Begins a swap to fill an order by sending a [[DealRequestPacket]] to the maker.
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   * @returns the deal id for the swap
   */
  public beginSwap = (maker: StampedPeerOrder, taker: StampedOwnOrder) => {
    const peer = this.pool.getPeer(maker.peerPubKey);

    const [baseCurrency, quoteCurrency] = maker.pairId.split('/');
    const dealId = uuidv1();

    let takerCurrency: string;
    let makerCurrency: string;
    if (taker.quantity > 0) {
      // we are buying the base currency
      takerCurrency = baseCurrency;
      makerCurrency = quoteCurrency;
    } else {
      // we are selling the base currency
      takerCurrency = quoteCurrency;
      makerCurrency = baseCurrency;
    }
    const { takerAmount, makerAmount } = Swaps.calculateSwapAmounts(taker.quantity, maker.price);

    const dealRequestBody: packets.DealRequestPacketBody = {
      dealId,
      takerCurrency,
      makerCurrency,
      takerAmount,
      makerAmount,
      takerPubKey: takerCurrency === 'BTC' ? this.pool.handshakeData.lndbtcPubKey! : this.pool.handshakeData.lndltcPubKey!,
      orderId: maker.id,
      pairId: maker.pairId,
      proposedQuantity: taker.quantity,
    };

    const deal: SwapDeal = {
      ...dealRequestBody,
      myRole : SwapDealRole.Taker,
      peerPubKey: this.pool.handshakeData.nodePubKey,
      createTime: Date.now(),
    };

    this.addDeal(deal);
    this.logger.debug('Initiating swap deal: ' + JSON.stringify(deal));

    const packet = new packets.DealRequestPacket(dealRequestBody);

    peer.sendPacket(packet);
    return dealId;
  }

  public executeSwap = (takerCurrency: string, makerCurrency: string, takerPubKey: string,
  takerAmount: number, makerAmount: number, peer: Peer) => {
    // TODO: Remove this method after we remove Service.executeSwap()
    const dealRequestBody: packets.DealRequestPacketBody = {
      takerCurrency,
      makerCurrency,
      takerPubKey,
      takerAmount,
      makerAmount,
      dealId: uuidv1(),
      pairId: '',
      orderId: '',
      proposedQuantity: 0,
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
      responsePacket = new packets.DealResponsePacket({ dealId: requestBody.dealId, quantity: 0 }, requestPacket.header.id);
    } else {
      // accept the deal
      const r_preimage = randomBytes(32);
      const hash = createHash('sha256');
      const r_hash = hash.update(r_preimage).digest('hex');

      // TODO: we always accept proposed quantity currently, put in checks to make sure we have the full amount available
      const quantity = requestBody.proposedQuantity;

      const deal: SwapDeal = {
        ...requestBody,
        makerPubKey,
        quantity,
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
        quantity,
        r_hash,
        dealId: requestBody.dealId,
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
    const { dealId, quantity, r_hash, makerPubKey } = responsePacket.body!;
    const deal = this.getDeal(dealId);
    if (!deal) {
      // TODO: add error handling for an unknown deal id
      this.logger.warn(`received deal response for unrecognized deal ${dealId}`);
      return;
    }

    if (!r_hash) {
      // Our deal request doesn't have a payment hash and therefore was rejected
      this.removeDeal(deal);
      this.emit('swap.rejected', deal);
      return;
    }

    if (quantity) {
      // TODO: require a non-zero quantity value on accepted deal responses
      if (quantity > deal.proposedQuantity) {
        // TODO: this should not happen, abort deal and penalize peer
      } else if (quantity < deal.proposedQuantity) {
        // TODO: the maker accepted only part of our deal request, adjust the deal amounts with Swaps.calculateSwapAmounts
      }
      this.emit('swap.accepted', deal, quantity);
    }
    deal.makerPubKey = makerPubKey;
    deal.r_hash = r_hash;
    this.deals.set(r_hash, deal);
    this.logger.debug('[SWAP] Updated deal: ' + JSON.stringify(deal));

    const swapRequestBody: packets.SwapRequestPacketBody = { dealId };
    const swapRequestPacket = new packets.SwapRequestPacket(swapRequestBody);

    this.logger.debug('Sending swap request to peer: ' + JSON.stringify(swapRequestBody));

    peer.sendPacket(swapRequestPacket);
  }

  /**
   * Handles a request from a peer to perform a swap. Performs the actual swap via lnd and sends
   * a [[SwapResponsePacketBody]] containing the preimage after it's complete.
   */
  private handleSwapRequest = async (requestPacket: packets.SwapRequestPacket, peer: Peer) => {
    const { dealId } = requestPacket.body!;
    let responseBody: packets.SwapResponsePacketBody = { dealId };
    const deal = this.getDeal(dealId);
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
      request.setAmt(deal.takerAmount!);
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
        this.emit('swap.completed', deal);
        responseBody = {
          r_preimage,
          dealId,
        };
      } catch (err) {
        this.logger.error(`Got exception from sendPaymentSync ${JSON.stringify(request.toObject())}`, err);
        this.emit('swap.failed', deal);
      }
    } else {
      // this is not a valid deal
      this.logger.warn(`received swap request for unrecognized deal ${dealId}`);
      // TODO: respond with a failure message, possibly penalize peer
    }

    const responsePacket = new packets.SwapResponsePacket(responseBody, requestPacket.header.id);

    this.logger.debug('Sending swap response to peer: ' + JSON.stringify(responseBody));

    peer.sendPacket(responsePacket);
  }

  private handleSwapResponse = (response: packets.SwapResponsePacket): void  => {
    // TODO: Remove this method/packet after we detect successful swap on invoice event
    const { dealId, r_preimage } = response.body!;
    const deal = this.getDeal(dealId);
    if (!deal) {
      this.logger.warn(`received swap response for unknown deal ${dealId}`);
      return;
    }
    if (!r_preimage) {
      this.emit('swap.failed', deal);
      return;
    }

    deal.r_preimage = r_preimage;
    this.emit('swap.completed', deal);
    this.logger.debug('[SWAP] Swap completed. preimage = ' + r_preimage);
  }
}

export default Swaps;
export { SwapDeal };
