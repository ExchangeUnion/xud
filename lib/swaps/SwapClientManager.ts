import Config from '../Config';
import SwapClient from './SwapClient';
import LndClient from '../lndclient/LndClient';
import { LndInfo } from '../lndclient/types';
import RaidenClient from '../raidenclient/RaidenClient';
import { Loggers } from '../Logger';
import { errors } from './errors';
import { Currency } from '../orderbook/types';
import { Models } from '../db/DB';
import { SwapClientType } from '../constants/enums';
import { EventEmitter } from 'events';
import Peer from '../p2p/Peer';
import { UnitConverter } from '../utils/UnitConverter';

export function isRaidenClient(swapClient: SwapClient): swapClient is RaidenClient {
  return (swapClient.type === SwapClientType.Raiden);
}

export function isLndClient(swapClient: SwapClient): swapClient is LndClient {
  return (swapClient.type === SwapClientType.Lnd);
}

type LndUpdate = {
  currency: string,
  pubKey: string,
  chain?: string,
  uris?: string[],
};

interface SwapClientManager {
  on(event: 'lndUpdate', listener: (lndUpdate: LndUpdate) => void): this;
  on(event: 'raidenUpdate', listener: (tokenAddresses: Map<string, string>, address?: string) => void): this;
  on(event: 'htlcAccepted', listener: (swapClient: SwapClient, rHash: string, amount: number, currency: string) => void): this;
  emit(event: 'lndUpdate', lndUpdate: LndUpdate): boolean;
  emit(event: 'raidenUpdate', tokenAddresses: Map<string, string>, address?: string): boolean;
  emit(event: 'htlcAccepted', swapClient: SwapClient, rHash: string, amount: number, currency: string): boolean;
}

class SwapClientManager extends EventEmitter {
  /** A map between currencies and all swap clients */
  public swapClients = new Map<string, SwapClient>();
  public raidenClient: RaidenClient;

  constructor(
    private config: Config,
    private loggers: Loggers,
    private unitConverter: UnitConverter,
  ) {
    super();

    this.raidenClient = new RaidenClient({
      unitConverter,
      config: config.raiden,
      logger: loggers.raiden,
      directChannelChecks: config.debug.raidenDirectChannelChecks,
    });
  }

  /**
   * Starts all swap clients, binds event listeners
   * and waits for the swap clients to initialize.
   * @returns A promise that resolves upon successful initialization, rejects otherwise.
   */
  public init = async (models: Models): Promise<void> => {
    const initPromises = [];
    // setup configured LND clients and initialize them
    for (const currency in this.config.lnd) {
      const lndConfig = this.config.lnd[currency]!;
      if (!lndConfig.disable) {
        const lndClient = new LndClient(
          lndConfig,
          currency,
          this.loggers.lnd.createSubLogger(currency),
        );
        this.swapClients.set(currency, lndClient);
        initPromises.push(lndClient.init());
      }
    }
    // setup Raiden
    const currencyInstances = await models.Currency.findAll();
    initPromises.push(this.raidenClient.init(currencyInstances));

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
          this.swapClients.set(currency.id, this.raidenClient);
        }
      });
    }
  }

  /**
   * Generates a cryptographically random 24 word seed mnemonic from an lnd client.
   */
  public genSeed = async () => {
    // loop through swap clients until we find a connected lnd client
    for (const swapClient of this.swapClients.values()) {
      if (isLndClient(swapClient) && swapClient.isConnected()) {
        try {
          return swapClient.genSeed();
        } catch (err) {
          swapClient.logger.error('could not generate seed', err);
        }
      }
    }

    // TODO: use seedutil tool to generate a seed
    return undefined;
  }

  /**
   * Initializes wallets with seed and password.
   */
  public initWallets = async (walletPassword: string, seedMnemonic: string[]) => {
    // loop through swap clients to find locked lnd clients
    const initWalletPromises: Promise<any>[] = [];
    for (const swapClient of this.swapClients.values()) {
      if (isLndClient(swapClient) && swapClient.isWaitingUnlock()) {
        initWalletPromises.push(swapClient.initWallet(walletPassword, seedMnemonic));
      }
    }

    await Promise.all(initWalletPromises).catch((err) => {
      this.loggers.lnd.debug(`could not initialize one or more wallets: ${JSON.stringify(err)}`);
    });

    // TODO: create raiden address
  }

  /**
   * Initializes wallets with seed and password.
   */
  public unlockWallets = async (walletPassword: string) => {
    // loop through swap clients to find locked lnd clients
    const unlockWalletPromises: Promise<any>[] = [];
    for (const swapClient of this.swapClients.values()) {
      if (isLndClient(swapClient) && swapClient.isWaitingUnlock()) {
        unlockWalletPromises.push(swapClient.unlockWallet(walletPassword));
      }
    }

    await Promise.all(unlockWalletPromises).catch((err) => {
      this.loggers.lnd.debug(`could not unlock one or more wallets: ${JSON.stringify(err)}`);
    });

    // TODO: unlock raiden
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
      this.emit('raidenUpdate', this.raidenClient.tokenAddresses, this.raidenClient.address);
    } else if (currency.swapClient === SwapClientType.Lnd) {
      // in case of lnd we check if the configuration includes swap client
      // for the specified currency
      let isCurrencyConfigured = false;
      for (const lndCurrency in this.config.lnd) {
        if (lndCurrency === currency.id) {
          isCurrencyConfigured = true;
          break;
        }
      }
      // adding a new lnd client at runtime is currently not supported
      if (!isCurrencyConfigured) {
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
   * Gets a map of all lnd clients.
   * @returns A map of currencies to lnd clients.
   */
  public getLndClientsMap = () => {
    const lndClients: Map<string, LndClient> = new Map();
    this.swapClients.forEach((swapClient, currency) => {
      if (isLndClient(swapClient)) {
        lndClients.set(currency, swapClient);
      }
    });
    return lndClients;
  }

  /**
   * Gets all lnd clients' info.
   * @returns A promise that resolves to an object containing lnd
   * clients' info, throws otherwise.
   */
  public getLndClientsInfo = async () => {
    const lndInfos = new Map<string, LndInfo>();
    // TODO: consider maintaining this list of pubkeys
    // (similar to how we're maintaining the list of raiden currencies)
    // rather than determining it dynamically when needed. The benefits
    // would be slightly improved performance.
    const getInfoPromises: Promise<void>[] = [];
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient) && !swapClient.isDisabled()) {
        getInfoPromises.push(swapClient.getLndInfo().then((lndInfo) => {
          lndInfos.set(currency, lndInfo);
        }));
      }
    }
    await Promise.all(getInfoPromises);
    return lndInfos;
  }

  /**
   * Closes all swap client instances gracefully.
   * @returns Nothing upon success, throws otherwise.
   */
  public close = async (): Promise<void> => {
    const closePromises: Promise<void>[] = [];
    let raidenClosed = false;
    for (const swapClient of this.swapClients.values()) {
      closePromises.push(swapClient.close());
      if (isRaidenClient(swapClient)) {
        raidenClosed = true;
      }
    }
    // we make sure to close raiden client because it
    // might not be associated with any currency
    if (!this.raidenClient.isDisabled() && !raidenClosed) {
      closePromises.push(this.raidenClient.close());
    }
    await Promise.all(closePromises);
  }

  /**
   * Opens a payment channel.
   * @param peer a peer to open the payment channel with.
   * @param currency a currency for the payment channel.
   * @param amount the size of the payment channel local balance
   * @returns Nothing upon success, throws otherwise.
   */
  public openChannel = async (
    { peer, amount, currency }:
    { peer: Peer, amount: number, currency: string },
  ): Promise<void> => {
    const swapClient = this.get(currency);
    if (!swapClient) {
      throw errors.SWAP_CLIENT_NOT_FOUND(currency);
    }
    const peerIdentifier = peer.getIdentifier(swapClient.type, currency);
    if (!peerIdentifier) {
      throw new Error('unable to get swap client pubKey for peer');
    }
    const units = this.unitConverter.amountToUnits({
      amount,
      currency,
    });
    if (isLndClient(swapClient)) {
      const lndUris = peer.getLndUris(currency);
      if (!lndUris) {
        throw new Error('unable to get lnd listening uris');
      }
      await swapClient.openChannel({ peerIdentifier, units, lndUris });
      return;
    }
    // fallback to raiden for all non-lnd currencies
    await swapClient.openChannel({ peerIdentifier, units, currency });
  }

  private bind = () => {
    for (const [currency, swapClient] of this.swapClients.entries()) {
      if (isLndClient(swapClient)) {
        swapClient.on('connectionVerified', ({ newIdentifier, newUris }) => {
          if (newIdentifier) {
            this.emit('lndUpdate', {
              currency,
              uris: newUris,
              pubKey: newIdentifier,
              chain: swapClient.chain,
            });
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
      this.raidenClient.on('connectionVerified', (swapClientInfo) => {
        const { newIdentifier } = swapClientInfo;
        if (newIdentifier) {
          this.emit('raidenUpdate', this.raidenClient.tokenAddresses, newIdentifier);
        }
      });
    }
  }

}

export default SwapClientManager;
