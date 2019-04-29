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
}

type ChannelBalance = {
  balance: number,
  pendingOpenBalance: number,
};

interface SwapClient {
  on(event: 'connectionVerified', listener: (newIdentifier?: string) => void): this;
  on(event: 'htlcAccepted', listener: (rHash: string, amount: number) => void): this;
  emit(event: 'connectionVerified', newIdentifier?: string): boolean;
  emit(event: 'htlcAccepted', rHash: string, amount: number): boolean;
}

/**
 * A base class to represent an external swap client such as lnd or Raiden.
 */
abstract class SwapClient extends EventEmitter {
  public abstract readonly cltvDelta: number;
  public abstract readonly type: SwapClientType;
  public maximumOutboundCapacity = 0;
  protected status: ClientStatus = ClientStatus.NotInitialized;
  protected reconnectionTimer?: NodeJS.Timer;
  /** Time in milliseconds between attempts to recheck connectivity to the client. */
  protected static readonly RECONNECT_TIMER = 5000;

  private updateCapacityTimer?: NodeJS.Timer;
  /** Time in milliseconds between updating the maximum outbound capacity */
  private static CAPACITY_REFRESH_INTERVAL = 60000;

  constructor(protected logger: Logger) {
    super();
  }

  /**
   * Returns the total balance available across all channels.
   */
  public abstract channelBalance(): Promise<ChannelBalance>;

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

  private updateCapacity = async () => {
    try {
      this.maximumOutboundCapacity = (await this.channelBalance()).balance;
    } catch (e) {
      // TODO: Mark client as disconnected
      this.logger.error(`failed to fetch channelbalance from client: ${e}`);
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
   * Gets routes for the given currency, amount and peerPubKey.
   * @param amount the capacity of the route
   * @param destination target node for the route
   * @returns routes
   */
  public abstract async getRoutes(amount: number, destination: string): Promise<Route[]>;

  public abstract async addInvoice(rHash: string, amount: number): Promise<void>;

  public abstract async settleInvoice(rHash: string, rPreimage: string): Promise<void>;

  public abstract async removeInvoice(rHash: string): Promise<void>;

  /**
   * Gets the block height of the chain backing this swap client.
   */
  public abstract async getHeight(): Promise<number>;

  public isConnected(): boolean {
    return this.status === ClientStatus.ConnectionVerified;
  }
  public isDisabled(): boolean {
    return this.status === ClientStatus.Disabled;
  }
  public isDisconnected(): boolean {
    return this.status === ClientStatus.Disconnected;
  }
  /** Ends all connections, subscriptions, and timers for for this client. */
  public close() {
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
    }
    if (this.updateCapacityTimer) {
      clearInterval(this.updateCapacityTimer);
    }
    this.closeSpecific();
    this.removeAllListeners();
  }
  protected abstract closeSpecific(): void;
}

export default SwapClient;
export { ClientStatus, ChannelBalance };
