import SwapClientManager from './SwapClientManager';
import { SwapDealInstance } from '../db/types';
import Logger from '../Logger';
import { SwapPhase, SwapState, SwapFailureReason, SwapRole, SwapClientType } from '../constants/enums';
import SwapClient, { PaymentState } from './SwapClient';

/**
 * A class that's responsible for recovering swap deals that were interrupted due to a system or xud crash,
 * ensuring that we do not lose funds on a partially completed swap.
 */
class SwapRecovery {
  /** A set of swaps where we have a pending outgoing payment for swaps where we don't know the preimage. */
  public pendingSwaps: Set<SwapDealInstance> = new Set();
  private pendingSwapsTimer?: NodeJS.Timeout;
  /** The time in milliseconds between checks on the status of pending swaps. */
  private static readonly PENDING_SWAP_RECHECK_INTERVAL = 300000;

  constructor(private swapClientManager: SwapClientManager, private logger: Logger) { }

  public beginTimer = () => {
    if (!this.pendingSwapsTimer) {
      this.pendingSwapsTimer = setInterval(this.checkPendingSwaps, SwapRecovery.PENDING_SWAP_RECHECK_INTERVAL);
    }
  }

  private checkPendingSwaps = () => {
    this.pendingSwaps.forEach(pendingSwap => this.recoverDeal(pendingSwap).catch(this.logger.error));
  }

  public stopTimer = () => {
    if (this.pendingSwapsTimer) {
      clearInterval(this.pendingSwapsTimer);
      this.pendingSwapsTimer = undefined;
    }
  }

  private failDeal = async (deal: SwapDealInstance, receivingSwapClient?: SwapClient) => {
    if (receivingSwapClient) {
      try {
        await receivingSwapClient.removeInvoice(deal.rHash);
      } catch (err) {
        this.logger.error(`could not remove invoice for ${deal.rHash}`, err);
      }
    }
    deal.state = SwapState.Error;
    deal.failureReason = SwapFailureReason.Crash;
    this.pendingSwaps.delete(deal);
    await deal.save();
  }

  public recoverDeal = async (deal: SwapDealInstance) => {
    const makerSwapClient = this.swapClientManager.get(deal.makerCurrency);
    const takerSwapClient = this.swapClientManager.get(deal.takerCurrency);
    if (!makerSwapClient || !makerSwapClient.isConnected()) {
      this.logger.warn(`could not recover deal ${deal.rHash} because ${deal.makerCurrency} swap client is offline`);
      this.pendingSwaps.add(deal);
      return;
    }
    if (!takerSwapClient || !takerSwapClient.isConnected()) {
      this.logger.warn(`could not recover deal ${deal.rHash} because ${deal.takerCurrency} swap client is offline`);
      this.pendingSwaps.add(deal);
      return;
    }

    this.logger.info(`recovering swap deal ${deal.rHash}`);
    switch (deal.phase) {
      case SwapPhase.SwapAccepted:
        // we accepted the deal but stopped before sending payment
        // cancel the open invoice if we have one
        await this.failDeal(deal, makerSwapClient);
        break;
      case SwapPhase.SendingPayment:
        // we started sending payment but didn't claim our payment
        if (deal.role === SwapRole.Maker) {
          // we should check to see if our payment went through
          // if it did, we can claim payment with the preimage for our side of the swap
          const paymentStatus = await takerSwapClient.lookupPayment(deal.rHash);
          if (paymentStatus.state === PaymentState.Succeeded) {
            try {
              deal.rPreimage = paymentStatus.preimage!;
              if (makerSwapClient.type === SwapClientType.Raiden) {
                // tslint:disable-next-line: max-line-length
                this.logger.warn(`cannot claim payment on Raiden for swap ${deal.rHash} using preimage ${deal.rPreimage}, this should be investigated manually`);
              } else {
                await makerSwapClient.settleInvoice(deal.rHash, deal.rPreimage);
                this.logger.info(`recovered ${deal.makerCurrency} swap payment of ${deal.makerAmount} using preimage ${deal.rPreimage}`);
              }
              deal.state = SwapState.Recovered;
              this.pendingSwaps.delete(deal);
              await deal.save();
              // TODO: update order and trade in database to indicate they were executed
            } catch (err) {
              // tslint:disable-next-line: max-line-length
              this.logger.error(`could not settle ${deal.makerCurrency} invoice for payment ${deal.rHash} and preimage ${deal.rPreimage}, this should be investigated manually`, err);
              await this.failDeal(deal);
            }
          } else if (paymentStatus.state === PaymentState.Failed) {
            // the payment failed, so cancel the open invoice if we have one
            await this.failDeal(deal, makerSwapClient);
          } else {
            // the payment is pending, we will need to follow up on this
            this.logger.info(`recovered swap for ${deal.rHash} still has pending payments and will be monitored`);
            this.pendingSwaps.add(deal);
          }
        } else if (deal.role === SwapRole.Taker) {
          // we are not at risk of losing funds, but we should cancel any open invoices
          await this.failDeal(deal, takerSwapClient);
        }
        break;
      case SwapPhase.PaymentReceived:
        // we've claimed our payment
        // TODO: send a swap completed packet? it may be too late to do so
        deal.state = SwapState.Recovered;
        await deal.save();
        break;
      default:
        break;
    }

  }
}

export default SwapRecovery;
