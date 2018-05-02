import Logger from './Logger';

enum ClientStatus {
  DISABLED,
  CONNECTION_VERIFIED,
}

abstract class BaseClient {
  logger: Logger;
  status!: ClientStatus;

  constructor() {
    this.logger = Logger.global;
  }

  setStatus(val: ClientStatus): void {
    this.logger.info(`${this.constructor.name} status: ${ClientStatus[val]}`);
    this.status = val;
  }

  isDisabled(): boolean {
    return this.status === ClientStatus.DISABLED;
  }
}

export default BaseClient;
export { ClientStatus };
