import Logger from './Logger';
import { EventEmitter } from 'events';

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

/**
 * A base class to represent a client for an external service such as LND or Raiden.
 */
abstract class BaseClient extends EventEmitter {
  protected status: ClientStatus = ClientStatus.NotInitialized;
  protected reconnectionTimer?: NodeJS.Timer;

  /** Time in milliseconds between attempts to recheck connectivity to the client. */
  protected static readonly RECONNECT_TIMER = 5000;

  private updateCapacityTimer?: NodeJS.Timer;
  private CAPACITY_CACHE_TIMEOUT = 1000;

  constructor(protected logger: Logger) {
    super();
  }

  /**
   * Returns the total balance available across all channels.
   */
  public abstract channelBalance(): Promise<ChannelBalance>;
  public async close() {
    if (this.updateCapacityTimer) {
      clearTimeout(this.updateCapacityTimer);
    }
    await this.stop();
  }

  protected abstract stop(): Promise<void>;
  protected abstract updateMaximumCapacity(): number;

  protected setStatus(status: ClientStatus): void {
    this.logger.info(`${this.constructor.name} status: ${ClientStatus[status]}`);
    this.status = status;
    this.checkTimers();
  }
  private checkTimers() {
    if (this.status === ClientStatus.ConnectionVerified) {
      this.updateCapacityTimer = setInterval(this.updateMaximumCapacity, this.CAPACITY_CACHE_TIMEOUT);
    } else {
      if (this.updateCapacityTimer) {
        clearTimeout(this.updateCapacityTimer);
      }
    }
  }
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
    this.closeSpecific();
  }
  protected abstract closeSpecific(): void;
}

export default BaseClient;
export { ClientStatus, ChannelBalance };
