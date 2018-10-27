import { SwapPhase, SwapRole, SwapState } from '../types/enums';
import Peer from '../p2p/Peer';
import * as packets from '../p2p/packets/types';
import { createHash, randomBytes } from 'crypto';
import Logger from '../Logger';
import * as lndrpc from '../proto/lndrpc_pb';
import LndClient from '../lndclient/LndClient';
import Pool from '../p2p/Pool';
import { EventEmitter } from 'events';
import SwapRepository from './SwapRepository';
import { StampedOwnOrder, StampedPeerOrder, SwapResult, SwapDeal } from '../types/orders';
import assert from 'assert';
import { Models } from '../db/DB';
import { SwapDealInstance } from 'lib/types/db';

type OrderToAccept = {
  quantityToAccept: number;
  price: number;
  localId: string;
};

interface Swaps {
  on(event: 'swap.paid', listener: (swapResult: SwapResult) => void): this;
  on(event: 'swap.failed', listener: (deal: SwapDeal) => void): this;
  emit(event: 'swap.paid', swapResult: SwapResult): boolean;
  emit(event: 'swap.failed', deal: SwapDeal): boolean;
}

class Swaps extends EventEmitter {
  /** A map between r_hash and swap deals. */
  private deals = new Map<string, SwapDeal>();
  private usedHashes = new Set<string>();
  private repository: SwapRepository;

  constructor(private logger: Logger, private models: Models, private pool: Pool, private lndBtcClient: LndClient, private lndLtcClient: LndClient) {
    super();
    this.repository = new SwapRepository(this.models);
    this.bind();
  }

  /**
   * Calculates the amount of subunits/satoshis each side of a swap should receive.
   * @param quantity the quantity of the taker's order
   * @param price the price specified by the maker order being filled
   */
  private static calculateSwapAmounts = (quantity: number, price: number) => {
    // TODO: use configurable amount of subunits/satoshis per token for each currency
    const takerAmount = Math.round(quantity * price * 100000000);
    const makerAmount = Math.round(quantity * 100000000);

    return { takerAmount, makerAmount };
  }

  public init = async () => {
    // Load Swaps from data base
    const result = await this.repository.getSwapDeals();
    result.forEach((deal: SwapDeal) => {
      this.usedHashes.add(deal.r_hash);
    });
  }

  private bind() {
    this.pool.on('packet.swapResponse', this.handleSwapResponse);
    this.pool.on('packet.swapComplete', this.handleSwapComplete);
    this.pool.on('packet.swapError', this.handleSwapError);
  }

  /**
   * Checks if there exist active swap clients for both currencies in a given trading pair.
   * @returns `true` if the pair has swap support, `false` otherwise
   */
  public isPairSupported = (pairId: string): boolean => {
    // TODO: implement generic way of checking pair
    return pairId === 'LTC/BTC' && this.lndBtcClient.isConnected() && this.lndLtcClient.isConnected();
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
   * Saves deal to database and deletes from memory.
   * @param deal The deal to persist.
   */
  private persistDeal = async (deal: SwapDeal) => {
    if (this.usedHashes.has(deal.r_hash)) {
      await this.repository.addSwapDeal(deal);
      this.removeDeal(deal);
    }
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
   * Checks if a swap for two given orders can be executed.
   * @returns `true` if the swap can be executed, `false` otherwise
   */
  private verifyExecution = (maker: StampedPeerOrder, taker: StampedOwnOrder): boolean => {
    if (maker.pairId !== taker.pairId || !this.isPairSupported(maker.pairId)) {
      return false;
    }

    // TODO: check route to peer. Maybe there is no route or no capacity to send the amount

    return true;
  }

  /**
   * A promise wrapper for a swap procedure
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   * @returns A promise that is resolved once the swap is completed, or rejects otherwise
   */
  public executeSwap = (maker: StampedPeerOrder, taker: StampedOwnOrder): Promise<SwapResult> => {
    return new Promise((resolve, reject) => {
      if (!this.verifyExecution(maker, taker)) {
        reject();
        return;
      }

      const cleanup = () => {
        this.removeListener('swap.paid', onPaid);
        this.removeListener('swap.failed', onFailed);
      };

      const onPaid = (swapResult: SwapResult) => {
        if (swapResult.r_hash === r_hash) {
          cleanup();
          resolve(swapResult);
        }
      };

      const onFailed = (deal: SwapDeal) => {
        if (deal.r_hash === r_hash) {
          cleanup();
          reject();
        }
      };

      const r_hash = this.beginSwap(maker, taker);
      if (!r_hash) {
        reject();
        return;
      }

      this.on('swap.paid', onPaid);
      this.on('swap.failed', onFailed);
    });
  }

  /**
   * Begins a swap to fill an order by sending a [[SwapRequestPacket]] to the maker.
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   * @returns the r_hash for the swap
   */
  private beginSwap = (maker: StampedPeerOrder, taker: StampedOwnOrder) => {
    const peer = this.pool.getPeer(maker.peerPubKey);

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
    const { takerAmount, makerAmount } = Swaps.calculateSwapAmounts(taker.quantity, maker.price);
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
      price: maker.price,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      errorReason: '',
      r_preimage: preimage.toString('hex'),
      role: SwapRole.Taker,
      createTime: Date.now(),
    };

    this.addDeal(deal);

    // Verify LND setup. Make sure we are connected to BTC and LTC and that
    // the peer is also connected to these networks.
    const errMsg = this.verifyLndSetup(deal, peer);
    if (errMsg) {
      this.logger.error(errMsg);
      this.setDealState(deal, SwapState.Error, errMsg);
      return;
    }
    peer.sendPacket(new packets.SwapRequestPacket(swapRequestBody));

    this.setDealPhase(deal, SwapPhase.SwapRequested);
    return deal.r_hash;
  }

  /**
   * Accepts a proposed deal for a specified amount if a route and CLTV delta could be determined
   * for the swap. Stores the deal in the local collection of deals.
   * @returns A promise resolving to `true` if the deal was accepted, `false` otherwise.
   */
  public acceptDeal = async (orderToAccept: OrderToAccept, requestPacket: packets.SwapRequestPacket, peer: Peer): Promise<boolean> => {
    // TODO: max cltv to limit routes
    // TODO: consider the time gap between taking the routes and using them.
    // TODO: multi route support (currently only 1)
    // TODO: check to make sure we don't already have a deal for the requested r_hash
    const requestBody = requestPacket.body!;

    const takerPubKey = peer.getLndPubKey(requestBody.takerCurrency)!;

    const deal: SwapDeal = {
      ...requestBody,
      takerPubKey,
      peerPubKey: peer.nodePubKey!,
      price: orderToAccept.price,
      localOrderId: orderToAccept.localId,
      quantity: orderToAccept.quantityToAccept,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      errorReason: '',
      r_hash: requestBody.r_hash,
      role: SwapRole.Maker,
      createTime: Date.now(),
    };

    // add the deal. Going forward we can "record" errors related to this deal.
    this.addDeal(deal);

    // Verifies LND setup. Make sure we are connected to BTC and LTC and that
    // the peer is also connected to these networks.
    const errMsg = this.verifyLndSetup(deal, peer);
    if (errMsg) {
      this.setDealState(deal, SwapState.Error, errMsg);
      this.sendErrorToPeer(peer, deal.r_hash, deal.errorReason, requestPacket.header.id);
      return false;
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
        this.setDealState(deal, SwapState.Error, 'Can not swap. Unsupported taker currency.');
        this.sendErrorToPeer(peer, deal.r_hash, deal.errorReason, requestPacket.header.id);
        return false;
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
        this.setDealState(deal, SwapState.Error, 'Can not swap. unable to find route to destination.');
        this.sendErrorToPeer(peer, deal.r_hash, deal.errorReason, requestPacket.header.id);
        return false;
      }
    } catch (err) {
      this.setDealState(deal, SwapState.Error, 'Can not swap. unable to find route to destination: ' + err.message);
      this.sendErrorToPeer(peer, deal.r_hash, deal.errorReason, requestPacket.header.id);
      return false;
    }

    try {
      const info = await lndclient.getInfo();
      height = info.getBlockHeight();
      this.logger.debug('got block height of ' + height);
    } catch (err) {
      this.setDealState(deal, SwapState.Error, 'Can not swap. Unable to fetch block height: ' + err.message);
      this.sendErrorToPeer(peer, deal.r_hash, deal.errorReason, requestPacket.header.id);
      return false;
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
    this.setDealPhase(deal, SwapPhase.SwapAgreed);
    return true;
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
      deal.quantity = quantity; // set the accepted quantity for the deal
      if (quantity <= 0) {
        // TODO: accepted quantity must be a positive number, abort deal and penalize peer
      } else if (quantity > deal.proposedQuantity) {
        // TODO: accepted quantity should not be greater than proposed quantity, abort deal and penalize peer
      } else if (quantity < deal.proposedQuantity) {
        // TODO: handle partial acceptance
        // the maker accepted only part of our swap request, adjust the deal amounts
        // const { takerAmount, makerAmount } = Swaps.calculateSwapAmounts(quantity, deal.price);
        // deal.takerAmount = takerAmount;
        // deal.makerAmount = makerAmount;
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
      this.setDealPhase(deal,  SwapPhase.AmountSent);
      const sendPaymentResponse = await cmdLnd.sendPaymentSync(request);
      if (sendPaymentResponse.getPaymentError()) {
        throw new Error(sendPaymentResponse.getPaymentError());
      }

      const r_preimage = Buffer.from(sendPaymentResponse.getPaymentPreimage_asB64(), 'base64').toString('hex');
      // TODO: check r_preimage vs deal.preImage
      // swap succeeded!
      this.setDealPhase(deal, SwapPhase.SwapCompleted);
      const responseBody: packets.SwapCompletePacketBody = { r_hash };

      this.logger.debug('Sending swap complete to peer: ' + JSON.stringify(responseBody));
      peer.sendPacket(new packets.SwapCompletePacket(responseBody));

    } catch (err) {
      this.logger.error(`Got exception from sendPaymentSync ${JSON.stringify(request.toObject())}`, err.message);
      this.setDealState(deal, SwapState.Error, err.message);
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

    switch (deal.role) {
      case SwapRole.Maker:
        expectedAmount = deal.makerAmount;
        cltvDelta = deal.makerCltvDelta!;
        source = 'Taker';
        destination = 'Maker';
        break;
      case SwapRole.Taker:
        expectedAmount = deal.takerAmount;
        cltvDelta = deal.takerCltvDelta;
        source = 'Maker';
        destination = 'Taker';
        break;
      default:
        this.setDealState(deal, SwapState.Error,
          'Unknown role detected');
        return false;
    }
    // convert expected amount to mSat
    expectedAmount = expectedAmount * 1000;

    if (amount < expectedAmount) {
      this.logger.error('received ' + amount + ' mSat, expected ' + expectedAmount + ' mSat');
      this.setDealState(deal, SwapState.Error,
          'Amount sent from ' + source + ' to ' + 'destination' + 'is too small');
      return false;
    }

    if (cltvDelta > resolveRequest.getTimeout() - resolveRequest.getHeightNow()) {
      this.logger.error('got timeout ' + resolveRequest.getTimeout() + ' at height ' + resolveRequest.getHeightNow());
      this.logger.error('cltvDelta is ' + (resolveRequest.getTimeout() - resolveRequest.getHeightNow()) +
          ' expected delta of ' + cltvDelta);
      this.setDealState(deal, SwapState.Error,
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
      return deal.errorReason;
    }

    if (deal.role === SwapRole.Maker) {
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
      request.setRoutesList(deal.makerToTakerRoutes ? deal.makerToTakerRoutes : []);
      request.setPaymentHashString(deal.r_hash);

      try {
        this.setDealPhase(deal, SwapPhase.AmountSent);
        const response = await cmdLnd.sendToRouteSync(request);
        if (response.getPaymentError()) {
          this.logger.error('Got error from sendPaymentSync: ' + response.getPaymentError() + ' ' + JSON.stringify(request.toObject()));
          this.setDealState(deal, SwapState.Error, response.getPaymentError());
          return response.getPaymentError();
        }

        deal.r_preimage = Buffer.from(response.getPaymentPreimage_asB64(), 'base64').toString('hex');
        this.setDealPhase(deal, SwapPhase.AmountReceived);
        return deal.r_preimage;
      } catch (err) {
        this.logger.error('Got exception from sendPaymentSync: ' + ' ' + JSON.stringify(request.toObject()) + err.message);
        this.setDealState(deal, SwapState.Error, err.message);
        return 'Got exception from sendPaymentSync' + err.message;
      }
    } else {
      // If we are here we are the taker
      this.logger.debug('Executing taker code');

      this.setDealPhase(deal, SwapPhase.AmountReceived);
      return deal.r_preimage;
    }

  }

  private setDealState = (deal: SwapDeal, newState: SwapState, newStateReason: string): void => {
    // If we are already in error state and got another error report we
    // aggregate all error reasons by concatenation
    if (deal.state === newState && deal.state === SwapState.Error) {
      deal.errorReason = deal.errorReason + '; ' + newStateReason;
      this.logger.debug('new deal state reason: ' + deal.errorReason);
      return;
    }
    assert(deal.state === SwapState.Active, 'deal is not Active. Can not change deal state');
    deal.state = newState;
    deal.errorReason = newStateReason;
    if (deal.state === SwapState.Error) {
      this.emit('swap.failed', deal);
    }
  }

  private setDealPhase = (deal: SwapDeal, newPhase: SwapPhase): void => {
    assert(deal.state === SwapState.Active, 'deal is not Active. Can not change deal phase');

    switch (newPhase) {
      case SwapPhase.SwapCreated:
        assert(false, 'can not set deal phase to SwapCreated.');
        break;
      case SwapPhase.SwapRequested:
        assert(deal.role === SwapRole.Taker, 'SwapRequested can only be set by the taker');
        assert(deal.phase === SwapPhase.SwapCreated, 'SwapRequested can be only be set after SwapCreated');
        this.logger.debug('Requesting deal: ' + JSON.stringify(deal));
        break;
      case SwapPhase.SwapAgreed:
        assert(deal.role === SwapRole.Maker, 'SwapAgreed can only be set by the maker');
        assert(deal.phase === SwapPhase.SwapCreated, 'SwapAgreed can be only be set after SwapCreated');
        this.logger.debug('Sending swap response to peer ');
        break;
      case SwapPhase.AmountSent:
        assert(deal.role === SwapRole.Taker && deal.phase === SwapPhase.SwapRequested ||
          deal.role === SwapRole.Maker && deal.phase === SwapPhase.SwapAgreed,
            'AmountSent can only be set after SwapRequested (taker) or SwapAgreed (maker)');
        deal.executeTime = Date.now();
        break;
      case SwapPhase.AmountReceived:
        assert(deal.phase === SwapPhase.AmountSent, 'AmountReceived can be only be set after AmountSent');
        this.logger.debug('Amount received for preImage ' + deal.r_preimage);
        break;
      case SwapPhase.SwapCompleted:
        assert(deal.phase === SwapPhase.AmountReceived, 'SwapCompleted can be only be set after AmountReceived');
        deal.completeTime = Date.now();
        this.setDealState(deal, SwapState.Completed, 'Swap completed. preimage = ' + deal.r_preimage);
        this.logger.debug('Swap completed. preimage = ' + deal.r_preimage);
        break;
      default:
        assert(false, 'unknown deal phase');
    }

    deal.phase = newPhase;

    if (deal.phase === SwapPhase.AmountReceived) {
      const swapResult = {
        orderId: deal.orderId,
        localId: deal.localOrderId,
        pairId: deal.pairId,
        quantity: deal.quantity!,
        amountReceived: deal.makerAmount,
        amountSent: deal.takerAmount,
        r_hash: deal.r_hash,
        peerPubKey: deal.peerPubKey,
        role: deal.role,
      };
      this.emit('swap.paid', swapResult);
    }
  }

  private handleSwapComplete = async (response: packets.SwapCompletePacket): Promise<void>   => {
    const { r_hash } = response.body!;
    const deal = this.getDeal(r_hash);
    if (!deal) {
      this.logger.error(`received swap complete for unknown deal r_hash ${r_hash}`);
      return;
    }
    this.setDealPhase(deal, SwapPhase.SwapCompleted);
    await this.persistDeal(deal);
  }

  private handleSwapError = async (error: packets.SwapErrorPacket): Promise<void> => {
    const { r_hash, errorMessage } = error.body!;
    const deal = this.getDeal(r_hash);
    if (!deal) {
      this.logger.error(`received swap error for unknown deal r_hash ${r_hash}`);
      return;
    }
    this.setDealState(deal, SwapState.Error, errorMessage);
    await this.persistDeal(deal);
  }

}

export default Swaps;
