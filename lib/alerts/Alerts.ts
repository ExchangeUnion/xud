import { EventEmitter } from 'events';
import { Alert, BalanceAlert } from './types';
import SwapClientManager from '../swaps/SwapClientManager';
import Logger from '../Logger';
import { AlertType, ChannelSide } from '../constants/enums';
import { satsToCoinsStr } from '../cli/utils';

interface Alerts {
  on(event: 'alert', listener: (alert: Alert) => void): this;
  emit(event: 'alert', alert: Alert): boolean;
}

// TODO this class still requires a cleanup if alert is not being thrown anymore after a while
/**
 * This class works as a middleware for thrown alerts from xud's main flow. Each alert will be caught here
 * and re-thrown if last thrown time was before the minimum threshold that set in consts.ts
 */
class Alerts extends EventEmitter {
  /** The minimum time in miliseconds to be passed to rethrow a balance alert. */
  private static readonly MIN_BALANCE_ALERT_THRESHOLD_IN_MS = 10000;
  private alerts = new Map<string, number>();
  private logger: Logger;

  constructor({ swapClientManager, logger }: { swapClientManager: SwapClientManager; logger: Logger }) {
    super();
    this.logger = logger;
    this.listenLowTradingBalanceAlerts(swapClientManager);
  }

  private listenLowTradingBalanceAlerts(swapClientManager: SwapClientManager) {
    const lndClients = swapClientManager.getLndClientsMap().values();
    for (const lndClient of lndClients) {
      lndClient.on('lowTradingBalance', this.onLowTradingBalance);
    }
    swapClientManager.connextClient?.on('lowTradingBalance', this.onLowTradingBalance);
  }

  private onLowTradingBalance = (balanceAlert: BalanceAlert) => {
    // TODO don't use JSON.stringify instead find a way to define unique ids per alert and keep in the map to avoid memory issues
    const stringRepresentation = JSON.stringify(balanceAlert);
    this.logger.trace(`received low trading balance alert ${stringRepresentation}`);
    if (this.alerts.get(stringRepresentation) === undefined || this.checkAlertThreshold(stringRepresentation)) {
      this.logger.trace(`triggering low balance alert ${stringRepresentation}`);

      balanceAlert.message = `${ChannelSide[balanceAlert.side || 0]} trading balance (${satsToCoinsStr(
        balanceAlert.sideBalance || 0,
      )} ${balanceAlert.currency}) is lower than 10% of trading capacity (${satsToCoinsStr(
        balanceAlert.totalBalance || 0,
      )} ${balanceAlert.currency})`;
      balanceAlert.type = AlertType.LowTradingBalance;
      balanceAlert.date = Date.now();

      this.alerts.set(stringRepresentation, balanceAlert.date);
      this.emit('alert', balanceAlert);
    }
  };

  private checkAlertThreshold(stringRepresentation: string) {
    const lastThrownTime = this.alerts.get(stringRepresentation) || 0;
    const passedTime = Date.now() - lastThrownTime;
    return passedTime > Alerts.MIN_BALANCE_ALERT_THRESHOLD_IN_MS;
  }
}

export default Alerts;
