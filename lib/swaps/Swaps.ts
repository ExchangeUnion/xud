import { SwapPhase, SwapRole, SwapState, SwapFailureReason } from '../constants/enums';
import Peer from '../p2p/Peer';
import { Models } from '../db/DB';
import * as packets from '../p2p/packets/types';
import { createHash } from 'crypto';
import Logger from '../Logger';
import * as lndrpc from '../proto/lndrpc_pb';
import LndClient from '../lndclient/LndClient';
import Pool from '../p2p/Pool';
import { EventEmitter } from 'events';
import SwapRepository from './SwapRepository';
import { OwnOrder, PeerOrder } from '../orderbook/types';
import assert from 'assert';
import { SwapDealInstance } from '../db/types';
import { SwapDeal, SwapResult } from './types';
import { randomBytes } from '../utils/utils';

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
  /** A map between payment hashes and timeouts for swaps. */
  private timeouts = new Map<string, number>();
  private usedHashes = new Set<string>();
  private repository: SwapRepository;
  /** The number of satoshis in a bitcoin. */
  private static readonly SATOSHIS_PER_COIN = 100000000;
  /** The maximum time in milliseconds we will wait for a swap to be accepted before failing it. */
  private static readonly SWAP_ACCEPT_TIMEOUT = 10000;
  /** The maximum time in milliseconds we will wait for a swap to be completed before failing it. */
  private static readonly SWAP_COMPLETE_TIMEOUT = 30000;

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
    // Load Swaps from database
    const result = await this.repository.getSwapDeals();
    result.forEach((deal: SwapDealInstance) => {
      this.usedHashes.add(deal.rHash);
    });
  }

  private bind() {
    this.pool.on('packet.swapAccepted', this.handleSwapAccepted);
    this.pool.on('packet.swapComplete', this.handleSwapComplete);
    this.pool.on('packet.swapFailed', this.handleSwapFailed);
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
  private sendErrorToPeer = (peer: Peer, rHash: string, failureReason: SwapFailureReason, errorMessage?: string, reqId?: string) => {
    const errorBody: packets.SwapFailedPacketBody = {
      rHash,
      failureReason,
      errorMessage,
    };
    this.logger.debug('Sending swap error to peer: ' + JSON.stringify(errorBody));
    peer.sendPacket(new packets.SwapFailedPacket(errorBody, reqId));
    return;
  }

  /**
   * Verifies LND setup. Make sure we are connected to BTC and LTC and that
   * the peer has provided pub keys for these networks.
   * @returns undefined if the setup is verified, otherwise an error message
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
   * Gets a client for the specified currency.
   * @param currency the currency of the client
   * @returns a client if found, otherwise undefined
   */
  private getClientForCurrency(currency: string): LndClient | undefined {
    switch (currency) {
      case 'BTC':
        return this.lndBtcClient;
      case 'LTC':
        return this.lndLtcClient;
      default:
        return;
    }
  }

  /**
   * Gets routes for the given currency, amount and peerPubKey.
   * @param currency currency/chain to find routes in
   * @param amount the capacity of the route
   * @param peerPubKey target node for the route
   * @returns routes
   */
  private getRoutes =  async (currency: string, amount: number, peerPubKey: string): Promise<lndrpc.Route[]> => {
    const client = this.getClientForCurrency(currency);
    if (!client) throw new Error('swap client not found');
    const req = new lndrpc.QueryRoutesRequest();
    req.setAmt(amount);
    req.setFinalCltvDelta(client.cltvDelta);
    req.setNumRoutes(1);
    const peer = this.pool.getPeer(peerPubKey);
    const pubKey = peer.getLndPubKey(currency);
    if (!pubKey) {
      throw new Error(`${currency} client's pubKey not found for peer ${peerPubKey}`);
    }
    req.setPubKey(pubKey);
    const routes = (await client.queryRoutes(req)).getRoutesList();
    this.logger.debug(`got ${routes.length} routes to destination: ${routes}`);
    return routes;
  }

  /**
   * Checks if a swap for two given orders can be executed.
   * @param maker maker order
   * @param taker taker order
   * @returns nothing if the swap can be executed, throws an error with a reason otherwise
   */
  private verifyExecution = async (maker: PeerOrder, taker: OwnOrder) => {
    if (maker.pairId !== taker.pairId || !this.isPairSupported(maker.pairId)) {
      throw new Error('pairId does not match or pair is not supported');
    }

    const { makerCurrency } = Swaps.deriveCurrencies(maker.pairId, maker.isBuy);
    const { makerAmount } = Swaps.calculateSwapAmounts(taker.quantity, maker.price, maker.isBuy);
    const routes = await this.getRoutes(makerCurrency, makerAmount, maker.peerPubKey);
    if (routes.length === 0) {
      throw new Error('Can not swap. unable to find route to destination');
    }
  }

  /**
   * A promise wrapper for a swap procedure
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   * @returns A promise that is resolved once the swap is completed, or rejects otherwise
   */
  public executeSwap = async (maker: PeerOrder, taker: OwnOrder): Promise<SwapResult> => {
    await this.verifyExecution(maker, taker);
    const rHash = await this.beginSwap(maker, taker);
    if (!rHash) {
      throw new Error('cannot execute swap. rHash not found');
    }

    return new Promise<SwapResult>((resolve, reject) => {
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
  private beginSwap = async (maker: PeerOrder, taker: OwnOrder) => {
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
    const preimage = await randomBytes(32);

    const rHash = createHash('sha256').update(preimage).digest('hex');

    const swapRequestBody: packets.SwapRequestPacketBody = {
      takerCltvDelta,
      rHash,
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

    this.timeouts.set(rHash, setTimeout(this.handleSwapTimeout, Swaps.SWAP_ACCEPT_TIMEOUT, rHash, SwapFailureReason.DealTimedOut));

    this.addDeal(deal);

    // Verify LND setup. Make sure we are connected to BTC and LTC and that
    // the peer is also connected to these networks.
    const errMsg = this.verifyLndSetup(deal, peer);
    if (errMsg) {
      this.logger.error(errMsg);
      this.failDeal(deal, SwapFailureReason.SwapClientNotSetup, errMsg);
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

    const rHash = requestPacket.body!.rHash;
    if (this.usedHashes.has(rHash)) {
      this.sendErrorToPeer(peer, requestPacket.body!.rHash, SwapFailureReason.PaymentHashReuse, undefined, requestPacket.header.id);
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

    this.timeouts.set(rHash, setTimeout(this.handleSwapTimeout, Swaps.SWAP_COMPLETE_TIMEOUT, rHash, SwapFailureReason.SwapTimedOut));

    // add the deal. Going forward we can "record" errors related to this deal.
    this.addDeal(deal);

    // Verifies LND setup. Make sure we are connected to BTC and LTC and that
    // the peer is also connected to these networks.
    const errMsg = this.verifyLndSetup(deal, peer);
    if (errMsg) {
      this.failDeal(deal, SwapFailureReason.SwapClientNotSetup, errMsg);
      this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    const lndclient = this.getClientForCurrency(deal.takerCurrency);
    if (!lndclient) {
      this.failDeal(deal, SwapFailureReason.SwapClientNotSetup, 'Unsupported taker currency');
      this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    try {
      deal.makerToTakerRoutes = await this.getRoutes(deal.takerCurrency, takerAmount, deal.peerPubKey);
      if (deal.makerToTakerRoutes.length === 0) throw new Error();
    } catch (err) {
      const cannotSwap = 'Unable to find route to destination';
      const errMsg = err && err.message
        ? `${cannotSwap}`
        : `${cannotSwap}: ${err.message}`;
      this.failDeal(deal, SwapFailureReason.NoRouteFound, errMsg);
      this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    let height: number;
    try {
      const info = await lndclient.getInfo();
      height = info.getBlockHeight();
      this.logger.debug('got block height of ' + height);
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedLndError, 'Unable to fetch block height: ' + err.message);
      this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    const routeCltvDelta = deal.makerToTakerRoutes[0].getTotalTimeLock() - height;

    // cltvDelta can't be zero for both the LtcClient and BtcClient (checked in constructor)
    const cltvDeltaFactor = this.lndLtcClient.cltvDelta / this.lndBtcClient.cltvDelta;
    switch (makerCurrency) {
      case 'BTC':
        deal.makerCltvDelta = this.lndBtcClient.cltvDelta + Math.ceil(routeCltvDelta / cltvDeltaFactor);
        break;
      case 'LTC':
        deal.makerCltvDelta = this.lndLtcClient.cltvDelta + Math.ceil(routeCltvDelta * cltvDeltaFactor);
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
  private handleSwapAccepted = async (responsePacket: packets.SwapAcceptedPacket, peer: Peer) => {
    assert(responsePacket.body, 'SwapAcceptedPacket does not contain a body');
    const { quantity, rHash, makerCltvDelta } = responsePacket.body!;
    const deal = this.getDeal(rHash);
    if (!deal) {
      this.logger.warn(`received swap accepted for unrecognized deal: ${rHash}`);
      // TODO: penalize peer
      return;
    }
    if (deal.phase !== SwapPhase.SwapRequested) {
      this.logger.warn(`received swap accepted for deal that is not in SwapRequested phase: ${rHash}`);
      // TODO: penalize peer
      return;
    }

    // clear the timer waiting for acceptance of our swap offer, and set a new timer waiting for
    // the swap to be completed
    clearTimeout(this.timeouts.get(rHash));
    this.timeouts.set(rHash, setTimeout(this.handleSwapTimeout, Swaps.SWAP_COMPLETE_TIMEOUT, rHash, SwapFailureReason.SwapTimedOut));

    // update deal with taker's makerCltvDelta
    deal.makerCltvDelta = makerCltvDelta;

    if (quantity) {
      deal.quantity = quantity; // set the accepted quantity for the deal
      if (quantity <= 0) {
        this.failDeal(deal, SwapFailureReason.InvalidSwapPacketReceived, 'accepted quantity must be a positive number');
        // TODO: penalize peer
        return;
      } else if (quantity > deal.proposedQuantity) {
        this.failDeal(deal, SwapFailureReason.InvalidSwapPacketReceived, 'accepted quantity should not be greater than proposed quantity');
        // TODO: penalize peer
        return;
      } else if (quantity < deal.proposedQuantity) {
        const { makerAmount, takerAmount } = Swaps.calculateSwapAmounts(quantity, deal.price, deal.isBuy);
        deal.takerAmount = takerAmount;
        deal.makerAmount = makerAmount;
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
      this.setDealPhase(deal,  SwapPhase.SendingAmount);
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
      this.logger.error(`Got exception from sendPaymentSync: ${JSON.stringify(request.toObject())}`, err.message);
      this.failDeal(deal, SwapFailureReason.SendPaymentFailure, err.message);
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
        this.failDeal(deal, SwapFailureReason.InvalidResolveRequest, 'Unknown role detected');
        return false;
    }
    // convert expected amount to mSat
    expectedAmount = expectedAmount * 1000;

    if (amount < expectedAmount) {
      this.logger.error(`received ${amount} mSat, expected ${expectedAmount} mSat`);
      this.failDeal(deal, SwapFailureReason.InvalidResolveRequest, `Amount sent from ${source} to ${destination} is too small`);
      return false;
    }

    // allow 1 additional one block to be created during the swap
    if (cltvDelta - 1 > resolveRequest.getTimeout() - resolveRequest.getHeightNow()) {
      this.logger.error(`got timeout ${resolveRequest.getTimeout()} at height ${resolveRequest.getHeightNow()}`);
      this.logger.error(`cltvDelta is ${resolveRequest.getTimeout() - resolveRequest.getHeightNow()} expected delta of ${cltvDelta}`);
      this.failDeal(deal, SwapFailureReason.InvalidResolveRequest, `cltvDelta sent from ${source} to ${destination} is too small`);
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
      return deal.errorMessage;
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
        this.setDealPhase(deal, SwapPhase.SendingAmount);
        const response = await cmdLnd.sendToRouteSync(request);
        if (response.getPaymentError()) {
          this.logger.error('Got error from sendPaymentSync: ' + response.getPaymentError() + ' ' + JSON.stringify(request.toObject()));
          this.failDeal(deal, SwapFailureReason.SendPaymentFailure, response.getPaymentError());
          return response.getPaymentError();
        }

        deal.rPreimage = Buffer.from(response.getPaymentPreimage_asB64(), 'base64').toString('hex');
        this.setDealPhase(deal, SwapPhase.AmountReceived);
        return deal.rPreimage;
      } catch (err) {
        this.logger.error('Got exception from sendPaymentSync: ' + ' ' + JSON.stringify(request.toObject()) + err.message);
        this.failDeal(deal, SwapFailureReason.SendPaymentFailure, err.message);
        return 'Got exception from sendPaymentSync' + err.message;
      }
    } else {
      // If we are here we are the taker
      this.logger.debug('Executing taker code');

      this.setDealPhase(deal, SwapPhase.AmountReceived);
      return deal.rPreimage;
    }

  }

  private handleSwapTimeout = (rHash: string, reason: SwapFailureReason) => {
    const deal = this.getDeal(rHash)!;
    this.timeouts.delete(rHash);
    this.failDeal(deal, reason);
  }

  private failDeal = (deal: SwapDeal, failureReason: SwapFailureReason, errorMessage?: string): void => {
    // If we are already in error state and got another error report we
    // aggregate all error reasons by concatenation
    if (deal.state === SwapState.Error) {
      if (errorMessage) {
        deal.errorMessage = deal.errorMessage ? deal.errorMessage + '; ' + errorMessage : errorMessage;
      }
      this.logger.debug('new deal error message: ' + deal.errorMessage);
      return;
    }
    assert(deal.state === SwapState.Active, 'deal is not Active. Can not change deal state');
    deal.state = SwapState.Error;
    deal.failureReason = failureReason;
    deal.errorMessage = errorMessage;
    clearTimeout(this.timeouts.get(deal.rHash));
    this.timeouts.delete(deal.rHash);
    this.emit('swap.failed', deal);
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
      case SwapPhase.SendingAmount:
        assert(deal.role === SwapRole.Taker && deal.phase === SwapPhase.SwapRequested ||
          deal.role === SwapRole.Maker && deal.phase === SwapPhase.SwapAgreed,
            'SendingAmount can only be set after SwapRequested (taker) or SwapAgreed (maker)');
        deal.executeTime = Date.now();
        break;
      case SwapPhase.AmountReceived:
        assert(deal.phase === SwapPhase.SendingAmount, 'AmountReceived can be only be set after SendingAmount');
        this.logger.debug('Amount received for preImage ' + deal.rPreimage);
        break;
      case SwapPhase.SwapCompleted:
        assert(deal.phase === SwapPhase.AmountReceived, 'SwapCompleted can be only be set after AmountReceived');
        deal.completeTime = Date.now();
        deal.state = SwapState.Completed;
        this.logger.debug('Swap completed. preimage = ' + deal.rPreimage);
        break;
      default:
        assert(false, 'unknown deal phase');
    }

    deal.phase = newPhase;

    if (deal.phase === SwapPhase.AmountReceived) {
      const wasMaker = deal.role === SwapRole.Maker;
      const swapResult = {
        orderId: deal.orderId,
        localId: deal.localId,
        pairId: deal.pairId,
        quantity: deal.quantity!,
        amountReceived: wasMaker ? deal.makerAmount : deal.takerAmount,
        amountSent: wasMaker ? deal.takerAmount : deal.makerAmount,
        currencyReceived: wasMaker ? deal.makerCurrency : deal.takerCurrency,
        currencySent: wasMaker ? deal.takerCurrency : deal.makerCurrency,
        rHash: deal.rHash,
        peerPubKey: deal.peerPubKey,
        role: deal.role,
      };
      this.emit('swap.paid', swapResult);

      clearTimeout(this.timeouts.get(deal.rHash));
      this.timeouts.delete(deal.rHash);
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

  private handleSwapFailed = (packet: packets.SwapFailedPacket) => {
    const { rHash, errorMessage, failureReason } = packet.body!;
    const deal = this.getDeal(rHash);
    // TODO: penalize for unexpected swap failed packets
    if (!deal) {
      this.logger.warn(`received swap failed packet for unknown deal with payment hash ${rHash}`);
      return;
    }
    if (deal.state !== SwapState.Active) {
      this.logger.warn(`received swap failed packet for inactive deal with payment hash ${rHash}`);
      return;
    }

    this.failDeal(deal, failureReason, errorMessage);
    return this.persistDeal(deal);
  }

}

export default Swaps;
