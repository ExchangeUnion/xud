import {
  SwapClientType,
  SwapFailureReason,
  SwapPhase,
  SwapRole,
  SwapState,
} from '../constants/enums';
import { SwapDealInstance } from '../db/types';
import Logger from '../Logger';
import SwapClient, { PaymentState } from './SwapClient';
import SwapClientManager from './SwapClientManager';

/**
 * A class that's responsible for recovering swap deals that were interrupted due to a system or xud crash,
 * ensuring that we do not lose funds on a partially completed swap.
 */
class SwapRecovery {
  /** A map of payment hashes to swaps where we have recovered the preimage but not used it to claim payment yet. */
  public recoveredPreimageSwaps: Map<string, SwapDealInstance> = new Map();
  /** A map of payment hashes to swaps where we have a pending outgoing payment but don't know the preimage. */
  private pendingSwaps: Map<string, SwapDealInstance> = new Map();
  private pendingSwapsTimer?: NodeJS.Timeout;
  /** The time in milliseconds between checks on the status of pending swaps. */
  private static readonly PENDING_SWAP_RECHECK_INTERVAL = 300000;

  constructor(
    private swapClientManager: SwapClientManager,
    private logger: Logger
  ) {}

  public beginTimer = () => {
    if (!this.pendingSwapsTimer) {
      this.pendingSwapsTimer = setInterval(
        this.checkPendingSwaps,
        SwapRecovery.PENDING_SWAP_RECHECK_INTERVAL
      );
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
    this.pendingSwaps.forEach(pendingSwap =>
      this.checkPaymentStatus(pendingSwap).catch(this.logger.error)
    );
  };

  private failDeal = async (
    deal: SwapDealInstance,
    receivingSwapClient?: SwapClient
  ) => {
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
   * Checks the status of the outgoing payment for a swap where we have begun
   * sending a payment and handles the resolution of the swap once a final
   * status for the payment is determined.
   */
  private checkPaymentStatus = async (deal: SwapDealInstance) => {
    this.logger.debug(
      `checking outgoing payment status for swap ${deal.rHash}`
    );
    // ensure that we are tracking this pending swap
    this.pendingSwaps.set(deal.rHash, deal);

    const takerSwapClient = this.swapClientManager.get(deal.takerCurrency);
    if (!takerSwapClient || !takerSwapClient.isConnected()) {
      this.logger.warn(
        `could not recover deal ${deal.rHash} because ${deal.takerCurrency} swap client is offline`
      );
      return;
    }

    if (deal.role === SwapRole.Maker) {
      // we should check to see if our payment went through
      // if it did, we can claim payment with the preimage for our side of the swap
      const makerSwapClient = this.swapClientManager.get(deal.makerCurrency);
      if (!makerSwapClient || !makerSwapClient.isConnected()) {
        this.logger.warn(
          `could not recover deal ${deal.rHash} because ${deal.makerCurrency} swap client is offline`
        );
        this.pendingSwaps.set(deal.rHash, deal);
        return;
      }

      const paymentStatus = await takerSwapClient.lookupPayment(
        deal.rHash,
        deal.takerCurrency
      );
      if (paymentStatus.state === PaymentState.Succeeded) {
        try {
          deal.rPreimage = paymentStatus.preimage!;
          if (makerSwapClient.type === SwapClientType.Raiden) {
            this.logger.info(
              `recovered preimage ${deal.rPreimage} for swap ${deal.rHash}, ` +
                'waiting for raiden to request secret and claim payment.'
            );
            this.recoveredPreimageSwaps.set(deal.rHash, deal);
          } else {
            await makerSwapClient.settleInvoice(
              deal.rHash,
              deal.rPreimage,
              deal.makerCurrency
            );
            deal.state = SwapState.Recovered;
            this.logger.info(
              `recovered ${deal.makerCurrency} swap payment of ${deal.makerAmount} using preimage ${deal.rPreimage}`
            );
          }

          this.pendingSwaps.delete(deal.rHash);
          await deal.save();
          // TODO: update order and trade in database to indicate they were executed
        } catch (err) {
          // tslint:disable-next-line: max-line-length
          this.logger.error(
            `could not settle ${deal.makerCurrency} invoice for payment ${deal.rHash} and preimage ${deal.rPreimage}, **this must be resolved manually**`,
            err
          );
          await this.failDeal(deal);
        }
      } else if (paymentStatus.state === PaymentState.Failed) {
        // the payment failed, so cancel the open invoice if we have one
        await this.failDeal(deal, makerSwapClient);
      } else {
        // the payment is pending, we will need to follow up on this
        this.logger.debug(
          `swap for ${deal.rHash} still has pending payments and will be monitored`
        );
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
