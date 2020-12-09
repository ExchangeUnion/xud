import assert from 'assert';
import { EventEmitter } from 'events';
import { SwapFailureReason, SwapPhase, SwapRole, SwapState } from '../constants/enums';
import { SwapDealInstance } from '../db/types';
import Logger from '../Logger';
import SwapClient, { PaymentState } from './SwapClient';
import SwapClientManager from './SwapClientManager';

interface SwapRecovery {
  on(event: 'recovered', listener: (recoveredSwap: SwapDealInstance) => void): this;
  emit(event: 'recovered', recoveredSwap: SwapDealInstance): boolean;
}

/**
 * A class that's responsible for recovering swap deals that were interrupted due to a system or xud crash,
 * ensuring that we do not lose funds on a partially completed swap.
 */
class SwapRecovery extends EventEmitter {
  public static readonly PENDING_SWAP_RECHECK_INTERVAL = 300000;

  /** A map of payment hashes to swaps where we have a pending outgoing payment but don't know the preimage. */
  private pendingSwaps: Map<string, SwapDealInstance> = new Map();
  private pendingSwapsTimer?: NodeJS.Timeout;
  /** The time in milliseconds between checks on the status of pending swaps. */

  constructor(private swapClientManager: SwapClientManager, private logger: Logger) {
    super();
  }

  public beginTimer = () => {
    if (!this.pendingSwapsTimer) {
      this.pendingSwapsTimer = setInterval(this.checkPendingSwaps, SwapRecovery.PENDING_SWAP_RECHECK_INTERVAL);
    }
  };

  public stopTimer = () => {
    if (this.pendingSwapsTimer) {
      clearInterval(this.pendingSwapsTimer);
      this.pendingSwapsTimer = undefined;
    }
  };

  public getPendingSwapHashes = () => {
    return Array.from(this.pendingSwaps.keys());
  };

  private checkPendingSwaps = () => {
    this.pendingSwaps.forEach((pendingSwap) => this.checkPaymentStatus(pendingSwap).catch(this.logger.error));
  };

  private failDeal = async (deal: SwapDealInstance, receivingSwapClient?: SwapClient) => {
    if (receivingSwapClient) {
      try {
        await receivingSwapClient.removeInvoice(deal.rHash);
      } catch (err) {
        this.logger.warn(`could not remove invoice for ${deal.rHash}: ${err}`);
      }
    }

    if (deal.state !== SwapState.Error) {
      deal.state = SwapState.Error;
      deal.failureReason = SwapFailureReason.Crash;
    }

    this.logger.info(`failed swap ${deal.rHash}`);
    this.pendingSwaps.delete(deal.rHash);
    await deal.save();
  };

  /**
   * Claims the incoming payment for a deal where the outgoing payment has
   * already gone through and where we already know the preimage.
   */
  private claimPayment = async (deal: SwapDealInstance) => {
    assert(deal.rPreimage);

    // the maker payment is always the one that is claimed second, after the payment to taker
    const makerSwapClient = this.swapClientManager.get(deal.makerCurrency);
    if (!makerSwapClient || !makerSwapClient.isConnected()) {
      this.logger.warn(
        `could not claim payment for ${deal.rHash} because ${deal.makerCurrency} swap client is offline`,
      );
      return;
    }

    try {
      await makerSwapClient.settleInvoice(deal.rHash, deal.rPreimage, deal.makerCurrency);
      deal.state = SwapState.Recovered;
      this.logger.info(
        `recovered ${deal.makerCurrency} swap payment of ${deal.makerAmount} using preimage ${deal.rPreimage}`,
      );
      this.pendingSwaps.delete(deal.rHash);
      await deal.save();
      this.emit('recovered', deal);
    } catch (err) {
      this.logger.error(`could not settle ${deal.makerCurrency} invoice for payment ${deal.rHash}`, err);
      this.logger.alert(
        `incoming ${deal.makerCurrency} payment with hash ${deal.rHash} could not be settled with preimage ${deal.rPreimage}, **funds may be lost and this must be investigated manually**`,
      );
      // TODO: determine when we are permanently unable (due to htlc expiration or unknown invoice hash) to
      // settle an invoice and fail the deal, rather than endlessly retrying settle invoice calls
    }
  };

  /**
   * Checks the status of the outgoing payment for a swap where we have begun
   * sending a payment and handles the resolution of the swap once a final
   * status for the payment is determined.
   */
  private checkPaymentStatus = async (deal: SwapDealInstance) => {
    // ensure that we are tracking this pending swap
    this.pendingSwaps.set(deal.rHash, deal);

    if (deal.rPreimage) {
      // if we already have the preimage for this deal, we can attempt to claim our payment right away
      await this.claimPayment(deal);
      return;
    }

    this.logger.debug(`checking outgoing payment status for swap ${deal.rHash}`);

    const takerSwapClient = this.swapClientManager.get(deal.takerCurrency);
    if (!takerSwapClient || !takerSwapClient.isConnected()) {
      this.logger.warn(`could not recover deal ${deal.rHash} because ${deal.takerCurrency} swap client is offline`);
      return;
    }

    if (deal.role === SwapRole.Maker) {
      // we should check to see if our payment went through
      // if it did, we can claim payment with the preimage for our side of the swap
      const makerSwapClient = this.swapClientManager.get(deal.makerCurrency);
      if (!makerSwapClient || !makerSwapClient.isConnected()) {
        this.logger.warn(`could not recover deal ${deal.rHash} because ${deal.makerCurrency} swap client is offline`);
        return;
      }

      const paymentStatus = await takerSwapClient.lookupPayment(deal.rHash, deal.takerCurrency);
      if (paymentStatus.state === PaymentState.Succeeded) {
        deal.rPreimage = paymentStatus.preimage!;
        await deal.save(); // persist the preimage to the database once we retrieve it

        await this.claimPayment(deal);
      } else if (paymentStatus.state === PaymentState.Failed) {
        // the payment failed, so cancel the open invoice if we have one
        await this.failDeal(deal, makerSwapClient);
      } else {
        // the payment is pending, we will need to follow up on this
        this.logger.debug(`swap for ${deal.rHash} still has pending payments and will be monitored`);
      }
    } else if (deal.role === SwapRole.Taker) {
      // we are not at risk of losing funds, but we should cancel any open invoices
      await this.failDeal(deal, takerSwapClient);
    }
  };

  /**
   * Attempts to recover a swap deal from whichever state it was left in
   * including canceling or settling any related invoices & payments.
   */
  public recoverDeal = async (deal: SwapDealInstance) => {
    if (this.pendingSwaps.has(deal.rHash)) {
      return; // we are already monitoring & attempting to recover this deal
    }

    this.logger.info(`recovering swap deal ${deal.rHash}`);
    switch (deal.phase) {
      case SwapPhase.SwapAccepted:
        // we accepted the deal but stopped before sending payment
        // cancel the open invoice if we have one
        const makerSwapClient = this.swapClientManager.get(deal.makerCurrency);
        await this.failDeal(deal, makerSwapClient);
        break;
      case SwapPhase.SendingPayment:
      case SwapPhase.PreimageResolved:
        // we started sending payment but didn't claim our payment
        await this.checkPaymentStatus(deal);
        break;
      case SwapPhase.PaymentReceived:
        // we've claimed our payment
        deal.state = SwapState.Recovered;
        await deal.save();
        break;
      default:
        break;
    }
  };
}

export default SwapRecovery;
