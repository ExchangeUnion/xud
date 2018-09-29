import { SwapDealPhase, SwapDealRole, SwapDealState } from '../types/enums';
import Peer from '../p2p/Peer';
import * as packets from '../p2p/packets/types';
import { createHash, randomBytes } from 'crypto';
import Logger from '../Logger';
import * as lndrpc from '../proto/lndrpc_pb';
import LndClient from '../lndclient/LndClient';
import Pool from '../p2p/Pool';
import { EventEmitter } from 'events';
import { StampedOwnOrder, StampedPeerOrder, SwapResult } from '../types/orders';
import assert from 'assert';

type SwapDeal = {
  /** The role of the local node in the swap. */
  myRole: SwapDealRole;
  /** The most updated deal phase */
  phase: SwapDealPhase;
  /** The most updated deal state. State works
   * together with the phase to indicates the phase of the deal in it's
   * life cycle and if the deal is active, errored or completed.
   */
  state: SwapDealState;
  /** The reason for being in the current state. */
  stateReason: string;
  /** The xud node pub key of the counterparty to this swap deal. */
  peerPubKey: string;
  /** The global order id in the XU network for the order being executed. */
  orderId: string;
  /** The local id for the order being executed. */
  localOrderId: string;
  /** The quantity of the order to execute as proposed by the taker. Negative when the taker is selling. */
  // TODO: is it needed here? if yes, should be in satoshis
  proposedQuantity: number;
  /** The accepted quantity of the order to execute as accepted by the maker. Negative when the taker is selling. */
  quantity?: number;
  /** The trading pair of the order. The pairId together with the orderId are needed to find the deal in orderBook. */
  pairId: string;
  /** The number of satoshis (or equivalent) the taker is expecting to receive. */
  takerAmount: number;
  /** The currency the taker is expecting to receive. */
  takerCurrency: string;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey?: string;
  /** The CLTV delta from the current height that should be used to set the timelock for the final hop when sending to taker. */
  takerCltvDelta: number;
  /** The number of satoshis (or equivalent) the maker is expecting to receive. */
  makerAmount: number;
  /** The currency the maker is expecting to receive. */
  makerCurrency: string;
  /** The CLTV delta from the current height that should be used to set the timelock for the final hop when sending to maker. */
  makerCltvDelta?: number;
  /** The hash of the preimage. */
  r_hash: string;
  r_preimage?: string;
  /** The routes the maker should use to send to the taker. */
  makerToTakerRoutes?: lndrpc.Route[];
  createTime: number;
  executeTime?: number;
  competionTime?: number
};

interface Swaps {
  // TODO: put swap.rejected and swap.accepted to work or delete them.
  on(event: 'swap.rejected', listener: (deal: SwapDeal) => void): this;
  on(event: 'swap.accepted', listener: (deal: SwapDeal, quantity: number) => void): this;
  on(event: 'swap.paid', listener: (deal: SwapResult) => void): this;
  on(event: 'swap.failed', listener: (deal: SwapDeal) => void): this;
  emit(event: 'swap.rejected', deal: SwapDeal): boolean;
  emit(event: 'swap.accepted', deal: SwapDeal, quantity: number): boolean;
  emit(event: 'swap.paid', swapResult: SwapResult): boolean;
  emit(event: 'swap.failed', deal: SwapDeal): boolean;
}

class Swaps extends EventEmitter {
  /** A map between r_hash and swap deals. */
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
  private static calculateSwapAmounts = (quantity: number, price: number, isBuyOrder: boolean) => {
    let takerAmount: number;
    let makerAmount: number;
    // TODO: use configurable amount of subunits/satoshis per token for each currency
    if (isBuyOrder) {
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
    this.pool.on('packet.swapRequest', this.handleSwapRequest);
    this.pool.on('packet.swapResponse', this.handleSwapResponse);
    this.pool.on('packet.swapComplete', this.handleSwapComplete);
    this.pool.on('packet.swapError', this.handleSwapError);
  }

  /**
   * Verifies that the order still exists on orderBook
   */
  // TODO: replace the dummy implementation with real order book integration
  private isOrderOnBook = (pairId: string, orderId: string): boolean => {
    this.logger.debug('checking order book for ' + pairId + ':' + orderId);
    return true;
  }

  /**
   * Verifies that the order still exists on orderBook
   */
  // TODO: replace the dummy implementation with real order book integration
  private checkAndHoldAmount = (deal: SwapDeal): number => {
    this.logger.debug('checking and holding amount for swap ' + deal.pairId + ':' + deal.orderId + ':' + deal.takerAmount);
    return deal.takerAmount;
  }

  /**
   * Sends an error to peer. set reqId if packet is a response to a request.
   */
  private sendErrorToPeer = (peer: Peer, r_hash: string, errorMessage: string, reqId?: string) => {
    const errorBody: packets.SwapErrorPacketBody = {
      r_hash,
      errorMessage,
    };
    this.logger.debug('Sending swap error to peer: ' + JSON.stringify(errorBody));
    peer.sendPacket(new packets.SwapErrorPacket(errorBody, reqId));
    return;
  }

  /**
   * Verifies LND setup. Make sure we are connected to BTC and LTC and that
   * the peer is also connected to these networks. Returns an error message
   * or undefined in case all is good.
   */
  private verifyLndSetup = (deal: SwapDeal, peer: Peer) => {
    if (!peer.getLndPubKey(deal.takerCurrency)) {
      return 'peer did not provide an LND PubKey for ' + deal.takerCurrency;
    }

    if (!peer.getLndPubKey(deal.makerCurrency)) {
      return 'peer did not provide an LND PubKey for ' + deal.makerCurrency;
    }

    // verify that this node is connected to BTC and LTC networks
    if (!this.lndLtcClient.isConnected()) {
      return 'Can not swap. Not connected to LTC network';
    }

    if (!this.lndBtcClient.isConnected()) {
      return 'Can not swap. Not connected to BTC network';
    }

    return;
  }

  /**
   * Gets a deal by its r_hash value.
   * @param r_hash The r_hash value of the deal to get.
   * @returns A deal if one is found, otherwise undefined.
   */
  public getDeal = (r_hash: string): SwapDeal | undefined => {
    return this.deals.get(r_hash);
  }

  public addDeal = (deal: SwapDeal) => {
    this.deals.set(deal.r_hash, deal);
    this.logger.debug('New deal: ' + JSON.stringify(deal));
  }

  public removeDeal = (deal: SwapDeal) => {
    this.deals.delete(deal.r_hash);
  }

  /**
   * Begins a swap to fill an order by sending a [[SwapRequestPacket]] to the maker.
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   * @returns the r_hash for the swap
   */
  public beginSwap = (maker: StampedPeerOrder, taker: StampedOwnOrder) => {
    const peer = this.pool.getPeer(maker.peerPubKey);

    // TODO: check route to peer. Maybe there is no route or no capacity to send the amount
    // TODO: what is the status of the order here? is it off the book? What if partial match
    //       do we create another order which has the same orderId?
    // TODO: check that pairID is LTC/BTC or handleSwapResponse fails

    const [baseCurrency, quoteCurrency] = maker.pairId.split('/');

    let takerCurrency: string;
    let makerCurrency: string;
    if (taker.isBuy) {
      // we are buying the base currency
      takerCurrency = baseCurrency;
      makerCurrency = quoteCurrency;
    } else {
      // we are selling the base currency
      takerCurrency = quoteCurrency;
      makerCurrency = baseCurrency;
    }

    let takerCltvDelta = 0;
    switch (takerCurrency) {
      case 'BTC':
        takerCltvDelta = this.lndBtcClient.cltvDelta;
        break;
      case 'LTC':
        takerCltvDelta = this.lndLtcClient.cltvDelta;
        break;
    }
    const { takerAmount, makerAmount } = Swaps.calculateSwapAmounts(taker.quantity, maker.price, taker.isBuy);
    const preimage = randomBytes(32);

    const swapRequestBody: packets.SwapRequestPacketBody = {
      takerCurrency,
      makerCurrency,
      takerAmount,
      makerAmount,
      takerCltvDelta,
      r_hash: createHash('sha256').update(preimage).digest('hex'),
      orderId: maker.id,
      pairId: maker.pairId,
      proposedQuantity: taker.quantity,
    };

    const deal: SwapDeal = {
      ...swapRequestBody,
      peerPubKey: peer.nodePubKey!,
      localOrderId: taker.localId,
      phase: SwapDealPhase.SwapCreated,
      state: SwapDealState.Active,
      stateReason: '',
      r_preimage: preimage.toString('hex'),
      myRole: SwapDealRole.Taker,
      createTime: Date.now(),
    };

    this.addDeal(deal);

    // Verify LND setup. Make sure we are connected to BTC and LTC and that
    // the peer is also connected to these networks.
    const errMsg = this.verifyLndSetup(deal, peer);
    if (errMsg) {
      this.logger.error(errMsg);
      this.setDealState(deal, SwapDealState.Error, errMsg);
      return;
    }
    peer.sendPacket(new packets.SwapRequestPacket(swapRequestBody));

    this.setDealPhase(deal, SwapDealPhase.SwapRequested);
    return deal.r_hash;
  }

  /**
   * Handles a request from a peer to create a swap deal. Creates a deal,
   * and stores the deal in the local collection of deals. Responds to the peer with a swap response packet.
   */
  private handleSwapRequest = async (requestPacket: packets.SwapRequestPacket, peer: Peer)  => {
    assert(requestPacket.body, 'SwapRequestPacket does not contain a body');
    const requestBody = requestPacket.body!;

    // TODO: consider reduced quantity
    // TODO: max cltv to limit routes
    // TODO: consider the time gap between taking the routes and using them.
    // TODO: multi route support (currenlt only 1)

    // check that we have such an order on book. If not, issue an error and forget
    if (!this.isOrderOnBook(requestBody.pairId, requestBody.orderId)) {
      this.sendErrorToPeer(peer, requestBody.r_hash,
          'order does not exist on book', requestPacket.header.id);
      return;
    }

    // accept the deal
    const deal: SwapDeal = {
      ...requestBody,
      peerPubKey: peer.nodePubKey!,
      localOrderId: '', // TODO: get local id from order book
      quantity: requestBody.proposedQuantity,
      phase: SwapDealPhase.SwapCreated,
      state: SwapDealState.Active,
      stateReason: '',
      takerPubKey: peer.getLndPubKey(requestBody.takerCurrency),
      r_hash: requestBody.r_hash,
      myRole: SwapDealRole.Maker,
      createTime: Date.now(),
    };

    // add the deal. Going forward we can "record" errors related to this deal.
    this.addDeal(deal);

    // Verifies LND setup. Make sure we are connected to BTC and LTC and that
    // the peer is also connected to these networks.
    const errMsg = this.verifyLndSetup(deal, peer);
    if (errMsg) {
      this.setDealState(deal, SwapDealState.Error, errMsg);
      this.sendErrorToPeer(peer, deal.r_hash, deal.stateReason, requestPacket.header.id);
      return;
    }

    const heldAmount = this.checkAndHoldAmount(deal);
    assert(heldAmount === 0 || heldAmount === deal.takerAmount,
        'Partial amount is not yet supported');
    if (heldAmount === 0) {
      this.setDealState(deal, SwapDealState.Error, 'Can not swap. No capacity is available');
      this.sendErrorToPeer(peer, deal.r_hash, deal.stateReason, requestPacket.header.id);
      return;
    }

    let lndclient: LndClient;
    switch (deal.takerCurrency) {
      case 'BTC':
        lndclient = this.lndBtcClient;
        break;
      case 'LTC':
        lndclient = this.lndLtcClient;
        break;
      default:
        this.setDealState(deal, SwapDealState.Error, 'Can not swap. Unsupported Taker currency.');
        this.sendErrorToPeer(peer, deal.r_hash, deal.stateReason, requestPacket.header.id);
        return;
    }

    let height: number;
    try {
      const req = new lndrpc.QueryRoutesRequest();
      req.setAmt(requestBody.takerAmount);
      req.setFinalCltvDelta(requestBody.takerCltvDelta);
      req.setNumRoutes(1);
      req.setPubKey(peer.getLndPubKey(requestBody.takerCurrency)!);
      const routes = await lndclient.queryRoutes(req);
      deal.makerToTakerRoutes = routes.getRoutesList();
      this.logger.debug('got ' + deal.makerToTakerRoutes.length + ' routes to destination: ' + deal.makerToTakerRoutes);
      if (deal.makerToTakerRoutes.length === 0) {
        this.setDealState(deal, SwapDealState.Error, 'Can not swap. unable to find route to destination.');
        this.sendErrorToPeer(peer, deal.r_hash, deal.stateReason, requestPacket.header.id);
        return;
      }
    } catch (err) {
      this.setDealState(deal, SwapDealState.Error, 'Can not swap. unable to find route to destination: ' + err.message);
      this.sendErrorToPeer(peer, deal.r_hash, deal.stateReason, requestPacket.header.id);
      return;
    }

    try {
      const info = await lndclient.getInfo();
      height = info.getBlockHeight();
      this.logger.debug('got block height of ' + height);
    } catch (err) {
      this.setDealState(deal, SwapDealState.Error, 'Can not swap. Unable to fetch block height: ' + err.message);
      this.sendErrorToPeer(peer, deal.r_hash, deal.stateReason, requestPacket.header.id);
      return;
    }

    const routeCltvDelta = deal.makerToTakerRoutes[0].getTotalTimeLock() - height;

    // cltvDelta can't be zero for both the LtcClient and BtcClient (checked in constructor)
    const cltvDeltaFactor = this.lndLtcClient.cltvDelta / this.lndBtcClient.cltvDelta;
    switch (requestBody.makerCurrency) {
      case 'BTC':
        deal.makerCltvDelta = this.lndBtcClient.cltvDelta + routeCltvDelta / cltvDeltaFactor;
        break;
      case 'LTC':
        deal.makerCltvDelta = this.lndLtcClient.cltvDelta + routeCltvDelta * cltvDeltaFactor;
        break;
    }

    this.logger.debug('total timelock of route = ' + routeCltvDelta + 'makerCltvDelta = ' + deal.makerCltvDelta);

    const responseBody: packets.SwapResponsePacketBody = {
      makerCltvDelta: deal.makerCltvDelta!,
      r_hash: requestBody.r_hash,
      quantity: requestBody.proposedQuantity,
    };

    peer.sendPacket(new packets.SwapResponsePacket(responseBody, requestPacket.header.id));
    this.setDealPhase(deal, SwapDealPhase.SwapAgreed);
  }

  /**
   * Handles a response from a peer to confirm a swap deal and updates the deal. If the deal is
   * accepted, initiates the swap.
   */
  private handleSwapResponse = async (responsePacket: packets.SwapResponsePacket, peer: Peer) => {
    assert(responsePacket.body, 'SwapResponsePacket does not contain a body');
    const { quantity, r_hash, makerCltvDelta } = responsePacket.body!;
    const deal = this.getDeal(r_hash);
    if (!deal) {
      this.logger.error(`received swap response for unrecognized deal r_hash ${r_hash}`);
      return;
    }

    // update deal with taker's makerCltvDelta
    deal.makerCltvDelta = makerCltvDelta;

    if (quantity) {
      // TODO: require a non-zero quantity value on accepted swap responses
      if (quantity > deal.proposedQuantity) {
        // TODO: this should not happen, abort deal and penalize peer
      } else if (quantity < deal.proposedQuantity) {
        // TODO: the maker accepted only part of our swap request, adjust the deal amounts with Swaps.calculateSwapAmounts
      }
    }

    let cmdLnd: LndClient;
    // running as taker
    switch (deal.makerCurrency) {
      case 'BTC':
        cmdLnd =  this.lndBtcClient;
        break;
      case 'LTC':
        cmdLnd = this.lndLtcClient;
        break;
      default:
        // Can't be if we check that pairID is LTC/BTC only (for now). Still...
        return;
    }
    const request = new lndrpc.SendRequest();
    const makerPubKey = peer.getLndPubKey(deal.makerCurrency)!;
    request.setAmt(deal.makerAmount);
    request.setDestString(makerPubKey);
    request.setPaymentHashString(deal.r_hash);
    request.setFinalCltvDelta(deal.makerCltvDelta);

    // TODO: use timeout on call

    try {
      this.setDealPhase(deal,  SwapDealPhase.AmountSent);
      const sendPaymentResponse = await cmdLnd.sendPaymentSync(request);
      if (sendPaymentResponse.getPaymentError()) {
        throw new Error(sendPaymentResponse.getPaymentError());
      }

      const r_preimage = Buffer.from(sendPaymentResponse.getPaymentPreimage_asB64(), 'base64').toString('hex');
      // TODO: check r_preimage vs deal.preImage
      // swap succeeded!
      this.setDealPhase(deal, SwapDealPhase.SwapCompleted);
      const responseBody: packets.SwapCompletePacketBody = { r_hash };

      this.logger.debug('Sending swap complete to peer: ' + JSON.stringify(responseBody));
      peer.sendPacket(new packets.SwapCompletePacket(responseBody));

    } catch (err) {
      this.logger.error(`Got exception from sendPaymentSync ${JSON.stringify(request.toObject())}`, err.message);
      this.setDealState(deal, SwapDealState.Error, err.message);
      this.sendErrorToPeer(peer, r_hash, err.message);
      return;
    }

  }

  /**
   * Verifies that the request from LND is valid. check the received amount vs
   * the expected amount and the CltvDelta vs the expected on.
   */
  private validateRequest = (deal: SwapDeal, resolveRequest: lndrpc.ResolveRequest)  => {
    const amount = resolveRequest.getAmount();
    let expectedAmount = 0;
    let cltvDelta = 0;
    let source: string;
    let destination: string;

    switch (deal.myRole) {
      case SwapDealRole.Maker:
        expectedAmount = deal.makerAmount;
        cltvDelta = deal.makerCltvDelta!;
        source = 'Taker';
        destination = 'Maker';
        break;
      case SwapDealRole.Taker:
        expectedAmount = deal.takerAmount;
        cltvDelta = deal.takerCltvDelta;
        source = 'Maker';
        destination = 'Taker';
        break;
      default:
        this.setDealState(deal, SwapDealState.Error,
          'Unknown role detected');
        return false;
    }
    // convert expected amount to mSat
    expectedAmount = expectedAmount * 1000;

    if (amount < expectedAmount) {
      this.logger.error('received ' + amount + ' mSat, expected ' + expectedAmount + ' mSat');
      this.setDealState(deal, SwapDealState.Error,
          'Amount sent from ' + source + ' to ' + 'destination' + 'is too small');
      return false;
    }

    if (cltvDelta > resolveRequest.getTimeout() - resolveRequest.getHeightNow()) {
      this.logger.error('got timeout ' + resolveRequest.getTimeout() + ' at height ' + resolveRequest.getHeightNow());
      this.logger.error('cltvDelta is ' + (resolveRequest.getTimeout() - resolveRequest.getHeightNow()) +
          ' expected delta of ' + cltvDelta);
      this.setDealState(deal, SwapDealState.Error,
          'cltvDelta sent from ' + source + ' to ' + 'destination' + 'is too small');
      return false;
    }
    return true;
  }
  /**
   * resolveHash resolve hash to preimage.
   */
  public resolveHash = async (resolveRequest: lndrpc.ResolveRequest) => {
    const hash = resolveRequest.getHash();

    this.logger.info('ResolveHash starting with hash: ' + hash);

    const deal = this.getDeal(hash);

    if (!deal) {
      const msg = `Something went wrong. Can't find deal: ${hash}`;
      this.logger.error(msg);
      return msg;
    }

    if (!this.validateRequest(deal, resolveRequest)) {
      return deal.stateReason;
    }

    if (deal.myRole === SwapDealRole.Maker) {
      // As the maker, I need to forward the payment to the other chain
	  this.logger.debug('Executing maker code');

      let cmdLnd = this.lndLtcClient;

      switch (deal.makerCurrency) {
        case 'BTC':
          break;
        case 'LTC':
          cmdLnd = this.lndBtcClient;
          break;
      }

      const request = new lndrpc.SendToRouteRequest();
      request.setRoutesList(deal.makerToTakerRoutes!);
      request.setPaymentHashString(deal.r_hash);

      try {
        this.setDealPhase(deal, SwapDealPhase.AmountSent);
        const response = await cmdLnd.sendToRouteSync(request);
        if (response.getPaymentError()) {
          this.logger.error('Got error from sendPaymentSync: ' + response.getPaymentError() + ' ' + JSON.stringify(request.toObject()));
          this.setDealState(deal, SwapDealState.Error, response.getPaymentError());
          return response.getPaymentError();
        }

        deal.r_preimage = Buffer.from(response.getPaymentPreimage_asB64(), 'base64').toString('hex');
        this.setDealPhase(deal, SwapDealPhase.AmountReceived);
        return deal.r_preimage;
      } catch (err) {
        this.logger.error('Got exception from sendPaymentSync: ' + ' ' + JSON.stringify(request.toObject()) + err.message);
        this.setDealState(deal, SwapDealState.Error, err.message);
        return 'Got exception from sendPaymentSync' + err.message;
      }
    } else {
      // If we are here we are the taker
      this.logger.debug('Executing taker code');

      this.setDealPhase(deal, SwapDealPhase.AmountReceived);
      return deal.r_preimage;
    }

  }

  private setDealState = (deal: SwapDeal, newState: SwapDealState, newStateReason: string): void => {
    // If we are already in error state and got another error report we
    // aggregate all error reasons by concatenation
    if (deal.state === newState && deal.state === SwapDealState.Error) {
      deal.stateReason = deal.stateReason + '; ' + newStateReason;
      this.logger.debug('new deal state reason: ' + deal.stateReason);
      return;
    }
    assert(deal.state === SwapDealState.Active, 'deal is not Active. Can not change deal state');
    deal.state = newState;
    deal.stateReason = newStateReason;
    if (deal.state === SwapDealState.Error) {
      this.emit('swap.failed', deal);
    }
  }

  private setDealPhase = (deal: SwapDeal, newPhase: SwapDealPhase): void => {
    assert(deal.state === SwapDealState.Active, 'deal is not Active. Can not change deal phase');

    switch (newPhase) {
      case SwapDealPhase.SwapCreated:
        assert(false, 'can not set deal phase to SwapCreated.');
        break;
      case SwapDealPhase.SwapRequested:
        assert(deal.myRole === SwapDealRole.Taker, 'SwapRequested can only be set by the taker');
        assert(deal.phase === SwapDealPhase.SwapCreated, 'SwapRequested can be only be set after SwapCreated');
        this.logger.debug('Requesting deal: ' + JSON.stringify(deal));
        break;
      case SwapDealPhase.SwapAgreed:
        assert(deal.myRole === SwapDealRole.Maker, 'SwapAgreed can only be set by the maker');
        assert(deal.phase === SwapDealPhase.SwapCreated, 'SwapAgreed can be only be set after SwapCreated');
        this.logger.debug('Sending swap response to peer ');
        break;
      case SwapDealPhase.AmountSent:
        assert(deal.myRole === SwapDealRole.Taker && deal.phase === SwapDealPhase.SwapRequested ||
          deal.myRole === SwapDealRole.Maker && deal.phase === SwapDealPhase.SwapAgreed,
            'AmountSent can only be set after SwapRequested (taker) or SwapAgreed (maker)');
        deal.executeTime = Date.now();
        break;
      case SwapDealPhase.AmountReceived:
        assert(deal.phase === SwapDealPhase.AmountSent, 'AmountReceived can be only be set after AmountSent');
        this.logger.debug('Amount received for preImage ' + deal.r_preimage);
        break;
      case SwapDealPhase.SwapCompleted:
        assert(deal.phase === SwapDealPhase.AmountReceived, 'SwapCompleted can be only be set after AmountReceived');
        deal.competionTime = Date.now();
        this.setDealState(deal, SwapDealState.Completed, 'Swap completed. preimage = ' + deal.r_preimage);
        this.logger.debug('Swap completed. preimage = ' + deal.r_preimage);
        break;
      default:
        assert(false, 'unknown deal phase');
    }

    deal.phase = newPhase;

    if (deal.phase === SwapDealPhase.AmountReceived) {
      const swapResult = {
        orderId: deal.orderId,
        localId: deal.localOrderId,
        pairId: deal.pairId,
        amountReceived: deal.makerAmount,
        amountSent: deal.takerAmount,
        r_hash: deal.r_hash,
        peerPubKey: deal.peerPubKey,
        role: deal.myRole,
      };
      this.emit('swap.paid', swapResult);
    }
  }

  private handleSwapComplete = (response: packets.SwapCompletePacket): void  => {
    const { r_hash } = response.body!;
    const deal = this.getDeal(r_hash);
    if (!deal) {
      this.logger.error(`received swap complete for unknown deal r_hash ${r_hash}`);
      return;
    }
    this.setDealPhase(deal, SwapDealPhase.SwapCompleted);
  }

  private handleSwapError = (error: packets.SwapErrorPacket): void  => {
    const { r_hash, errorMessage } = error.body!;
    const deal = this.getDeal(r_hash);
    if (!deal) {
      this.logger.error(`received swap error for unknown deal r_hash ${r_hash}`);
      return;
    }
    this.setDealState(deal, SwapDealState.Error, errorMessage);
  }

}

export default Swaps;
export { SwapDeal };
