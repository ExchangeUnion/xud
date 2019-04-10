import Logger from './Logger';
import { EventEmitter } from 'events';
import { SwapDeal, Route } from './swaps/types';
import { SwapClient } from './constants/enums';

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

interface BaseClient {
  on(event: 'connectionVerified', listener: (newIdentifier?: string) => void): this;
  emit(event: 'connectionVerified', newIdentifier?: string): boolean;
}

/**
 * A base class to represent an external swap client such as lnd or Raiden.
 */
abstract class BaseClient extends EventEmitter {
  public abstract readonly cltvDelta: number;
  public abstract readonly type: SwapClient;
  public maximumOutboundCapacity = 0;
  protected status: ClientStatus = ClientStatus.NotInitialized;
  protected reconnectionTimer?: NodeJS.Timer;

  /** Time in milliseconds between attempts to recheck connectivity to the client. */
  protected static readonly RECONNECT_TIMER = 5000;
  private updateCapacityTimer?: NodeJS.Timer;
  /** Time in milliseconds between updating the maximum outbound capacity */
  private CAPACITY_REFRESH_INTERVAL = 60000;

  constructor(protected logger: Logger) {
    super();
  }

  /**
   * Returns the total balance available across all channels.
   */
  public abstract channelBalance(): Promise<ChannelBalance>;
  protected setStatus(status: ClientStatus): void {
    this.logger.info(`${this.constructor.name} status: ${ClientStatus[status]}`);
    this.status = status;
    this.checkTimers();
  }
  private checkTimers() {
    if (this.status === ClientStatus.ConnectionVerified) {
      this.updateCapacityTimer = setInterval(async () => {
        try {
          this.maximumOutboundCapacity = (await this.channelBalance()).balance;
        } catch (e) {
          // TODO: Mark client as disconnected
          this.logger.error(`failed to fetch channelbalance from client: ${e}`);
        }
      }, this.CAPACITY_REFRESH_INTERVAL);
    } else {
      if (this.updateCapacityTimer) {
        clearInterval(this.updateCapacityTimer);
      }
    }
  }

  /**
   * Sends payment according to the terms of a swap deal.
   * @returns the preimage for the swap
   */
  public abstract async sendPayment(deal: SwapDeal): Promise<string>;

  /**
   * Gets routes for the given currency, amount and peerPubKey.
   * @param amount the capacity of the route
   * @param destination target node for the route
   * @returns routes
   */
  public abstract async getRoutes(amount: number, destination: string): Promise<Route[]>;

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

export default BaseClient;
export { ClientStatus, ChannelBalance };
