import Logger from './Logger';

enum ClientStatus {
  DISABLED,
  CONNECTION_VERIFIED,
}

abstract class BaseClient {
  protected logger: Logger;
  protected status!: ClientStatus;

  constructor() {
    this.logger = Logger.global;
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
