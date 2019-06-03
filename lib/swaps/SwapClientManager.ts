import Config from '../Config';
import SwapClient from './SwapClient';
import LndClient from '../lndclient/LndClient';
import { LndLogger, LndInfos } from '../lndclient/types';
import RaidenClient from '../raidenclient/RaidenClient';
import Logger, { Loggers } from '../Logger';
import { errors } from './errors';
import { Currency } from '../orderbook/types';
import { Models } from '../db/DB';
import { SwapClientType } from '../constants/enums';
import { EventEmitter } from 'events';

function isRaidenClient(swapClient: SwapClient): swapClient is RaidenClient {
  return (swapClient.type === SwapClientType.Raiden);
}

function isLndClient(swapClient: SwapClient): swapClient is LndClient {
  return (swapClient.type === SwapClientType.Lnd);
}

interface SwapClientManager {
  on(event: 'lndUpdate', listener: (currency: string, newPubKey: string) => void): this;
  on(event: 'raidenUpdate', listener: (newAddress: string) => void): this;
  on(event: 'htlcAccepted', listener: (swapClient: SwapClient, rHash: string, amount: number, currency: string) => void): this;
  emit(event: 'lndUpdate', currency: string, newPubKey: string): boolean;
  emit(event: 'raidenUpdate', newAddress: string): boolean;
  emit(event: 'htlcAccepted', swapClient: SwapClient, rHash: string, amount: number, currency: string): boolean;
}

class SwapClientManager extends EventEmitter {
  /** A map between currencies and all swap clients */
  public swapClients = new Map<string, SwapClient>();
  public raidenClient: RaidenClient;

  constructor(
    private config: Config,
    private loggers: Loggers,
  ) {
    super();

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
  public init = async (models: Models): Promise<void> => {
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
    // setup Raiden
    initPromises.push(this.raidenClient.init());

    // bind event listeners before all swap clients have initialized
    this.bind();

    await Promise.all(initPromises);

    // delete any swap clients that were disabled during initialization
    this.swapClients.forEach((swapClient, currency) => {
      if (swapClient.isDisabled()) {
        this.swapClients.delete(currency);
      }
    });

    // associate swap clients with currencies managed by raiden client
    if (!this.raidenClient.isDisabled()) {
      const currencyInstances = await models.Currency.findAll();
      currencyInstances.forEach((currency) => {
        if (currency.tokenAddress) {
          this.raidenClient.tokenAddresses.set(currency.id, currency.tokenAddress);
          this.swapClients.set(currency.id, this.raidenClient);
        }
      });
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
    if (currency.swapClient === SwapClientType.Raiden && currency.tokenAddress) {
      this.swapClients.set(currency.id, this.raidenClient);
      this.raidenClient.tokenAddresses.set(currency.id, currency.tokenAddress);
    } else if (currency.swapClient === SwapClientType.Lnd) {
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
    if (swapClient && isRaidenClient(swapClient)) {
      this.raidenClient.tokenAddresses.delete(currency);
    }
  }

  /**
   * Gets all lnd clients' pubKeys.
   * @returns An object containing lnd public keys.
   */
  public getLndPubKeysMap = () => {
    const lndPubKeys = new Map<string, string>();
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient) && swapClient.pubKey) {
        lndPubKeys.set(currency, swapClient.pubKey);
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
      if (isLndClient(swapClient)) {
        lndInfos[currency] = swapClient.isDisabled()
          ? undefined
          : await swapClient.getLndInfo();
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
      if (isRaidenClient(swapClient)) {
        raidenClosed = true;
      }
    }
    // we make sure to close raiden client because it
    // might not be associated with any currency
    if (!this.raidenClient.isDisabled() && !raidenClosed) {
      this.raidenClient.close();
    }
  }

  private bind = () => {
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient)) {
        swapClient.on('connectionVerified', (newPubKey) => {
          if (newPubKey) {
            this.emit('lndUpdate', currency, newPubKey);
          }
        });
        // lnd clients emit htlcAccepted evented we must handle
        swapClient.on('htlcAccepted', (rHash, amount) => {
          this.emit('htlcAccepted', swapClient, rHash, amount, currency);
        });
      }
    }
    // we handle raiden separately because we don't want to attach
    // duplicate listeners in case raiden client is associated with
    // multiple currencies
    if (!this.raidenClient.isDisabled()) {
      this.raidenClient.on('connectionVerified', (newAddress) => {
        if (newAddress) {
          this.emit('raidenUpdate', newAddress);
        }
      });
    }
  }

}

export default SwapClientManager;
