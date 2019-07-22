import Logger from '../Logger';
import { EventEmitter } from 'events';
import { SwapDeal, Route } from './types';
import { SwapClientType } from '../constants/enums';

enum ClientStatus {
  NotInitialized,
  Disabled,
  Disconnected,
  ConnectionVerified,
  OutOfSync,
  WaitingUnlock,
}

type ChannelBalance = {
  /** The cumulative balance of open channels denominated in satoshis. */
  balance: number,
  /** The cumulative balance of pending channels denominated in satoshis. */
  pendingOpenBalance: number,
};

export type SwapClientInfo = {
  newIdentifier?: string;
  newUris?: string[];
};

interface SwapClient {
  on(event: 'connectionVerified', listener: (swapClientInfo: SwapClientInfo) => void): this;
  emit(event: 'connectionVerified', swapClientInfo: SwapClientInfo): boolean;
}

/**
 * A base class to represent an external swap client such as lnd or Raiden.
 */
abstract class SwapClient extends EventEmitter {
  public abstract readonly cltvDelta: number;
  public abstract readonly type: SwapClientType;
  protected status: ClientStatus = ClientStatus.NotInitialized;
  protected reconnectionTimer?: NodeJS.Timer;
  /** Time in milliseconds between attempts to recheck connectivity to the client. */
  protected static readonly RECONNECT_TIMER = 5000;

  private updateCapacityTimer?: NodeJS.Timer;
  /** Time in milliseconds between updating the maximum outbound capacity */
  private static CAPACITY_REFRESH_INTERVAL = 60000;

  constructor(public logger: Logger) {
    super();
  }

  /**
   * Returns the total balance available across all channels.
   * @param currency the currency whose balance to query for, otherwise all/any
   * currencies supported by this client are included in the balance.
   */
  public abstract channelBalance(currency?: string): Promise<ChannelBalance>;
  public abstract maximumOutboundCapacity(currency?: string): number;
  protected abstract updateCapacity(): Promise<void>;

  protected setStatus = async (status: ClientStatus): Promise<void> => {
    this.logger.info(`${this.constructor.name} status: ${ClientStatus[status]}`);
    this.status = status;
    await this.setTimers();
  }

  private setTimers = async () => {
    if (this.status === ClientStatus.ConnectionVerified) {
      if (!this.updateCapacityTimer) {
        await this.updateCapacity();
        this.updateCapacityTimer = setInterval(this.updateCapacity, SwapClient.CAPACITY_REFRESH_INTERVAL);
      }

      if (this.reconnectionTimer) {
        clearTimeout(this.reconnectionTimer);
        this.reconnectionTimer = undefined;
      }
    } else {
      if (this.updateCapacityTimer) {
        clearInterval(this.updateCapacityTimer);
        this.updateCapacityTimer = undefined;
      }
      if (this.status !== ClientStatus.Disabled) {
        if (!this.reconnectionTimer) {
          this.reconnectionTimer = setTimeout(this.verifyConnection, SwapClient.RECONNECT_TIMER);
        } else {
          this.reconnectionTimer.refresh();
        }
      }
    }
  }

  /**
   * Verifies that the swap client can be reached and is in an operational state
   * and sets the [[ClientStatus]] accordingly.
   */
  protected abstract async verifyConnection(): Promise<void>;

  /**
   * Sends payment according to the terms of a swap deal.
   * @returns the preimage for the swap
   */
  public abstract async sendPayment(deal: SwapDeal): Promise<string>;

  /**
   * Sends the smallest amount supported by the client to the given destination.
   * Throws an error if the payment fails.
   * @returns the preimage for the payment hash
   */
  public abstract async sendSmallestAmount(rHash: string, destination: string, currency: string): Promise<string>;

  /**
   * Gets routes for the given currency, amount, and swap identifier.
   * @param amount the capacity the route must support denominated in the smallest units supported by its currency
   * @param destination the identifier for the receiving node
   * @returns routes
   */
  public abstract async getRoutes(amount: number, destination: string, currency: string, finalCltvDelta?: number): Promise<Route[]>;

  public abstract async addInvoice(rHash: string, amount: number, cltvExpiry: number): Promise<void>;

  public abstract async settleInvoice(rHash: string, rPreimage: string): Promise<void>;

  public abstract async removeInvoice(rHash: string): Promise<void>;

  /**
   * Gets the block height of the chain backing this swap client.
   */
  public abstract async getHeight(): Promise<number>;

  /**
   * Opens a payment channel given peerIdentifier, amount
   * optional currency and optional lndUris.
   */
  public abstract async openChannel(
    { peerIdentifier, units, currency, lndUris }:
    {
      peerIdentifier: string,
      units: number,
      currency?: string,
      lndUris?: string[],
    },
  ): Promise<void>;

  public isConnected(): boolean {
    return this.status === ClientStatus.ConnectionVerified;
  }
  public isDisabled(): boolean {
    return this.status === ClientStatus.Disabled;
  }
  public isDisconnected(): boolean {
    return this.status === ClientStatus.Disconnected;
  }
  public isWaitingUnlock(): boolean {
    return this.status === ClientStatus.WaitingUnlock;
  }
  public isNotInitialized(): boolean {
    return this.status === ClientStatus.NotInitialized;
  }
  /** Ends all connections, subscriptions, and timers for for this client. */
  public async close() {
    await this.disconnect();
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
    }
    if (this.updateCapacityTimer) {
      clearInterval(this.updateCapacityTimer);
    }
    this.removeAllListeners();
  }
  protected abstract async disconnect(): Promise<void>;
}

export default SwapClient;
export { ClientStatus, ChannelBalance };
