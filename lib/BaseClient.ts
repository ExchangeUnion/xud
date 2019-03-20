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
}

export default BaseClient;
export { ClientStatus, ChannelBalance };
