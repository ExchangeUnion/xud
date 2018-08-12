import Logger from './Logger';
import { EventEmitter } from 'events';

enum ClientStatus {
  DISABLED,
  CONNECTION_VERIFIED,
}

abstract class BaseClient extends EventEmitter {
  protected logger: Logger;
  protected status!: ClientStatus;

  constructor(logger: Logger) {
    super();

    this.logger = logger;
  }

  protected setStatus(val: ClientStatus): void {
    this.logger.info(`${this.constructor.name} status: ${ClientStatus[val]}`);
    this.status = val;
  }

  public isDisabled(): boolean {
    return this.status === ClientStatus.DISABLED;
  }
}

export default BaseClient;
export { ClientStatus };
