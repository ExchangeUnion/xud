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
import { OwnOrder, PeerOrder } from '../types/orders';
import assert from 'assert';
import { Models } from '../db/DB';
import { SwapDealInstance } from 'lib/types/db';
import { SwapDeal, SwapResult } from './types';

type OrderToAccept = Pick<SwapDeal, 'quantity' | 'price' | 'localId' | 'isBuy'> & {
  quantity: number;
};

interface Swaps {
  on(event: 'swap.paid', listener: (swapResult: SwapResult) => void): this;
  on(event: 'swap.failed', listener: (deal: SwapDeal) => void): this;
  emit(event: 'swap.paid', swapResult: SwapResult): boolean;
  emit(event: 'swap.failed', deal: SwapDeal): boolean;
}

class Swaps extends EventEmitter {
  /** A map between payment hashes and swap deals. */
  private deals = new Map<string, SwapDeal>();
  private usedHashes = new Set<string>();
  private repository: SwapRepository;

  /** The number of satoshis in a bitcoin. */
  private static readonly SATOSHIS_PER_COIN = 100000000;

  constructor(private logger: Logger, private models: Models, private pool: Pool, private lndBtcClient: LndClient, private lndLtcClient: LndClient) {
    super();
    this.repository = new SwapRepository(this.models);
    this.bind();
  }

  /**
   * Derives the maker and taker currency for a swap.
   * @param pairId The trading pair id for the swap
   * @param isBuy Whether the maker order in the swap is a buy
   * @returns An object with the derived `makerCurrency` and `takerCurrency` values
   */
  private static deriveCurrencies = (pairId: string, isBuy: boolean) => {
    const [baseCurrency, quoteCurrency] = pairId.split('/');

    const makerCurrency = isBuy ? baseCurrency : quoteCurrency;
    const takerCurrency = isBuy ? quoteCurrency : baseCurrency;
    return { makerCurrency, takerCurrency };
  }

  /**
   * Checks if a swap request is valid. This is a shallow check that only detects critical
   * inconsistencies and verifies only whether the request can possibly lead to a successful swap.
   * @returns `true` if the request is valid, otherwise `false`
   */
  public static validateSwapRequest = ({ proposedQuantity, rHash }: packets.SwapRequestPacketBody) => {
    // proposed quantity must be a positive number
    // rHash must be exactly 64 characters
    return proposedQuantity > 0 && rHash.length === 64;
  }

  /**
   * Calculates the amount of subunits/satoshis each side of a swap should receive.
   * @param quantity The quantity being swapped
   * @param price The price for the swap
   * @param isBuy Whether the maker order in the swap is a buy
   * @returns An object with the calculated `makerAmount` and `takerAmount` values
   */
  private static calculateSwapAmounts = (quantity: number, price: number, isBuy: boolean) => {
    // TODO: use configurable amount of subunits/satoshis per token for each currency
    const baseCurrencyAmount = Math.round(quantity * Swaps.SATOSHIS_PER_COIN);
    const quoteCurrencyAmount = Math.round(quantity * price * Swaps.SATOSHIS_PER_COIN);
    const makerAmount = isBuy ? baseCurrencyAmount : quoteCurrencyAmount;
    const takerAmount = isBuy ? quoteCurrencyAmount : baseCurrencyAmount;
    return { makerAmount, takerAmount };
  }

  public init = async () => {
    // Load Swaps from data base
    const result = await this.repository.getSwapDeals();
    result.forEach((deal: SwapDealInstance) => {
      this.usedHashes.add(deal.rHash);
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
   * Sends an error to peer. Sets reqId if packet is a response to a request.
   */
  private sendErrorToPeer = (peer: Peer, rHash: string, errorMessage: string, reqId?: string) => {
    const errorBody: packets.SwapFailedPacketBody = {
      rHash,
      errorMessage,
    };
    this.logger.debug('Sending swap error to peer: ' + JSON.stringify(errorBody));
    peer.sendPacket(new packets.SwapFailedPacket(errorBody, reqId));
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
    if (this.usedHashes.has(deal.rHash)) {
      await this.repository.addSwapDeal(deal);
      this.removeDeal(deal);
    }
  }

  /**
   * Gets a deal by its rHash value.
   * @param rHash The rHash value of the deal to get.
   * @returns A deal if one is found, otherwise undefined.
   */
  public getDeal = (rHash: string): SwapDeal | undefined => {
    return this.deals.get(rHash);
  }

  public addDeal = (deal: SwapDeal) => {
    this.deals.set(deal.rHash, deal);
    this.logger.debug('New deal: ' + JSON.stringify(deal));
  }

  public removeDeal = (deal: SwapDeal) => {
    this.deals.delete(deal.rHash);
  }

  /**
   * Checks if a swap for two given orders can be executed.
   * @returns `true` if the swap can be executed, `false` otherwise
   */
  private verifyExecution = (maker: PeerOrder, taker: OwnOrder): boolean => {
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
  public executeSwap = (maker: PeerOrder, taker: OwnOrder): Promise<SwapResult> => {
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
        if (swapResult.rHash === rHash) {
          cleanup();
          resolve(swapResult);
        }
      };

      const onFailed = (deal: SwapDeal) => {
        if (deal.rHash === rHash) {
          cleanup();
          reject();
        }
      };

      const rHash = this.beginSwap(maker, taker);
      if (!rHash) {
        reject();
        return;
      }

      this.on('swap.paid', onPaid);
      this.on('swap.failed', onFailed);
    });
  }

  /**
   * Begins a swap to fill an order by sending a [[SwapRequestPacket]] to the maker.
   * @param maker The remote maker order we are filling
   * @param taker Our local taker order
   * @returns The rHash for the swap, or `undefined` if the swap could not be initiated
   */
  private beginSwap = (maker: PeerOrder, taker: OwnOrder) => {
    const peer = this.pool.getPeer(maker.peerPubKey);

    const { makerCurrency, takerCurrency } = Swaps.deriveCurrencies(maker.pairId, maker.isBuy);

    const quantity = Math.min(maker.quantity, taker.quantity);
    const { makerAmount, takerAmount } = Swaps.calculateSwapAmounts(quantity, maker.price, maker.isBuy);

    let takerCltvDelta = 0;
    switch (takerCurrency) {
      case 'BTC':
        takerCltvDelta = this.lndBtcClient.cltvDelta;
        break;
      case 'LTC':
        takerCltvDelta = this.lndLtcClient.cltvDelta;
        break;
    }
    const preimage = randomBytes(32);

    const swapRequestBody: packets.SwapRequestPacketBody = {
      takerCltvDelta,
      rHash: createHash('sha256').update(preimage).digest('hex'),
      orderId: maker.id,
      pairId: maker.pairId,
      proposedQuantity: taker.quantity,
    };

    const deal: SwapDeal = {
      ...swapRequestBody,
      takerCurrency,
      makerCurrency,
      takerAmount,
      makerAmount,
      peerPubKey: peer.nodePubKey!,
      localId: taker.localId,
      price: maker.price,
      isBuy: maker.isBuy,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      rPreimage: preimage.toString('hex'),
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
    return deal.rHash;
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

    if (this.usedHashes.has(requestPacket.body!.rHash)) {
      this.sendErrorToPeer(peer, requestPacket.body!.rHash, 'this rHash already exists', requestPacket.header.id);
      return false;
    }
    const requestBody = requestPacket.body!;

    const { quantity, price, isBuy } = orderToAccept;

    const { makerAmount, takerAmount } = Swaps.calculateSwapAmounts(quantity, price, isBuy);
    const { makerCurrency, takerCurrency } = Swaps.deriveCurrencies(requestBody.pairId, isBuy);

    const takerPubKey = peer.getLndPubKey(takerCurrency)!;

    const deal: SwapDeal = {
      ...requestBody,
      takerPubKey,
      price,
      isBuy,
      quantity,
      makerAmount,
      takerAmount,
      makerCurrency,
      takerCurrency,
      peerPubKey: peer.nodePubKey!,
      localId: orderToAccept.localId,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      rHash: requestBody.rHash,
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
      this.sendErrorToPeer(peer, deal.rHash, deal.errorReason!, requestPacket.header.id);
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
        this.sendErrorToPeer(peer, deal.rHash, deal.errorReason!, requestPacket.header.id);
        return false;
    }

    let height: number;
    try {
      const req = new lndrpc.QueryRoutesRequest();
      req.setAmt(takerAmount);
      req.setFinalCltvDelta(requestBody.takerCltvDelta);
      req.setNumRoutes(1);
      req.setPubKey(peer.getLndPubKey(takerCurrency)!);
      const routes = await lndclient.queryRoutes(req);
      deal.makerToTakerRoutes = routes.getRoutesList();
      this.logger.debug('got ' + deal.makerToTakerRoutes.length + ' routes to destination: ' + deal.makerToTakerRoutes);
      if (deal.makerToTakerRoutes.length === 0) {
        this.setDealState(deal, SwapState.Error, 'Can not swap. unable to find route to destination.');
        this.sendErrorToPeer(peer, deal.rHash, deal.errorReason!, requestPacket.header.id);
        return false;
      }
    } catch (err) {
      this.setDealState(deal, SwapState.Error, 'Can not swap. unable to find route to destination: ' + err.message);
      this.sendErrorToPeer(peer, deal.rHash, deal.errorReason!, requestPacket.header.id);
      return false;
    }

    try {
      const info = await lndclient.getInfo();
      height = info.getBlockHeight();
      this.logger.debug('got block height of ' + height);
    } catch (err) {
      this.setDealState(deal, SwapState.Error, 'Can not swap. Unable to fetch block height: ' + err.message);
      this.sendErrorToPeer(peer, deal.rHash, deal.errorReason!, requestPacket.header.id);
      return false;
    }

    const routeCltvDelta = deal.makerToTakerRoutes[0].getTotalTimeLock() - height;

    // cltvDelta can't be zero for both the LtcClient and BtcClient (checked in constructor)
    const cltvDeltaFactor = this.lndLtcClient.cltvDelta / this.lndBtcClient.cltvDelta;
    switch (makerCurrency) {
      case 'BTC':
        deal.makerCltvDelta = this.lndBtcClient.cltvDelta + routeCltvDelta / cltvDeltaFactor;
        break;
      case 'LTC':
        deal.makerCltvDelta = this.lndLtcClient.cltvDelta + routeCltvDelta * cltvDeltaFactor;
        break;
    }

    this.logger.debug('total timelock of route = ' + routeCltvDelta + 'makerCltvDelta = ' + deal.makerCltvDelta);

    const responseBody: packets.SwapAcceptedPacketBody = {
      makerCltvDelta: deal.makerCltvDelta!,
      rHash: requestBody.rHash,
      quantity: requestBody.proposedQuantity,
    };

    peer.sendPacket(new packets.SwapAcceptedPacket(responseBody, requestPacket.header.id));
    this.setDealPhase(deal, SwapPhase.SwapAgreed);
    return true;
  }

  /**
   * Handles a response from a peer to confirm a swap deal and updates the deal. If the deal is
   * accepted, initiates the swap.
   */
  private handleSwapResponse = async (responsePacket: packets.SwapAcceptedPacket, peer: Peer) => {
    assert(responsePacket.body, 'SwapResponsePacket does not contain a body');
    const { quantity, rHash, makerCltvDelta } = responsePacket.body!;
    const deal = this.getDeal(rHash);
    if (!deal) {
      this.logger.error(`received swap response for unrecognized deal payment hash ${rHash}`);
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
    request.setPaymentHashString(deal.rHash);
    request.setFinalCltvDelta(deal.makerCltvDelta);

    // TODO: use timeout on call

    try {
      this.setDealPhase(deal,  SwapPhase.AmountSent);
      const sendPaymentResponse = await cmdLnd.sendPaymentSync(request);
      if (sendPaymentResponse.getPaymentError()) {
        throw new Error(sendPaymentResponse.getPaymentError());
      }

      const rPreimage = Buffer.from(sendPaymentResponse.getPaymentPreimage_asB64(), 'base64').toString('hex');
      // TODO: check preimage from payment response vs deal.preImage
      // swap succeeded!
      this.setDealPhase(deal, SwapPhase.SwapCompleted);
      const responseBody: packets.SwapCompletePacketBody = { rHash };

      this.logger.debug('Sending swap complete to peer: ' + JSON.stringify(responseBody));
      peer.sendPacket(new packets.SwapCompletePacket(responseBody));

    } catch (err) {
      this.logger.error(`Got exception from sendPaymentSync ${JSON.stringify(request.toObject())}`, err.message);
      this.setDealState(deal, SwapState.Error, err.message);
      this.sendErrorToPeer(peer, rHash, err.message);
      return;
    }

  }

  /**
   * Verifies that the request from LND is valid. Checks the received amount vs
   * the expected amount and the CltvDelta vs the expected one.
   * @returns `true` if the resolve request is valid, `false` otherwise
   */
  private validateResolveRequest = (deal: SwapDeal, resolveRequest: lndrpc.ResolveRequest)  => {
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
      this.logger.error(`received ${amount} mSat, expected ${expectedAmount} mSat`);
      this.setDealState(deal, SwapState.Error,
          `Amount sent from ${source} to ${destination} is too small`);
      return false;
    }

    if (cltvDelta > resolveRequest.getTimeout() - resolveRequest.getHeightNow()) {
      this.logger.error(`got timeout ${resolveRequest.getTimeout()} at height ${resolveRequest.getHeightNow()}`);
      this.logger.error(`cltvDelta is ${resolveRequest.getTimeout() - resolveRequest.getHeightNow()} expected delta of ${cltvDelta}`);
      this.setDealState(deal, SwapState.Error,
          `cltvDelta sent from ${source} to ${destination} is too small`);
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

    if (!this.validateResolveRequest(deal, resolveRequest)) {
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
      request.setPaymentHashString(deal.rHash);

      try {
        this.setDealPhase(deal, SwapPhase.AmountSent);
        const response = await cmdLnd.sendToRouteSync(request);
        if (response.getPaymentError()) {
          this.logger.error('Got error from sendPaymentSync: ' + response.getPaymentError() + ' ' + JSON.stringify(request.toObject()));
          this.setDealState(deal, SwapState.Error, response.getPaymentError());
          return response.getPaymentError();
        }

        deal.rPreimage = Buffer.from(response.getPaymentPreimage_asB64(), 'base64').toString('hex');
        this.setDealPhase(deal, SwapPhase.AmountReceived);
        return deal.rPreimage;
      } catch (err) {
        this.logger.error('Got exception from sendPaymentSync: ' + ' ' + JSON.stringify(request.toObject()) + err.message);
        this.setDealState(deal, SwapState.Error, err.message);
        return 'Got exception from sendPaymentSync' + err.message;
      }
    } else {
      // If we are here we are the taker
      this.logger.debug('Executing taker code');

      this.setDealPhase(deal, SwapPhase.AmountReceived);
      return deal.rPreimage;
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
        this.logger.debug('Amount received for preImage ' + deal.rPreimage);
        break;
      case SwapPhase.SwapCompleted:
        assert(deal.phase === SwapPhase.AmountReceived, 'SwapCompleted can be only be set after AmountReceived');
        deal.completeTime = Date.now();
        this.setDealState(deal, SwapState.Completed, 'Swap completed. preimage = ' + deal.rPreimage);
        this.logger.debug('Swap completed. preimage = ' + deal.rPreimage);
        break;
      default:
        assert(false, 'unknown deal phase');
    }

    deal.phase = newPhase;

    if (deal.phase === SwapPhase.AmountReceived) {
      const swapResult = {
        orderId: deal.orderId,
        localId: deal.localId,
        pairId: deal.pairId,
        quantity: deal.quantity!,
        amountReceived: deal.role === SwapRole.Maker ? deal.makerAmount : deal.takerAmount,
        amountSent: deal.role === SwapRole.Maker ? deal.takerAmount : deal.makerAmount,
        rHash: deal.rHash,
        peerPubKey: deal.peerPubKey,
        role: deal.role,
      };
      this.emit('swap.paid', swapResult);
    }
  }

  private handleSwapComplete = (response: packets.SwapCompletePacket) => {
    const { rHash } = response.body!;
    const deal = this.getDeal(rHash);
    if (!deal) {
      this.logger.error(`received swap complete for unknown deal payment hash ${rHash}`);
      return;
    }
    this.setDealPhase(deal, SwapPhase.SwapCompleted);
    return this.persistDeal(deal);
  }

  private handleSwapError = (error: packets.SwapFailedPacket) => {
    const { rHash, errorMessage } = error.body!;
    const deal = this.getDeal(rHash);
    if (!deal) {
      this.logger.error(`received swap error for unknown deal payment hash ${rHash}`);
      return;
    }
    this.setDealState(deal, SwapState.Error, errorMessage);
    return this.persistDeal(deal);
  }

}

export default Swaps;
