import Config from '../Config';
import SwapClient from './SwapClient';
import LndClient from '../lndclient/LndClient';
import { LndLogger, LndPubKeys, LndInfos } from '../lndclient/types';
import RaidenClient from '../raidenclient/RaidenClient';
import Logger, { Loggers } from '../Logger';
import Pool from '../p2p/Pool';
import { errors } from './errors';
import { Currency } from '../orderbook/types';
import { isLndClient, isRaidenClient } from './types';

class SwapClientManager {
  /** A map between currencies and all swap clients */
  public swapClients = new Map<string, SwapClient>();
  public raidenClient: RaidenClient;

  constructor(
    private config: Config,
    private loggers: Loggers,
    private pool: Pool,
  ) {
    this.raidenClient = new RaidenClient(config.raiden, loggers.raiden);
  }

  /**
   * Wraps each lnd logger call with currency.
   * @returns A wrapped lnd logger object.
   */
  private static wrapLndLogger = (logger: Logger, currency: string): LndLogger => {
    return {
      error: (msg: string) => logger.error(`${currency}: ${msg}`),
      warn: (msg: string) => logger.warn(`${currency}: ${msg}`),
      info: (msg: string) => logger.info(`${currency}: ${msg}`),
      verbose: (msg: string) => logger.verbose(`${currency}: ${msg}`),
      debug: (msg: string) => logger.debug(`${currency}: ${msg}`),
      trace: (msg: string) => logger.trace(`${currency}: ${msg}`),
    };
  }

  /**
   * Starts all swap clients, binds event listeners
   * and waits for the swap clients to initialize.
   * @returns A promise that resolves upon successful initialization, rejects otherwise.
   */
  public init = async (): Promise<void> => {
    const initPromises = [];
    // setup LND clients and initialize
    for (const currency in this.config.lnd) {
      const lndConfig = this.config.lnd[currency]!;
      if (!lndConfig.disable) {
        const lndClient = new LndClient(
          lndConfig,
          currency,
          (SwapClientManager.wrapLndLogger(this.loggers.lnd, currency) as Logger),
        );
        this.swapClients.set(currency, lndClient);
        initPromises.push(lndClient.init());
      }
    }
    // setup raiden client and connect if configured
    const raidenEnabled = !this.config.raiden.disable;
    if (raidenEnabled) {
      initPromises.push(this.raidenClient.init());
    }
    // bind event listeners
    this.bind();
    // TODO: it might make sense to remove swap clients that turned out
    // to be disabled after the initPromises resolve, since we
    // currently treat disabled clients as if they don't exist.
    await Promise.all(initPromises);
    // associate swap clients with currencies managed by raiden client
    if (raidenEnabled) {
      for (const currency of this.raidenClient.tokenAddresses.keys()) {
        this.swapClients.set(currency, this.raidenClient);
      }
    }
  }

  /**
   * Gets a swap client instance.
   * @param currency a currency that the swap client is linked to.
   * @returns swap client instance upon success, undefined otherwise.
   */
  public get = (currency: string): SwapClient | undefined => {
    return this.swapClients.get(currency);
  }

  /**
   * Adds a new swap client and currency association.
   * @param currency a currency that should be linked with a swap client.
   * @returns Nothing upon success, throws otherwise.
   */
  public add = (currency: Currency): void => {
    if (isRaidenClient(currency.swapClient) && currency.tokenAddress) {
      this.swapClients.set(currency.id, this.raidenClient);
      this.raidenClient.tokenAddresses.set(currency.id, currency.tokenAddress);
    } else if (isLndClient(currency.swapClient)) {
      // in case of lnd we check if the configuration includes swap client
      // for the specified currency
      let hasCurrency = false;
      for (const lndCurrency in this.config.lnd) {
        if (lndCurrency === currency.id) {
          hasCurrency = true;
        }
      }
      // adding a new lnd client at runtime is currently not supported
      if (!hasCurrency) {
        throw errors.SWAP_CLIENT_NOT_CONFIGURED(currency.id);
      }
    }
  }

  /**
   * Removes a new swap client and currency association.
   * @param currency a currency that should be unlinked from a swap client.
   * @returns Nothing upon success, throws otherwise.
   */
  public remove = (currency: string): void => {
    const swapClient = this.get(currency);
    this.swapClients.delete(currency);
    if (swapClient && isRaidenClient(swapClient.type)) {
      this.raidenClient.tokenAddresses.delete(currency);
    }
  }

  /**
   * Gets all lnd clients' pubKeys.
   * @returns An object containing lnd public keys.
   */
  public getLndPubKeys = (): LndPubKeys => {
    const lndPubKeys: LndPubKeys = {};
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient.type)) {
        lndPubKeys[currency] = (swapClient as LndClient).pubKey;
      }
    }
    return lndPubKeys;
  }

  /**
   * Gets all lnd clients' info.
   * @returns A promise that resolves to an object containing lnd
   * clients' info, throws otherwise.
   */
  public getLndClientsInfo = async (): Promise<LndInfos> => {
    const lndInfos: LndInfos = {};
    // TODO: consider maintaining this list of pubkeys
    // (similar to how we're maintaining the list of raiden currencies)
    // rather than determining it dynamically when needed. The benefits
    // would be slightly improved performance.
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient.type)) {
        lndInfos[currency] = swapClient.isDisabled()
          ? undefined
          : await (swapClient as LndClient).getLndInfo();
      }
    }
    return lndInfos;
  }

  /**
   * Closes all swap client instances gracefully.
   * @returns Nothing upon success, throws otherwise.
   */
  public close = (): void => {
    let raidenClosed = false;
    for (const swapClient of this.swapClients.values()) {
      swapClient.close();
      if (isRaidenClient(swapClient.type)) {
        raidenClosed = true;
      }
    }
    // we make sure to close raiden client because it
    // might not be associated with any currency
    if (!this.config.raiden.disable && !raidenClosed) {
      this.raidenClient.close();
    }
  }

  private bind = () => {
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient.type)) {
        swapClient.on('connectionVerified', (newPubKey) => {
          if (newPubKey) {
            this.pool.updateLndPubKey(currency, newPubKey);
          }
        });
      }
    }
    // we handle raiden separately because we don't want to attach
    // duplicate listeners in case raiden client is associated with
    // multiple currencies
    if (!this.config.raiden.disable) {
      this.raidenClient.on('connectionVerified', (newAddress) => {
        if (newAddress) {
          this.pool.updateRaidenAddress(newAddress);
        }
      });
    }
  }

}

export default SwapClientManager;
