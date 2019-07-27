import { SwapPhase, SwapRole, SwapState, SwapFailureReason, ReputationEvent } from '../constants/enums';
import Peer from '../p2p/Peer';
import { Models } from '../db/DB';
import * as packets from '../p2p/packets/types';
import Logger from '../Logger';
import Pool from '../p2p/Pool';
import { EventEmitter } from 'events';
import SwapRepository from './SwapRepository';
import { OwnOrder, PeerOrder } from '../orderbook/types';
import assert from 'assert';
import { SwapDealInstance } from '../db/types';
import { SwapDeal, SwapSuccess, SanitySwap, ResolveRequest } from './types';
import { generatePreimageAndHash, setTimeoutPromise } from '../utils/utils';
import { PacketType } from '../p2p/packets';
import SwapClientManager, { isRaidenClient } from './SwapClientManager';
import { errors } from './errors';

export type OrderToAccept = Pick<SwapDeal, 'quantity' | 'price' | 'localId' | 'isBuy'> & {
  quantity: number;
};

interface Swaps {
  on(event: 'swap.paid', listener: (swapSuccess: SwapSuccess) => void): this;
  on(event: 'swap.failed', listener: (deal: SwapDeal) => void): this;
  emit(event: 'swap.paid', swapSuccess: SwapSuccess): boolean;
  emit(event: 'swap.failed', deal: SwapDeal): boolean;
}

class Swaps extends EventEmitter {
  /** A map between payment hashes and pending sanity swaps. */
  public sanitySwaps = new Map<string, SanitySwap>();
  /** A map between payment hashes and swap deals. */
  private deals = new Map<string, SwapDeal>();
  /** A map between payment hashes and timeouts for swaps. */
  private timeouts = new Map<string, number>();
  private usedHashes = new Set<string>();
  private repository: SwapRepository;
  /** Number of smallest units per currency. */
  // TODO: Use UnitConverter class instead
  private static readonly UNITS_PER_CURRENCY: { [key: string]: number } = {
    BTC: 1,
    LTC: 1,
    WETH: 10 ** 10,
    DAI: 10 ** 10,
  };
  /** The maximum time in milliseconds we will wait for a swap to be accepted before failing it. */
  private static readonly SWAP_ACCEPT_TIMEOUT = 10000;
  /** The maximum time in milliseconds we will wait for a swap to be completed before failing it. */
  private static readonly SWAP_COMPLETE_TIMEOUT = 30000;
  /** The maximum time in milliseconds we will wait to receive an expected sanity swap init packet. */
  private static readonly SANITY_SWAP_INIT_TIMEOUT = 3000;
  /** The maximum time in milliseconds we will wait for a swap to be completed before failing it. */
  private static readonly SANITY_SWAP_COMPLETE_TIMEOUT = 10000;

  constructor(private logger: Logger,
    private models: Models,
    private pool: Pool,
    public swapClientManager: SwapClientManager,
  ) {
    super();

    this.repository = new SwapRepository(this.models);
    this.bind();
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
   * Calculates the currencies and amounts of subunits/satoshis each side of a swap should receive.
   * @param quantity The quantity being swapped
   * @param price The price for the swap
   * @param isBuy Whether the maker order in the swap is a buy
   * @returns An object with the calculated maker and taker values.
   */
  private static calculateMakerTakerAmounts = (quantity: number, price: number, isBuy: boolean, pairId: string) => {
    const { inboundCurrency, inboundAmount, inboundUnits, outboundCurrency, outboundAmount, outboundUnits } =
      Swaps.calculateInboundOutboundAmounts(quantity, price, isBuy, pairId);
    return {
      makerCurrency: inboundCurrency,
      makerAmount: inboundAmount,
      makerUnits: inboundUnits,
      takerCurrency: outboundCurrency,
      takerAmount: outboundAmount,
      takerUnits: outboundUnits,
    };
  }

  /**
   * Calculates the incoming and outgoing currencies and amounts of subunits/satoshis for an order if it is swapped.
   * @param quantity The quantity of the order
   * @param price The price of the order
   * @param isBuy Whether the order is a buy
   * @returns An object with the calculated incoming and outgoing values. The quote currency
   * amount is returned as zero if the price is 0 or infinity, indicating a market order.
   */
  public static calculateInboundOutboundAmounts = (quantity: number, price: number, isBuy: boolean, pairId: string) => {
    const [baseCurrency, quoteCurrency] = pairId.split('/');
    const baseCurrencyAmount = quantity;
    const quoteCurrencyAmount = price > 0 && price < Number.POSITIVE_INFINITY ?
      Math.round(quantity * price) :
      0; // if price is zero or infinity, this is a market order and we can't know the quote currency amount
    const baseCurrencyUnits = Math.floor(baseCurrencyAmount * Swaps.UNITS_PER_CURRENCY[baseCurrency]);
    const quoteCurrencyUnits = Math.floor(quoteCurrencyAmount * Swaps.UNITS_PER_CURRENCY[quoteCurrency]);

    const inboundCurrency = isBuy ? baseCurrency : quoteCurrency;
    const inboundAmount = isBuy ? baseCurrencyAmount : quoteCurrencyAmount;
    const inboundUnits = isBuy ? baseCurrencyUnits : quoteCurrencyUnits;
    const outboundCurrency = isBuy ? quoteCurrency : baseCurrency;
    const outboundAmount = isBuy ? quoteCurrencyAmount : baseCurrencyAmount;
    const outboundUnits = isBuy ? quoteCurrencyUnits : baseCurrencyUnits;
    return { inboundCurrency, inboundAmount, inboundUnits, outboundCurrency, outboundAmount, outboundUnits };
  }

  public init = async () => {
    // update pool with lnd pubkeys and raiden address
    this.swapClientManager.getLndClientsMap().forEach(({ pubKey, chain, currency, uris }) => {
      if (pubKey && chain) {
        this.pool.updateLndState({
          currency,
          pubKey,
          chain,
          uris,
        });
      }
    });
    if (this.swapClientManager.raidenClient.address) {
      this.pool.updateRaidenState(this.swapClientManager.raidenClient.tokenAddresses, this.swapClientManager.raidenClient.address);
    }

    // Load Swaps from database
    const result = await this.repository.getSwapDeals();
    result.forEach((deal: SwapDealInstance) => {
      this.usedHashes.add(deal.rHash);
    });
  }

  private bind() {
    this.pool.on('packet.sanitySwapInit', async (packet, peer) => {
      const { currency, rHash } = packet.body!;
      const sanitySwap: SanitySwap = {
        currency,
        rHash,
        peerPubKey: peer.nodePubKey!,
      };
      this.sanitySwaps.set(rHash, sanitySwap);
      const swapClient = this.swapClientManager.get(currency)!;
      try {
        await swapClient.addInvoice(rHash, 1, swapClient.cltvDelta);
      } catch (err) {
        this.logger.error('could not add invoice for sanity swap', err);
        return;
      }
      await peer.sendPacket(new packets.SanitySwapAckPacket(undefined, packet.header.id));

      // set timeout limit for sanity swap to complete, fail it if it stalls
      await setTimeoutPromise(Swaps.SANITY_SWAP_COMPLETE_TIMEOUT);
      if (this.sanitySwaps.delete(rHash)) {
        // if we're here, it means the sanity swap has not completed within the time limit
        swapClient.removeInvoice(rHash).catch(this.logger.error);
      }
    });
    this.pool.on('packet.swapAccepted', this.handleSwapAccepted);
    this.pool.on('packet.swapComplete', this.handleSwapComplete);
    this.pool.on('packet.swapFailed', this.handleSwapFailed);

    this.swapClientManager.on('htlcAccepted', async (swapClient, rHash, amount, currency) => {
      try {
        const rPreimage = await this.resolveHash(rHash, amount, currency);
        await swapClient.settleInvoice(rHash, rPreimage);
      } catch (err) {
        this.logger.error('could not settle invoice', err);
      }
    });
    this.swapClientManager.on('lndUpdate', this.pool.updateLndState);
    this.swapClientManager.on('raidenUpdate', this.pool.updateRaidenState);
  }

  /**
   * Checks if there are connected swap clients for both currencies in a given trading pair.
   * @returns `true` if the pair has swap support, `false` otherwise
   */
  public isPairSupported = (pairId: string): boolean => {
    const currencies = pairId.split('/');
    const baseCurrencyClient = this.swapClientManager.get(currencies[0]);
    const quoteCurrencyClient = this.swapClientManager.get(currencies[1]);
    return baseCurrencyClient !== undefined && baseCurrencyClient.isConnected() &&
      quoteCurrencyClient !== undefined && quoteCurrencyClient.isConnected();
  }

  /**
   * Sends an error to peer. Sets reqId if packet is a response to a request.
   */
  private sendErrorToPeer = async (
    { peer, rHash, failureReason = SwapFailureReason.UnknownError, errorMessage, reqId }:
    { peer: Peer, rHash: string, failureReason?: SwapFailureReason, errorMessage?: string, reqId?: string },
  ) => {
    const errorBody: packets.SwapFailedPacketBody = {
      rHash,
      failureReason,
      errorMessage,
    };
    this.logger.debug(`Sending swap error to peer: ${JSON.stringify(errorBody)}`);
    await peer.sendPacket(new packets.SwapFailedPacket(errorBody, reqId));
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
    this.logger.debug(`New deal: ${JSON.stringify(deal)}`);
  }

  public removeDeal = (deal: SwapDeal) => {
    this.deals.delete(deal.rHash);
  }

  /**
   * Checks if a swap for two given orders can be executed by ensuring both swap clients are active
   * and if there exists a route to the maker.
   * @param maker maker order
   * @param taker taker order
   * @returns `void` if the swap can be executed, throws a [[SwapFailureReason]] otherwise
   */
  private verifyExecution = async (maker: PeerOrder, taker: OwnOrder): Promise<void> => {
    if (maker.pairId !== taker.pairId || !this.isPairSupported(maker.pairId)) {
      throw SwapFailureReason.SwapClientNotSetup;
    }

    const { makerCurrency, makerUnits } = Swaps.calculateMakerTakerAmounts(taker.quantity, maker.price, maker.isBuy, maker.pairId);

    const swapClient = this.swapClientManager.get(makerCurrency)!;

    const peer = this.pool.getPeer(maker.peerPubKey);
    const destination = peer.getIdentifier(swapClient.type, makerCurrency);
    if (!destination) {
      throw SwapFailureReason.SwapClientNotSetup;
    }

    let routes;
    try {
      routes = await swapClient.getRoutes(makerUnits, destination, makerCurrency);
    } catch (err) {
      throw SwapFailureReason.UnexpectedClientError;
    }

    if (routes.length === 0) {
      throw SwapFailureReason.NoRouteFound;
    }
  }

  /**
   * A promise wrapper for a swap procedure
   * @param maker the remote maker order we are filling
   * @param taker our local taker order
   * @returns A promise that resolves to a [[SwapSuccess]] once the swap is completed, throws a [[SwapFailureReason]] if it fails
   */
  public executeSwap = async (maker: PeerOrder, taker: OwnOrder): Promise<SwapSuccess> => {
    await this.verifyExecution(maker, taker);
    const rHash = await this.beginSwap(maker, taker);

    return new Promise<SwapSuccess>((resolve, reject) => {
      const cleanup = () => {
        this.removeListener('swap.paid', onPaid);
        this.removeListener('swap.failed', onFailed);
      };
      const onPaid = (swapSuccess: SwapSuccess) => {
        if (swapSuccess.rHash === rHash) {
          cleanup();
          resolve(swapSuccess);
        }
      };
      const onFailed = (deal: SwapDeal) => {
        if (deal.rHash === rHash) {
          cleanup();
          reject(deal.failureReason!);
        }
      };
      this.on('swap.paid', onPaid);
      this.on('swap.failed', onFailed);
    });
  }

  /**
   * Executes a sanity swap with a peer for a specified currency.
   * @returns `true` if the swap succeeds, otherwise `false`
   */
  public executeSanitySwap = async (currency: string, peer: Peer) => {
    const { rPreimage, rHash } = await generatePreimageAndHash();
    const peerPubKey = peer.nodePubKey!;
    const swapClient = this.swapClientManager.get(currency);
    if (!swapClient) {
      return false;
    }

    const destination = peer.getIdentifier(swapClient.type, currency);
    if (!destination) {
      return false;
    }

    const sanitySwap: SanitySwap = {
      rHash,
      rPreimage,
      currency,
      peerPubKey,
    };
    this.sanitySwaps.set(rHash, sanitySwap);

    const sanitySwapInitPacket = new packets.SanitySwapInitPacket({
      currency,
      rHash,
    });

    try {
      await Promise.all([
        swapClient.addInvoice(rHash, 1, swapClient.cltvDelta),
        peer.sendPacket(sanitySwapInitPacket),
        peer.wait(sanitySwapInitPacket.header.id, PacketType.SanitySwapAck, Swaps.SANITY_SWAP_INIT_TIMEOUT),
      ]);
    } catch (err) {
      this.logger.warn(`sanity swap could not be initiated for ${currency} using rHash ${rHash}: ${err.message}`);
      swapClient.removeInvoice(rHash).catch(this.logger.error);
      return false;
    }

    try {
      await swapClient.sendSmallestAmount(rHash, destination, currency);
      this.logger.debug(`performed successful sanity swap with peer ${peerPubKey} for ${currency} using rHash ${rHash}`);
      return true;
    } catch (err) {
      this.logger.warn(`got payment error during sanity swap with ${peerPubKey} for ${currency} using rHash ${rHash}: ${err.message}`);
      swapClient.removeInvoice(rHash).catch(this.logger.error);
      return false;
    }
  }

  /**
   * Begins a swap to fill an order by sending a [[SwapRequestPacket]] to the maker.
   * @param maker The remote maker order we are filling
   * @param taker Our local taker order
   * @returns The rHash for the swap, or a [[SwapFailureReason]] if the swap could not be initiated
   */
  private beginSwap = async (maker: PeerOrder, taker: OwnOrder): Promise<string> => {
    const peer = this.pool.getPeer(maker.peerPubKey);

    const quantity = Math.min(maker.quantity, taker.quantity);
    const { makerCurrency, makerAmount, makerUnits, takerCurrency, takerAmount, takerUnits } =
      Swaps.calculateMakerTakerAmounts(quantity, maker.price, maker.isBuy, maker.pairId);
    const clientType = this.swapClientManager.get(makerCurrency)!.type;
    const destination = peer.getIdentifier(clientType, makerCurrency)!;

    const takerCltvDelta = this.swapClientManager.get(takerCurrency)!.cltvDelta;

    const { rPreimage, rHash } = await generatePreimageAndHash();
    const swapRequestBody: packets.SwapRequestPacketBody = {
      takerCltvDelta,
      rHash,
      orderId: maker.id,
      pairId: maker.pairId,
      proposedQuantity: taker.quantity,
    };

    const deal: SwapDeal = {
      ...swapRequestBody,
      rPreimage,
      takerCurrency,
      makerCurrency,
      takerAmount,
      makerAmount,
      takerUnits,
      makerUnits,
      destination,
      peerPubKey: peer.nodePubKey!,
      localId: taker.localId,
      price: maker.price,
      isBuy: maker.isBuy,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      role: SwapRole.Taker,
      createTime: Date.now(),
    };

    this.timeouts.set(rHash, setTimeout(this.handleSwapTimeout, Swaps.SWAP_ACCEPT_TIMEOUT, rHash, SwapFailureReason.DealTimedOut));

    this.addDeal(deal);

    // Make sure we are connected to both swap clients
    if (!this.isPairSupported(deal.pairId)) {
      this.failDeal(deal, SwapFailureReason.SwapClientNotSetup);
      throw SwapFailureReason.SwapClientNotSetup;
    }
    await peer.sendPacket(new packets.SwapRequestPacket(swapRequestBody));

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
    this.logger.debug(`trying to accept deal: ${JSON.stringify(orderToAccept)} from xudPubKey: ${peer.nodePubKey}`);

    const rHash = requestPacket.body!.rHash;
    if (this.usedHashes.has(rHash)) {
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: SwapFailureReason.PaymentHashReuse,
        reqId: requestPacket.header.id,
      });
      return false;
    }
    const requestBody = requestPacket.body!;

    const { quantity, price, isBuy } = orderToAccept;

    const { makerCurrency, makerAmount, makerUnits, takerCurrency, takerAmount, takerUnits } =
      Swaps.calculateMakerTakerAmounts(quantity, price, isBuy, requestBody.pairId);

    const makerSwapClient = this.swapClientManager.get(makerCurrency)!;
    if (!makerSwapClient) {
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: SwapFailureReason.SwapClientNotSetup,
        errorMessage: 'Unsupported maker currency',
        reqId: requestPacket.header.id,
      });
      return false;
    }

    if (isRaidenClient(makerSwapClient)) {
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: SwapFailureReason.InvalidSwapRequest,
        errorMessage: 'Raiden based tokens can not be first leg',
        reqId: requestPacket.header.id,
      });
      return false;
    }

    const takerSwapClient = this.swapClientManager.get(takerCurrency);
    if (!takerSwapClient) {
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: SwapFailureReason.SwapClientNotSetup,
        errorMessage: 'Unsupported taker currency',
        reqId: requestPacket.header.id,
      });
      return false;
    }

    const takerIdentifier = peer.getIdentifier(takerSwapClient.type, takerCurrency)!;

    const deal: SwapDeal = {
      ...requestBody,
      price,
      isBuy,
      quantity,
      makerAmount,
      takerAmount,
      makerCurrency,
      takerCurrency,
      makerUnits,
      takerUnits,
      takerPubKey: takerIdentifier,
      destination: takerIdentifier,
      peerPubKey: peer.nodePubKey!,
      localId: orderToAccept.localId,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      role: SwapRole.Maker,
      createTime: Date.now(),
    };

    this.timeouts.set(rHash, setTimeout(this.handleSwapTimeout, Swaps.SWAP_COMPLETE_TIMEOUT, rHash, SwapFailureReason.SwapTimedOut));

    // add the deal. Going forward we can "record" errors related to this deal.
    this.addDeal(deal);

    // Make sure we are connected to swap clients for both currencies
    if (!this.isPairSupported(deal.pairId)) {
      this.failDeal(deal, SwapFailureReason.SwapClientNotSetup);
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: deal.failureReason!,
        errorMessage: deal.errorMessage,
        reqId: requestPacket.header.id,
      });
      return false;
    }

    try {
      deal.makerToTakerRoutes = await takerSwapClient.getRoutes(takerUnits, takerIdentifier, deal.takerCurrency, deal.takerCltvDelta);
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, err.message);
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: deal.failureReason!,
        errorMessage: deal.errorMessage,
        reqId: requestPacket.header.id,
      });
      return false;
    }

    if (deal.makerToTakerRoutes.length === 0) {
      this.failDeal(deal, SwapFailureReason.NoRouteFound, 'Unable to find route to destination');
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: deal.failureReason!,
        errorMessage: deal.errorMessage,
        reqId: requestPacket.header.id,
      });
      return false;
    }

    let height: number;
    try {
      height = await takerSwapClient.getHeight();
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, `Unable to fetch block height: ${err.message}`);
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: deal.failureReason!,
        errorMessage: deal.errorMessage,
        reqId: requestPacket.header.id,
      });
      return false;
    }

    if (height) {
      this.logger.debug(`got block height of ${height}`);

      const routeTotalTimeLock = deal.makerToTakerRoutes[0].getTotalTimeLock();
      this.logger.debug(`choosing a route with total time lock of ${routeTotalTimeLock}`);
      const routeCltvDelta = routeTotalTimeLock - height;
      this.logger.debug(`route CLTV delta: ${routeCltvDelta}`);

      const makerClientCltvDelta = this.swapClientManager.get(makerCurrency)!.cltvDelta;
      this.logger.debug(`maker client CLTV delta: ${makerClientCltvDelta}`);
      const takerClientCltvDelta = this.swapClientManager.get(takerCurrency)!.cltvDelta;
      this.logger.debug(`taker client CLTV delta: ${takerClientCltvDelta}`);

      // cltvDelta can't be zero for swap clients (checked in constructor)
      const cltvDeltaFactor = makerClientCltvDelta / takerClientCltvDelta;
      this.logger.debug(`CLTV delta factor: ${cltvDeltaFactor}`);

      deal.makerCltvDelta = makerClientCltvDelta + Math.ceil(routeCltvDelta * cltvDeltaFactor);
      this.logger.debug(`makerCltvDelta: ${deal.makerCltvDelta}`);
    }

    if (!deal.makerCltvDelta) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, 'Could not calculate makerCltvDelta.');
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: deal.failureReason!,
        errorMessage: deal.errorMessage,
        reqId: requestPacket.header.id,
      });
      return false;
    }

    try {
      await makerSwapClient.addInvoice(deal.rHash, deal.makerUnits, deal.makerCltvDelta);
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, `could not add invoice for while accepting deal: ${err.message}`);
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: deal.failureReason!,
        errorMessage: deal.errorMessage,
        reqId: requestPacket.header.id,
      });
      return false;
    }

    const responseBody: packets.SwapAcceptedPacketBody = {
      makerCltvDelta: deal.makerCltvDelta || 1,
      rHash: requestBody.rHash,
      quantity: requestBody.proposedQuantity,
    };

    this.logger.debug(`sending swap accepted packet: ${JSON.stringify(responseBody)} to peer: ${peer.nodePubKey}`);
    await peer.sendPacket(new packets.SwapAcceptedPacket(responseBody, requestPacket.header.id));
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
        const { makerAmount, takerAmount } = Swaps.calculateMakerTakerAmounts(quantity, deal.price, deal.isBuy, deal.pairId);
        deal.takerAmount = takerAmount;
        deal.makerAmount = makerAmount;
      }
    }

    const makerSwapClient = this.swapClientManager.get(deal.makerCurrency);
    const takerSwapClient = this.swapClientManager.get(deal.takerCurrency);
    if (!makerSwapClient || !takerSwapClient) {
      // We checked that we had a swap client for both currencies involved during the peer handshake. Still...
      return;
    }

    try {
      await takerSwapClient.addInvoice(deal.rHash, deal.takerUnits, takerSwapClient.cltvDelta);
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, err.message);
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: SwapFailureReason.UnexpectedClientError,
        errorMessage: err.message,
      });
      return;
    }

    try {
      this.setDealPhase(deal, SwapPhase.SendingPayment);
      await makerSwapClient.sendPayment(deal);
      // TODO: check preimage from payment response vs deal.preImage

      // swap succeeded!
      this.setDealPhase(deal, SwapPhase.SwapCompleted);
      const responseBody: packets.SwapCompletePacketBody = { rHash };

      this.logger.debug(`Sending swap complete to peer: ${JSON.stringify(responseBody)}`);
      await peer.sendPacket(new packets.SwapCompletePacket(responseBody));
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.SendPaymentFailure, err.message);
      await this.sendErrorToPeer({
        peer,
        rHash,
        failureReason: SwapFailureReason.SendPaymentFailure,
        errorMessage: err.message,
      });
    }
  }

  /**
   * Verifies that the resolve request is valid. Checks the received amount vs
   * the expected amount.
   * @returns `true` if the resolve request is valid, `false` otherwise
   */
  private validateResolveRequest = (deal: SwapDeal, resolveRequest: ResolveRequest)  => {
    const { amount } = resolveRequest;
    let expectedAmount: number;
    let source: string;
    let destination: string;
    // TODO: check cltv value
    switch (deal.role) {
      case SwapRole.Maker:
        expectedAmount = deal.makerUnits;
        source = 'Taker';
        destination = 'Maker';
        if (deal.makerCltvDelta! > 50 * 2) {
          this.failDeal(deal, SwapFailureReason.InvalidResolveRequest, 'Wrong CLTV received on first leg');
          return false;
        }
        break;
      case SwapRole.Taker:
        expectedAmount = deal.takerUnits;
        source = 'Maker';
        destination = 'Taker';
        break;
      default:
        // this case should never happen, something is very wrong if so.
        this.failDeal(deal, SwapFailureReason.UnknownError, 'Unknown role detected for swap deal');
        return false;
    }

    if (amount < expectedAmount) {
      this.logger.error(`received ${amount}, expected ${expectedAmount}`);
      this.failDeal(deal, SwapFailureReason.InvalidResolveRequest, `Amount sent from ${source} to ${destination} is too small`);
      return false;
    }

    return true;
  }

  /** Attempts to resolve the preimage for the payment hash of a pending sanity swap. */
  private resolveSanitySwap = async (rHash: string, amount: number, htlcCurrency?: string) => {
    assert(amount === 1, 'sanity swaps must have an amount of exactly 1 of the smallest unit supported by the currency');

    const sanitySwap = this.sanitySwaps.get(rHash);

    if (sanitySwap) {
      assert(htlcCurrency === undefined || htlcCurrency === sanitySwap.currency, 'incoming htlc does not match sanity swap currency');
      const { currency, peerPubKey, rPreimage } = sanitySwap;
      this.sanitySwaps.delete(rHash); // we don't need to track sanity swaps that we've already attempted to resolve, delete to prevent a memory leak

      if (rPreimage) {
        // we initiated this sanity swap and can release the preimage immediately
        return rPreimage;
      } else {
        // we need to get the preimage by making a payment
        const swapClient = this.swapClientManager.get(currency);
        if (!swapClient) {
          throw new Error('unsupported currency');
        }

        const peer = this.pool.getPeer(peerPubKey);
        const destination = peer.getIdentifier(swapClient.type, currency)!;

        try {
          const preimage = await swapClient.sendSmallestAmount(rHash, destination, currency);
          this.logger.debug(`performed successful sanity swap with peer ${peerPubKey} for ${currency} using rHash ${rHash}`);
          return preimage;
        } catch (err) {
          this.logger.warn(`got payment error during sanity swap with ${peerPubKey} for ${currency} using rHash ${rHash}: ${err.message}`);
          swapClient.removeInvoice(rHash).catch(this.logger.error);
          throw err;
        }
      }
    } else {
      throw errors.PAYMENT_HASH_NOT_FOUND(rHash);
    }
  }

  /**
   * Resolves the hash for an incoming HTLC to its preimage.
   * @param rHash the payment hash to resolve
   * @param amount the amount in satoshis
   * @param htlcCurrency the currency of the HTLC
   * @returns the preimage for the provided payment hash
   */
  public resolveHash = async (rHash: string, amount: number, htlcCurrency?: string): Promise<string> => {
    const deal = this.getDeal(rHash);

    if (!deal) {
      if (amount === 1) {
        // if we don't have a deal for this hash, but its amount is exactly 1 satoshi, try to resolve it as a sanity swap
        return this.resolveSanitySwap(rHash, amount, htlcCurrency);
      } else {
        throw errors.PAYMENT_HASH_NOT_FOUND(rHash);
      }
    }

    if (deal.role === SwapRole.Maker) {
      // As the maker, we need to forward the payment to the other chain
      assert(htlcCurrency === undefined || htlcCurrency === deal.makerCurrency, 'incoming htlc does not match expected deal currency');

      this.logger.debug('Executing maker code to resolve hash');

      const swapClient = this.swapClientManager.get(deal.takerCurrency)!;

      try {
        this.setDealPhase(deal, SwapPhase.SendingPayment);
        deal.rPreimage = await swapClient.sendPayment(deal);
        this.setDealPhase(deal, SwapPhase.PaymentReceived);
        return deal.rPreimage;
      } catch (err) {
        this.failDeal(deal, SwapFailureReason.SendPaymentFailure, err.message);
        throw new Error(`Got exception from sendPaymentSync ${err.message}`);
      }
    } else {
      // If we are here we are the taker
      assert(deal.rPreimage, 'preimage must be known if we are the taker');
      assert(htlcCurrency === undefined || htlcCurrency === deal.takerCurrency, 'incoming htlc does not match expected deal currency');
      this.logger.debug('Executing taker code to resolve hash');

      this.setDealPhase(deal, SwapPhase.PaymentReceived);
      return deal.rPreimage!;
    }
  }

  public handleResolveRequest = async (resolveRequest: ResolveRequest): Promise<string> => {
    const { amount, rHash } = resolveRequest;

    this.logger.debug(`handleResolveRequest starting with hash ${rHash}`);

    const deal = this.getDeal(rHash);

    if (deal) {
      if (!this.validateResolveRequest(deal, resolveRequest)) {
        return deal.errorMessage || '';
      }
    }

    try {
      return this.resolveHash(rHash, amount);
    } catch (err) {
      this.logger.error(err.message);
      return err.message;
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
        deal.errorMessage = deal.errorMessage ? `${deal.errorMessage}; ${errorMessage}` : errorMessage;
      }
      this.logger.debug(`new deal error message for ${deal.rHash}: + ${deal.errorMessage}`);
      return;
    }
    if (errorMessage) {
      this.logger.debug(`deal ${deal.rHash} failed due to ${SwapFailureReason[failureReason]}`);
    } else {
      this.logger.debug(`deal ${deal.rHash} failed due to ${SwapFailureReason[failureReason]}: ${errorMessage}`);
    }

    switch (failureReason) {
      case SwapFailureReason.SwapTimedOut:
        // additional penalty as timeouts cause costly delays and possibly stuck HTLC outputs
        void this.pool.addReputationEvent(deal.peerPubKey, ReputationEvent.SwapTimeout);
        /* falls through */
      case SwapFailureReason.SendPaymentFailure:
      case SwapFailureReason.NoRouteFound:
      case SwapFailureReason.SwapClientNotSetup:
        // something is wrong with swaps for this trading pair and peer, drop this pair
        try {
          // TODO: disable the currency that caused this error
          this.pool.getPeer(deal.peerPubKey).deactivatePair(deal.pairId);
        } catch (err) {
          this.logger.debug(`could not drop trading pair ${deal.pairId} for peer ${deal.peerPubKey}`);
        }
        void this.pool.addReputationEvent(deal.peerPubKey, ReputationEvent.SwapFailure);
        break;
      case SwapFailureReason.InvalidResolveRequest:
      case SwapFailureReason.DealTimedOut:
      case SwapFailureReason.InvalidSwapPacketReceived:
      case SwapFailureReason.PaymentHashReuse:
        // peer misbehaving, penalize the peer
        void this.pool.addReputationEvent(deal.peerPubKey, ReputationEvent.SwapMisbehavior);
        break;
      default:
        // do nothing, the swap failed for an innocuous reason
        break;
    }

    assert(deal.state === SwapState.Active, 'deal is not Active. Can not change deal state');
    deal.state = SwapState.Error;
    deal.failureReason = failureReason;
    deal.errorMessage = errorMessage;
    clearTimeout(this.timeouts.get(deal.rHash));
    this.timeouts.delete(deal.rHash);
    const swapClient = this.swapClientManager.get(deal.role === SwapRole.Maker ? deal.makerCurrency : deal.takerCurrency);
    if (swapClient) {
      swapClient.removeInvoice(deal.rHash).catch(this.logger.error); // we don't need to await the remove invoice call
    }
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
        this.logger.debug(`Requesting deal: ${JSON.stringify(deal)}`);
        break;
      case SwapPhase.SwapAgreed:
        assert(deal.role === SwapRole.Maker, 'SwapAgreed can only be set by the maker');
        assert(deal.phase === SwapPhase.SwapCreated, 'SwapAgreed can be only be set after SwapCreated');
        this.logger.debug('Sending swap response to peer ');
        break;
      case SwapPhase.SendingPayment:
        assert(deal.role === SwapRole.Taker && deal.phase === SwapPhase.SwapRequested ||
          deal.role === SwapRole.Maker && deal.phase === SwapPhase.SwapAgreed,
            'SendingPayment can only be set after SwapRequested (taker) or SwapAgreed (maker)');
        deal.executeTime = Date.now();
        break;
      case SwapPhase.PaymentReceived:
        assert(deal.phase === SwapPhase.SendingPayment, 'PaymentReceived can be only be set after SendingPayment');
        this.logger.debug(`Payment received for deal with payment hash ${deal.rPreimage}`);
        break;
      case SwapPhase.SwapCompleted:
        assert(deal.phase === SwapPhase.PaymentReceived, 'SwapCompleted can be only be set after PaymentReceived');
        deal.completeTime = Date.now();
        deal.state = SwapState.Completed;
        this.logger.debug(`Swap completed. preimage = ${deal.rPreimage}`);
        break;
      default:
        assert(false, 'unknown deal phase');
    }

    deal.phase = newPhase;

    if (deal.phase === SwapPhase.PaymentReceived) {
      const wasMaker = deal.role === SwapRole.Maker;
      const swapSuccess = {
        orderId: deal.orderId,
        localId: deal.localId,
        pairId: deal.pairId,
        quantity: deal.quantity!,
        amountReceived: wasMaker ? deal.makerAmount : deal.takerAmount,
        amountSent: wasMaker ? deal.takerAmount : deal.makerAmount,
        currencyReceived: wasMaker ? deal.makerCurrency : deal.takerCurrency,
        currencySent: wasMaker ? deal.takerCurrency : deal.makerCurrency,
        rHash: deal.rHash,
        rPreimage: deal.rPreimage,
        price: deal.price,
        peerPubKey: deal.peerPubKey,
        role: deal.role,
      };
      this.emit('swap.paid', swapSuccess);

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
