import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import Config from '../Config';
import { SwapClientType } from '../constants/enums';
import { Models } from '../db/DB';
import lndErrors from '../lndclient/errors';
import LndClient from '../lndclient/LndClient';
import { LndInfo } from '../lndclient/types';
import { Loggers } from '../Logger';
import { Currency } from '../orderbook/types';
import Peer from '../p2p/Peer';
import RaidenClient from '../raidenclient/RaidenClient';
import { keystore } from '../utils/seedutil';
import { UnitConverter } from '../utils/UnitConverter';
import errors from './errors';
import SwapClient, { ClientStatus } from './SwapClient';
import ConnextClient from 'lib/connextclient/ConnextClient';

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
  /** A map between currencies and all enabled swap clients */
  public swapClients = new Map<string, SwapClient>();
  public raidenClient?: RaidenClient;
  public connextClient?: ConnextClient;
  public misconfiguredClients = new Set<SwapClient>();
  private walletPassword?: string;

  constructor(
    private config: Config,
    private loggers: Loggers,
    private unitConverter: UnitConverter,
  ) {
    super();
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
        const lndClient = new LndClient({
          currency,
          config: lndConfig,
          logger: this.loggers.lnd.createSubLogger(currency),
        });
        this.swapClients.set(currency, lndClient);
        initPromises.push(lndClient.init());
      }
    }

    if (!this.config.raiden.disable) {
      // setup Raiden
      const currencyInstances = await models.Currency.findAll({
        where: {
          swapClient: SwapClientType.Raiden,
        },
      });
      this.raidenClient = new RaidenClient({
        currencyInstances,
        unitConverter: this.unitConverter,
        config: this.config.raiden,
        logger: this.loggers.raiden,
        directChannelChecks: this.config.debug.raidenDirectChannelChecks,
      });
      initPromises.push(this.raidenClient.init());
    }

    if (!this.config.connext.disable) {
      // setup Connext
      const currencyInstances = await models.Currency.findAll();
      this.connextClient = new ConnextClient({
        currencyInstances,
        unitConverter: this.unitConverter,
        config: this.config.connext,
        logger: this.loggers.connext,
      });
    }

    // bind event listeners before all swap clients have initialized
    this.bind();

    await Promise.all(initPromises);

    this.swapClients.forEach((swapClient, currency) => {
      if (swapClient.isDisabled()) {
        // delete any swap clients that are disabled
        this.swapClients.delete(currency);
      } else if (swapClient.isMisconfigured()) {
        // track misconfigured swap clients separately
        this.swapClients.delete(currency);
        this.misconfiguredClients.add(swapClient);
      }
    });

    if (this.raidenClient) {
      if (this.raidenClient.isMisconfigured()) {
        this.misconfiguredClients.add(this.raidenClient);
      } else if (!this.raidenClient.isDisabled()) {
        // associate swap clients with currencies managed by raiden client
        for (const currency of this.raidenClient.tokenAddresses.keys()) {
          this.swapClients.set(currency, this.raidenClient);
        }
      }
    }
  }

  /**
   * Checks to make sure all enabled lnd instances are available and waits
   * up to a short time for them to become available in case they are not.
   * Throws an error if any lnd clients remain unreachable.
   */
  public waitForLnd = async () => {
    const lndClients = this.getLndClientsMap().values();
    const lndAvailablePromises: Promise<void>[] = [];
    for (const lndClient of lndClients) {
      lndAvailablePromises.push(new Promise<void>((resolve, reject) => {
        if (lndClient.isDisconnected() || lndClient.isNotInitialized()) {
          const onAvailable = () => {
            clearTimeout(timer);
            lndClient.removeListener('locked', onAvailable);
            lndClient.removeListener('connectionVerified', onAvailable);
            resolve();
          };
          lndClient.on('connectionVerified', onAvailable);
          lndClient.on('locked', onAvailable);
          const timer = setTimeout(() => {
            lndClient.removeListener('connectionVerified', onAvailable);
            lndClient.removeListener('locked', onAvailable);
            reject(lndClient.currency);
          }, SwapClient.RECONNECT_INTERVAL);
        } else {
          resolve();
        }
      }));
    }

    try {
      await Promise.all(lndAvailablePromises);
    } catch (currency) {
      throw lndErrors.UNAVAILABLE(currency, ClientStatus.Disconnected);
    }
  }

  /**
   * Initializes wallets with seed and password.
   */
  public initWallets = async ({ walletPassword, seedMnemonic, restore, lndBackups, raidenDatabase, raidenDatabasePath }: {
    walletPassword: string,
    seedMnemonic: string[],
    restore?: boolean,
    lndBackups?: Map<string, Uint8Array>,
    raidenDatabase?: Uint8Array,
    raidenDatabasePath?: string,
  }) => {
    this.walletPassword = walletPassword;

    // loop through swap clients to initialize locked lnd clients
    const lndClients = this.getLndClientsMap().values();
    const initWalletPromises: Promise<any>[] = [];
    const initializedLndWallets: string[] = [];
    let initializedRaiden = false;

    for (const lndClient of lndClients) {
      if (isLndClient(lndClient)) {
        if (lndClient.isWaitingUnlock()) {
          const initWalletPromise = lndClient.initWallet(
            walletPassword,
            seedMnemonic,
            restore,
            lndBackups ? lndBackups.get(lndClient.currency) : undefined,
          ).then(() => {
            initializedLndWallets.push(lndClient.currency);
          }).catch((err) => {
            lndClient.logger.error(`could not initialize wallet: ${err.message}`);
            throw errors.SWAP_CLIENT_WALLET_NOT_CREATED(`could not initialize lnd-${lndClient.currency}: ${err.message}`);
          });
          initWalletPromises.push(initWalletPromise);
        }
      }
    }

    if (this.raidenClient) {
      const { keystorepath } = this.config.raiden;
      // TODO: we are setting the raiden keystore as an empty string until raiden
      // allows for decrypting the keystore without needing to save the password
      // to disk in plain text

      if (raidenDatabase && raidenDatabase.byteLength && raidenDatabasePath) {
        initWalletPromises.push(fs.writeFile(raidenDatabasePath, raidenDatabase).then(() => {
          this.loggers.raiden.info(`restored raiden database to ${raidenDatabasePath}`);
        }));
      }

      const keystorePromise = keystore(seedMnemonic, '', keystorepath).then(() => {
        this.raidenClient!.logger.info(`created raiden keystore with master seed and empty password in ${keystorepath}`);
        initializedRaiden = true;
      }).catch((err) => {
        this.raidenClient!.logger.error('could not create keystore');
        throw errors.SWAP_CLIENT_WALLET_NOT_CREATED(`could not create keystore: ${err}`);
      });
      initWalletPromises.push(keystorePromise);
    }

    if (this.connextClient) {
      const initWalletPromise = this.connextClient.initWallet(seedMnemonic);
      initWalletPromises.push(initWalletPromise);
    }

    await Promise.all(initWalletPromises);

    return {
      initializedLndWallets,
      initializedRaiden,
    };
  }

  /**
   * Unlocks wallets with a password.
   * @returns an array of currencies for each lnd client that was unlocked
   */
  public unlockWallets = async ({ walletPassword }: {
    walletPassword: string,
    connextSeed: string,
  }) => {
    this.walletPassword = walletPassword;

    // loop through swap clients to find locked lnd clients
    const unlockWalletPromises: Promise<any>[] = [];
    const unlockedLndClients: string[] = [];
    const lockedLndClients: string[] = [];

    for (const swapClient of this.swapClients.values()) {
      if (isLndClient(swapClient)) {
        if (swapClient.isWaitingUnlock()) {
          const unlockWalletPromise = swapClient.unlockWallet(walletPassword).then(() => {
            unlockedLndClients.push(swapClient.currency);
          }).catch((err) => {
            lockedLndClients.push(swapClient.currency);
            swapClient.logger.debug(`could not unlock wallet: ${err.message}`);
          });
          unlockWalletPromises.push(unlockWalletPromise);
        } else if (swapClient.isDisconnected() || swapClient.isMisconfigured() || swapClient.isNotInitialized()) {
          // if the swap client is not connected, we treat it as locked since lnd will likely be locked when it comes online
          lockedLndClients.push(swapClient.currency);
        }
      }
    }

    await Promise.all(unlockWalletPromises);

    // TODO: unlock raiden
    // TODO(connext): unlock Connext using connextSeed

    return { unlockedLndClients, lockedLndClients };
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
   * Returns whether the swap client for a specified currency is connected.
   * @returns `true` if a swap client exists and is connected, otherwise `false`
   */
  public isConnected = (currency: string) => {
    const swapClient = this.swapClients.get(currency);
    return swapClient !== undefined && swapClient.isConnected();
  }

  /**
   * Adds a new swap client and currency association.
   * @param currency a currency that should be linked with a swap client.
   * @returns Nothing upon success, throws otherwise.
   */
  public add = (currency: Currency): void => {
    if (currency.swapClient === SwapClientType.Raiden && currency.tokenAddress && this.raidenClient) {
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
      this.raidenClient?.tokenAddresses.delete(currency);
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
  public close = (): void => {
    let raidenClosed = false;
    for (const swapClient of this.swapClients.values()) {
      swapClient.close();
      if (isRaidenClient(swapClient)) {
        raidenClosed = true;
      }
    }
    for (const swapClient of this.misconfiguredClients) {
      swapClient.close();
      if (isRaidenClient(swapClient)) {
        raidenClosed = true;
      }
    }
    // we make sure to close raiden client because it
    // might not be associated with any currency
    if (this.raidenClient && !this.raidenClient.isDisabled() && !raidenClosed) {
      this.raidenClient.close();
    }
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
      throw new Error('peer not connected to swap client');
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

  /**
   * Checks whether it is possible to route a payment to a peer for a given currency. This does not
   * guarantee or test that a payment can be routed successfully, only determiens whether it is
   * possible to do so currently given the state of the specified currency's network and graph.
   */
  public canRouteToPeer = async (peer: Peer, currency: string) => {
    const swapClient = this.get(currency);
    if (!swapClient) {
      return false;
    }
    const destination = peer.getIdentifier(swapClient.type, currency);
    if (!destination) {
      return false;
    }

    let canRoute: boolean;
    try {
      canRoute = await swapClient.canRouteToNode(destination, currency);
    } catch {
      canRoute = false; // if swap client calls are failing, we infer that we can't route payments
    }
    return canRoute;
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
        swapClient.on('locked', () => {
          if (this.walletPassword) {
            swapClient.unlockWallet(this.walletPassword).catch(swapClient.logger.error);
          }
          // TODO(connext): unlock ConnextClient when it's implemented
        });
      }
    }
    // we handle raiden separately because we don't want to attach
    // duplicate listeners in case raiden client is associated with
    // multiple currencies
    if (this.raidenClient?.isOperational()) {
      this.raidenClient.on('connectionVerified', (swapClientInfo) => {
        const { newIdentifier } = swapClientInfo;
        if (newIdentifier) {
          this.emit('raidenUpdate', this.raidenClient!.tokenAddresses, newIdentifier);
        }
      });
    }
  }

}

export default SwapClientManager;
