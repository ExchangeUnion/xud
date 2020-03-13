import assert from 'assert';

import * as connext from '@connext/client';
import { ConnextStore, FileStorage } from '@connext/store';
import { IConnextClient } from '@connext/types';

import { SwapClientType, SwapRole, SwapState } from '../constants/enums';
import { CurrencyInstance } from '../db/types';
import Logger from '../Logger';
import swapErrors from '../swaps/errors';
import SwapClient, {
  ChannelBalance,
  ClientStatus,
  PaymentState,
  WalletBalance,
  TradingLimits,
} from '../swaps/SwapClient';
import { SwapDeal } from '../swaps/types';
import { UnitConverter } from '../utils/UnitConverter';
import { ConnextWallet } from './ConnextWallet';
import errors, { errorCodes } from './errors';
import {
  ConnextChannelCount,
  ConnextClientConfig,
  ConnextInfo,
  ConnextVersion,
  TokenPaymentRequest,
  TokenPaymentResponse,
} from './types';

const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;

/**
 * A class representing a client to interact with connext.
 */
class ConnextClient extends SwapClient {
  public readonly type = SwapClientType.Connext;
  public readonly finalLock = 100;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  private ethProviderUrl: string;
  private nodeUrl: string;
  private unitConverter: UnitConverter;

  private client: IConnextClient | undefined;
  private wallet: ConnextWallet | undefined;

  /**
   * Creates a connext client.
   */
  constructor({
    config,
    logger,
    unitConverter,
    currencyInstances,
  }: {
    unitConverter: UnitConverter;
    config: ConnextClientConfig;
    currencyInstances: CurrencyInstance[],
    logger: Logger;
  }) {
    super(logger, config.disable);

    this.ethProviderUrl = config.ethProviderUrl;
    this.nodeUrl = config.nodeUrl;
    this.unitConverter = unitConverter;
    this.setTokenAddresses(currencyInstances);
  }

  public get minutesPerBlock() {
    return 0.25; // 15 seconds per block target
  }

  public get label() {
    return 'Connext';
  }

  /**
   * Checks for connectivity and gets our Connext account address
   */
  public initSpecific = async () => {
    if (!this.wallet) {
      throw errors.CONNEXT_WALLET_NOT_INITIALIZED;
    }
    if (this.wallet) {
      await this.initConnextClient();
      this.setStatus(ClientStatus.Initialized);
      this.emit('initialized');
      await this.verifyConnectionWithTimeout();
    }
  }
  /**
   * Initiates wallet for the Connext client
   */
  public initWallet = async (seedMnemonic: string[]) => {
    this.wallet = new ConnextWallet(seedMnemonic.join(' '));
  }

  public initConnextClient = async () => {
    if (!this.wallet) {
      throw errors.CONNEXT_WALLET_NOT_INITIALIZED;
    }
    const wallet = this.wallet;
    const client = await connext.connect({
      ethProviderUrl: this.ethProviderUrl,
      nodeUrl: this.nodeUrl,
      xpub: wallet.xpub,
      keyGen: (index: string) => wallet.keyGen(index),
      store: new ConnextStore(new FileStorage()),
    });
    this.client = client;
    return client;
  }
  /**
   * Associate connext with currencies that have a token address
   */
  private setTokenAddresses = (currencyInstances: CurrencyInstance[]) => {
    currencyInstances.forEach((currency) => {
      if (currency.tokenAddress) {
        this.tokenAddresses.set(currency.id, currency.tokenAddress);
      }
    });
  }

  public totalOutboundAmount = (): number => {
    // assume MAX_AMOUNT since Connext will re-collaterize accordingly
    return MAX_AMOUNT;
  }

  public maxChannelOutboundAmount = (): number => {
    // assume MAX_AMOUNT since Connext will re-collaterize accordingly
    return MAX_AMOUNT;
  }

  public maxChannelInboundAmount = (): number => {
    // assume MAX_AMOUNT since Connext will re-collaterize accordingly
    return MAX_AMOUNT;
  }

  protected updateCapacity = async () => {
    try {
      const channelBalancePromises = [];
      for (const [currency] of this.tokenAddresses) {
        channelBalancePromises.push(this.channelBalance(currency));
      }
      await Promise.all(channelBalancePromises);
    } catch (e) {
      this.logger.error('failed to update total outbound capacity', e);
    }
  }

  protected getConnextClient(): IConnextClient {
    if (!this.client) {
      throw errors.CONNEXT_CLIENT_NOT_INITIALIZED;
    }
    return this.client;
  }

  protected getTokenAddress(currency: string): string {
    const tokenAdress = this.tokenAddresses.get(currency);
    if (!tokenAdress) {
      throw errors.TOKEN_ADDRESS_NOT_FOUND;
    }
    return tokenAdress;
  }

  protected verifyConnection = async () => {
    this.logger.info('trying to verify connection to connext');
    try {
      const client = this.getConnextClient();

      await client.isAvailable();

      this.emit('connectionVerified', { newIdentifier: client.publicIdentifier });
      this.setStatus(ClientStatus.ConnectionVerified);
    } catch (err) {
      this.logger.error(
        `could not verify connection to connext, retrying in ${ConnextClient.RECONNECT_INTERVAL} ms`,
        err,
      );
      await this.disconnect();
    }
  }

  public sendSmallestAmount = async (
    rHash: string,
    destination: string,
    currency: string,
  ) => {
    const tokenAddress = this.getTokenAddress(currency);

    const secret = await this.executePaymentTransfer({
      tokenAddress,
      targetAddress: destination,
      amount: 1,
      secretHash: rHash,
    });
    return secret;
  }

  public sendPayment = async (deal: SwapDeal): Promise<string> => {
    assert(deal.state === SwapState.Active);
    assert(deal.destination);
    let amount: number;
    let tokenAddress: string;
    let lockTimeout: number | undefined;
    if (deal.role === SwapRole.Maker) {
      // we are the maker paying the taker
      amount = deal.takerUnits;
      tokenAddress = this.tokenAddresses.get(deal.takerCurrency)!;
    } else {
      // we are the taker paying the maker
      amount = deal.makerUnits;
      tokenAddress = this.tokenAddresses.get(deal.makerCurrency)!;
      lockTimeout = deal.makerCltvDelta!;
    }

    try {
      const secret = await this.executePaymentTransfer({
        amount,
        lockTimeout,
        tokenAddress,
        targetAddress: deal.destination!,
        secretHash: deal.rHash,
      });
      return secret;
    } catch (err) {
      switch (err.code) {
        case 'ECONNRESET':
        case errorCodes.UNEXPECTED:
        case errorCodes.TIMEOUT:
        case errorCodes.SERVER_ERROR:
        case errorCodes.INVALID_TOKEN_PAYMENT_RESPONSE:
          throw swapErrors.UNKNOWN_PAYMENT_ERROR(err.message);
        default:
          throw swapErrors.FINAL_PAYMENT_ERROR(err.message);
      }
    }
  }

  public addInvoice = async () => {
    // not implemented, connext does not use invoices
  }

  public settleInvoice = async () => {
    // not implemented, connext does not use invoices
  }

  public removeInvoice = async () => {
    // not implemented, connext does not use invoices
  }

  public lookupPayment = async (
    rHash: string,
    currency?: string,
    destination?: string,
  ) => {
    // TODO: change identifier
    const identifier = 0;

    // first check if the payment is pending
    const pendingTransfers = await this.getPendingTransfers(
      currency,
      destination,
    );
    for (const pendingTransfer of pendingTransfers) {
      if (identifier === Number(pendingTransfer.paymentId)) {
        return { state: PaymentState.Pending };
      }
    }

    // if the payment isn't pending, check if it has succeeded or failed
    const paymentEvents = await this.getPaymentEvents(currency, destination);
    for (const paymentEvent of paymentEvents) {
      if (paymentEvent.identifier === identifier) {
        const success = paymentEvent.event === 'EventPaymentSentSuccess';
        if (success) {
          const preimage = paymentEvent.secret;
          return { preimage, state: PaymentState.Succeeded };
        } else {
          return { state: PaymentState.Failed };
        }
      }
    }

    // if there is no pending payment or event found, we assume that the payment was never attempted by connext
    return { state: PaymentState.Failed };
  }
  private getPendingTransfers = async (
    currency?: string,
    destination?: string,
  ) => {
    return ({} as any);
  }

  private getPaymentEvents = async (
    currency?: string,
    destination?: string,
  ) => {
    return ({} as any);
  }

  public getRoute = async () => {
    // not implemented since connext doesnt use routes
    return undefined;
  }

  public canRouteToNode = async () => {
    return true;
  }

  public getHeight = async () => {
    return 1; // connext's API does not tell us the height
  }

  public getConnextInfo = async (): Promise<ConnextInfo> => {
    let channels: ConnextChannelCount | undefined;
    let address: string | undefined;
    let version: string | undefined;
    let status = 'Ready';
    const chain =
      Object.keys(this.tokenAddresses).find(
        key => this.tokenAddresses.get(key) === this.address,
      ) || 'connext';
    if (this.isDisabled()) {
      status = errors.CONNEXT_IS_DISABLED.message;
    } else {
      try {
        version = (await this.getVersion()).version;
        const connextChannels = await this.getChannels();
        channels = {
          active: connextChannels.filter(c => c.state === 'opened').length,
          settled: connextChannels.filter(c => c.state === 'settled').length,
          closed: connextChannels.filter(c => c.state === 'closed').length,
        };
        address = this.address;
        if (channels.active <= 0) {
          status = errors.CONNEXT_HAS_NO_ACTIVE_CHANNELS().message;
        }
      } catch (err) {
        status = err.message;
      }
    }

    return {
      chain,
      status,
      channels,
      address,
      version,
    };
  }

  /**
   * Gets the connext version.
   */
  public getVersion = async (): Promise<ConnextVersion> => {
    return ({} as any);
  }

  /**
   * Gets info about a given connext payment client.
   * @param tokenAddress the token address for the network to which the client belongs
   * @param channel_address the address of the client to query
   */
  public getChannel = async (
    tokenAddress: string,
    channel_address: string,
  ): Promise<any> => {
    return ({} as any);
  }

  /**
   * Gets info about all non-settled channels.
   * @param tokenAddress an optional parameter to specify channels belonging to the specified token network
   */
  public getChannels = async (tokenAddress?: string): Promise<any[]> => {
    return ({} as any);
  }

  public channelBalance = async (
    currency?: string,
  ): Promise<ChannelBalance> => {
    const client = this.getConnextClient();
    if (!currency) {
      return { balance: 0, pendingOpenBalance: 0, inactiveBalance: 0 };
    }

    const tokenAddress = this.getTokenAddress(currency);

    const freeBalance = await client.getFreeBalance(tokenAddress);

    const pendingOpenBalance = this.unitConverter.unitsToAmount({
      currency,
      units: freeBalance[client.multisigAddress].toNumber(),
    });

    const inactiveBalance = 0;

    const balance = pendingOpenBalance + inactiveBalance;

    return {
      balance,
      pendingOpenBalance,
      inactiveBalance,
    };
  }

  public tradingLimits = async (): Promise<TradingLimits> => {
    // assume MAX_AMOUNT since Connext will re-collaterize accordingly
    return {
      maxSell: MAX_AMOUNT,
      maxBuy: MAX_AMOUNT,
    };
  }

  /**
   * Returns the balances available in wallet for a specified currency.
   */
  public walletBalance = async (_currency?: string): Promise<WalletBalance> => {
    return { totalBalance: 0, confirmedBalance: 0, unconfirmedBalance: 0 };
  }
  /**
   * Creates a payment client.
   */
  public openChannel = async (): Promise<void> => {
    if (!this.client) {
      await this.initConnextClient();
    }
  }

  /**
   * Closes a payment client.
   * @param channel_address the address of the client to close
   */
  public closeChannel = async (): Promise<void> => {
    // not relevant for connext
  }

  /**
   * Sends a token payment through the Connext network.
   * @param targetAddress recipient of the payment
   * @param tokenAddress contract address of the token
   * @param amount
   * @param secretHash optional; provide your own secret hash
   */
  private executePaymentTransfer = async (
    payload: TokenPaymentRequest,
  ): Promise<string> => {
    const client = this.getConnextClient();
    const transfer = await client.transfer({
      recipient: payload.targetAddress,
      amount: `${payload.amount}`,
      meta: { secretHash: payload.secretHash },
      assetId: payload.tokenAddress,
    });

    const response: TokenPaymentResponse = {
      ...payload,
      secret: transfer.paymentId,
    };

    if (response.secret) {
      // remove '0x'
      return response.secret.slice(2);
    } else {
      throw errors.INVALID_TOKEN_PAYMENT_RESPONSE;
    }
  }

  /**
   * Deposits more of a token to an existing client.
   * @param channel_address the address of the client to deposit to
   * @param balance the amount to deposit to the client
   */
  public depositToChannel = async (
    channel_address: string,
    balance: number,
  ): Promise<void> => {
    return ({} as any);
  }

  /** Connext client specific cleanup. */
  protected disconnect = async () => {
    this.setStatus(ClientStatus.Disconnected);
  }
}

export default ConnextClient;
