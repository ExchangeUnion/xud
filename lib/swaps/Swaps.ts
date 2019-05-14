import { SwapPhase, SwapRole, SwapState, SwapFailureReason, ReputationEvent } from '../constants/enums';
import Peer from '../p2p/Peer';
import { Models } from '../db/DB';
import * as packets from '../p2p/packets/types';
import Logger from '../Logger';
import SwapClient from './SwapClient';
import Pool from '../p2p/Pool';
import { EventEmitter } from 'events';
import SwapRepository from './SwapRepository';
import { OwnOrder, PeerOrder } from '../orderbook/types';
import assert from 'assert';
import { SwapDealInstance } from '../db/types';
import { SwapDeal, SwapSuccess, SanitySwap, ResolveRequest } from './types';
import { generatePreimageAndHash } from '../utils/utils';
import { PacketType } from '../p2p/packets';

type OrderToAccept = Pick<SwapDeal, 'quantity' | 'price' | 'localId' | 'isBuy'> & {
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
  // TODO: Populate the mapping from the database (Currency.decimalPlaces).
  private static readonly UNITS_PER_CURRENCY: { [key: string]: number } = {
    BTC: 1,
    LTC: 1,
    WETH: 10 ** 10,
  };
  /** The maximum time in milliseconds we will wait for a swap to be accepted before failing it. */
  private static readonly SWAP_ACCEPT_TIMEOUT = 10000;
  /** The maximum time in milliseconds we will wait for a swap to be completed before failing it. */
  private static readonly SWAP_COMPLETE_TIMEOUT = 30000;
  /** The maximum time in milliseconds we will wait to receive an expected sanity swap packet. */
  private static readonly SANITY_SWAP_PACKET_TIMEOUT = 3000;

  constructor(private logger: Logger,
    private models: Models,
    private pool: Pool,
    public swapClients: Map<string, SwapClient>,
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
    const { inboundCurrency, inboundAmount, outboundCurrency, outboundAmount } =
      Swaps.calculateInboundOutboundAmounts(quantity, price, isBuy, pairId);
    return {
      makerCurrency: inboundCurrency,
      makerAmount: inboundAmount,
      takerCurrency: outboundCurrency,
      takerAmount: outboundAmount,
    };
  }

  /**
   * Calculates the incoming and outgoing currencies and amounts of subunits/satoshis for an order if it is swapped.
   * @param quantity The quantity of the order
   * @param price The price of the order
   * @param isBuy Whether the order is a buy
   * @returns An object with the calculated incoming and outgoing values.
   */
  public static calculateInboundOutboundAmounts = (quantity: number, price: number, isBuy: boolean, pairId: string) => {
    const [baseCurrency, quoteCurrency] = pairId.split('/');
    const baseCurrencyAmount = Math.round(quantity * Swaps.UNITS_PER_CURRENCY[baseCurrency]);
    const quoteCurrencyAmount = Math.round(quantity * price * Swaps.UNITS_PER_CURRENCY[quoteCurrency]);

    const inboundCurrency = isBuy ? baseCurrency : quoteCurrency;
    const inboundAmount = isBuy ? baseCurrencyAmount : quoteCurrencyAmount;
    const outboundCurrency = isBuy ? quoteCurrency : baseCurrency;
    const outboundAmount = isBuy ? quoteCurrencyAmount : baseCurrencyAmount;
    return { inboundCurrency, inboundAmount, outboundCurrency, outboundAmount };
  }

  public init = async () => {
    // Load Swaps from database
    const result = await this.repository.getSwapDeals();
    result.forEach((deal: SwapDealInstance) => {
      this.usedHashes.add(deal.rHash);
    });
  }

  private bind() {
    this.pool.on('packet.sanitySwap', async (packet, peer) => {
      const { currency, rHash } = packet.body!;
      const sanitySwap: SanitySwap = {
        currency,
        rHash,
        peerPubKey: peer.nodePubKey!,
      };
      this.sanitySwaps.set(rHash, sanitySwap);
      try {
        await this.swapClients.get(currency)!.addInvoice(rHash, 1);
      } catch (err) {
        this.logger.error('could not add invoice for sanity swap', err);
        return;
      }
      await peer.sendPacket(new packets.SanitySwapAckPacket(undefined, packet.header.id));
    });
    this.pool.on('packet.swapAccepted', this.handleSwapAccepted);
    this.pool.on('packet.swapComplete', this.handleSwapComplete);
    this.pool.on('packet.swapFailed', this.handleSwapFailed);
    this.swapClients.forEach((swapClient, currency) => {
      swapClient.on('htlcAccepted', async (rHash, amount) => {
        try {
          const rPreimage = await this.resolveHash(rHash, amount, currency);
          await swapClient.settleInvoice(rHash, rPreimage);
        } catch (err) {
          this.logger.error('could not settle invoice', err);
        }
      });
    });
  }

  /**
   * Checks if there are connected swap clients for both currencies in a given trading pair.
   * @returns `true` if the pair has swap support, `false` otherwise
   */
  public isPairSupported = (pairId: string): boolean => {
    const currencies = pairId.split('/');
    const baseCurrencyClient = this.swapClients.get(currencies[0]);
    const quoteCurrencyClient = this.swapClients.get(currencies[1]);
    return baseCurrencyClient !== undefined && baseCurrencyClient.isConnected() &&
      quoteCurrencyClient !== undefined && quoteCurrencyClient.isConnected();
  }

  /**
   * Sends an error to peer. Sets reqId if packet is a response to a request.
   */
  private sendErrorToPeer = async (peer: Peer, rHash: string, failureReason: SwapFailureReason, errorMessage?: string, reqId?: string) => {
    const errorBody: packets.SwapFailedPacketBody = {
      rHash,
      failureReason,
      errorMessage,
    };
    this.logger.debug('Sending swap error to peer: ' + JSON.stringify(errorBody));
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
    this.logger.debug('New deal: ' + JSON.stringify(deal));
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

    const { makerCurrency, makerAmount } = Swaps.calculateMakerTakerAmounts(taker.quantity, maker.price, maker.isBuy, maker.pairId);

    const swapClient = this.swapClients.get(makerCurrency)!;

    const peer = this.pool.getPeer(maker.peerPubKey);
    const destination = peer.getIdentifier(swapClient.type, makerCurrency);
    if (!destination) {
      throw SwapFailureReason.SwapClientNotSetup;
    }

    let routes;
    try {
      routes = await swapClient.getRoutes(makerAmount, destination);
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
    const swapClient = this.swapClients.get(currency);
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
        swapClient.addInvoice(rHash, 1),
        peer.sendPacket(sanitySwapInitPacket),
        peer.wait(sanitySwapInitPacket.header.id, PacketType.SanitySwapAck, Swaps.SANITY_SWAP_PACKET_TIMEOUT),
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
    const { makerCurrency, makerAmount, takerCurrency, takerAmount } =
      Swaps.calculateMakerTakerAmounts(quantity, maker.price, maker.isBuy, maker.pairId);
    const clientType = this.swapClients.get(makerCurrency)!.type;
    const destination = peer.getIdentifier(clientType, makerCurrency)!;

    const takerCltvDelta = this.swapClients.get(takerCurrency)!.cltvDelta;

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

    const rHash = requestPacket.body!.rHash;
    if (this.usedHashes.has(rHash)) {
      await this.sendErrorToPeer(peer, requestPacket.body!.rHash, SwapFailureReason.PaymentHashReuse, undefined, requestPacket.header.id);
      return false;
    }
    const requestBody = requestPacket.body!;

    const { quantity, price, isBuy } = orderToAccept;

    const { makerCurrency, makerAmount, takerCurrency, takerAmount } = Swaps.calculateMakerTakerAmounts(quantity, price, isBuy, requestBody.pairId);

    const takerSwapClient = this.swapClients.get(takerCurrency);
    if (!takerSwapClient) {
      await this.sendErrorToPeer(peer, rHash, SwapFailureReason.SwapClientNotSetup, 'Unsupported taker currency', requestPacket.header.id);
      return false;
    }

    const takerPubKey = peer.getIdentifier(takerSwapClient.type, takerCurrency)!;

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
      destination: takerPubKey,
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

    // Make sure we are connected to lnd for both currencies
    if (!this.isPairSupported(deal.pairId)) {
      this.failDeal(deal, SwapFailureReason.SwapClientNotSetup);
      await this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    try {
      deal.makerToTakerRoutes = await takerSwapClient.getRoutes(takerAmount, takerPubKey);
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, err.message);
      await this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    if (deal.makerToTakerRoutes.length === 0) {
      this.failDeal(deal, SwapFailureReason.NoRouteFound, 'Unable to find route to destination');
      await this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    let height: number;
    try {
      height = await takerSwapClient.getHeight();
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, 'Unable to fetch block height: ' + err.message);
      await this.sendErrorToPeer(peer, deal.rHash, deal.failureReason!, deal.errorMessage, requestPacket.header.id);
      return false;
    }

    if (height) {
      this.logger.debug('got block height of ' + height);

      const routeCltvDelta = deal.makerToTakerRoutes[0].getTotalTimeLock() - height;

      const makerClientCltvDelta = this.swapClients.get(makerCurrency)!.cltvDelta;
      const takerClientCltvDelta = this.swapClients.get(takerCurrency)!.cltvDelta;

      // cltvDelta can't be zero for swap clients (checked in constructor)
      const cltvDeltaFactor = makerClientCltvDelta / takerClientCltvDelta;

      deal.makerCltvDelta = makerClientCltvDelta + Math.ceil(routeCltvDelta * cltvDeltaFactor);

      this.logger.debug(`total timelock of route = ${routeCltvDelta} makerCltvDelta = ${deal.makerCltvDelta}`);
    }

    const makerSwapClient = this.swapClients.get(makerCurrency)!;
    try {
      await makerSwapClient.addInvoice(deal.rHash, deal.makerAmount);
    } catch (err) {
      this.logger.error('could not add invoice for while accepting deal', err);
      return false;
    }

    const responseBody: packets.SwapAcceptedPacketBody = {
      makerCltvDelta: deal.makerCltvDelta || 1,
      rHash: requestBody.rHash,
      quantity: requestBody.proposedQuantity,
    };

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

    const makerSwapClient = this.swapClients.get(deal.makerCurrency);
    const takerSwapClient = this.swapClients.get(deal.takerCurrency);
    if (!makerSwapClient || !takerSwapClient) {
      // We checked that we had a swap client for both currencies involved during the peer handshake. Still...
      return;
    }

    try {
      await takerSwapClient.addInvoice(deal.rHash, deal.takerAmount);
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.UnexpectedClientError, err.message);
      await this.sendErrorToPeer(peer, rHash, err.message);
    }

    try {
      this.setDealPhase(deal, SwapPhase.SendingAmount);
      await makerSwapClient.sendPayment(deal);
      // TODO: check preimage from payment response vs deal.preImage

      // swap succeeded!
      this.setDealPhase(deal, SwapPhase.SwapCompleted);
      const responseBody: packets.SwapCompletePacketBody = { rHash };

      this.logger.debug('Sending swap complete to peer: ' + JSON.stringify(responseBody));
      await peer.sendPacket(new packets.SwapCompletePacket(responseBody));
    } catch (err) {
      this.failDeal(deal, SwapFailureReason.SendPaymentFailure, err.message);
      await this.sendErrorToPeer(peer, rHash, err.message);
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

    switch (deal.role) {
      case SwapRole.Maker:
        expectedAmount = deal.makerAmount;
        source = 'Taker';
        destination = 'Maker';
        break;
      case SwapRole.Taker:
        expectedAmount = deal.takerAmount;
        source = 'Maker';
        destination = 'Taker';
        break;
      default:
        // this case should never happen, something is very wrong if so.
        this.failDeal(deal, SwapFailureReason.UnknownError, 'Unknown role detected for swap deal');
        return false;
    }

    // TODO: convert amount to satoshis 1E-8

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
        const swapClient = this.swapClients.get(currency);
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
      throw new Error('unknown payment hash');
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
        throw new Error(`Something went wrong. Can't find deal: ${rHash}`);
      }
    }

    if (deal.role === SwapRole.Maker) {
      // As the maker, we need to forward the payment to the other chain
      assert(htlcCurrency === undefined || htlcCurrency === deal.makerCurrency, 'incoming htlc does not match expected deal currency');

	    this.logger.debug('Executing maker code to resolve hash');

      const swapClient = this.swapClients.get(deal.takerCurrency)!;

      try {
        this.setDealPhase(deal, SwapPhase.SendingAmount);
        deal.rPreimage = await swapClient.sendPayment(deal);
        this.setDealPhase(deal, SwapPhase.AmountReceived);
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

      this.setDealPhase(deal, SwapPhase.AmountReceived);
      return deal.rPreimage!;
    }
  }

  public handleResolveRequest = async (resolveRequest: ResolveRequest): Promise<string> => {
    const { amount, rHash } = resolveRequest;

    this.logger.debug('handleResolveRequest starting with hash: ' + rHash);

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
        deal.errorMessage = deal.errorMessage ? deal.errorMessage + '; ' + errorMessage : errorMessage;
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
    const swapClient = this.swapClients.get(deal.role === SwapRole.Maker ? deal.makerCurrency : deal.takerCurrency);
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
