import Logger from './Logger';
import { EventEmitter } from 'events';

enum ClientStatus {
  DISABLED,
  DISCONNECTED,
  CONNECTION_VERIFIED,
}

/**
 * A base class to represent a client for an external service such as LND or Raiden.
 */
abstract class BaseClient extends EventEmitter {
  protected logger: Logger;
  protected status: ClientStatus = ClientStatus.DISABLED;

  constructor(logger: Logger) {
    super();

    this.logger = logger;
  }

  protected setStatus(val: ClientStatus): void {
    this.logger.info(`${this.constructor.name} status: ${ClientStatus[val]}`);
    this.status = val;
  }
  public isConnected(): boolean {
    return this.status === ClientStatus.CONNECTION_VERIFIED;
  }
  public isDisabled(): boolean {
    return this.status === ClientStatus.DISABLED;
  }
  public isDisconnected(): boolean {
    return this.status === ClientStatus.DISCONNECTED;
  }
}

export default BaseClient;
export { ClientStatus };
