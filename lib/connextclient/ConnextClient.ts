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
  Channel,
  OpenChannelPayload,
  ConnextChannelCount,
  ConnextClientConfig,
  ConnextInfo,
  ConnextVersion,
  TokenPaymentRequest,
  TokenPaymentResponse,
} from './types';

/**
 * A class representing a client to interact with connext.
 */
class ConnextClient extends SwapClient {
  public readonly type = SwapClientType.Connext;
  public readonly finalLock = 100;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  private disable: boolean;
  private ethProviderUrl: string;
  private nodeUrl: string;
  private unitConverter: UnitConverter;

  private channel: IConnextClient | undefined;
  private wallet: ConnextWallet | undefined;

  /**
   * Creates a connext client.
   */
  constructor({
    config,
    logger,
    unitConverter,
  }: {
    unitConverter: UnitConverter;
    config: ConnextClientConfig;
    logger: Logger;
  }) {
    super(logger);
    const { disable, ethProviderUrl, nodeUrl } = config;

    this.disable = disable;
    this.ethProviderUrl = ethProviderUrl;
    this.nodeUrl = nodeUrl;
    this.unitConverter = unitConverter;
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
  public init = async (currencyInstances: CurrencyInstance[]) => {
    if (this.disable) {
      await this.setStatus(ClientStatus.Disabled);
      return;
    }
    if (!this.wallet) {
      throw errors.CONNNEXT_WALLET_NOT_INITIATED;
    }
    if (this.wallet) {
      this.setTokenAddresses(currencyInstances);

      const wallet = this.wallet;

      this.channel = await connext.connect({
        nodeUrl: this.nodeUrl,
        ethProviderUrl: this.ethProviderUrl,
        xpub: wallet.xpub,
        keyGen: (index: string) => wallet.keyGen(index),
        store: new ConnextStore(new FileStorage()),
      });

      await this.setStatus(ClientStatus.Initialized);
      this.emit('initialized');
      await this.verifyConnectionWithTimeout();
    } else {
    }
  }
  /**
   * Initiates wallet for the Connext client
   */
  public initWallet = async (seedMnemonic: string[]) => {
    this.wallet = new ConnextWallet(seedMnemonic.join(' '));
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

  public totalOutboundAmount = (currency: string): number => {
    return 10 ** 10;
  }

  public maxChannelOutboundAmount = (currency: string): number => {
    return 10 ** 10;
  }

  public maxChannelInboundAmount = (currency: string): number => {
    return 10 ** 10;
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

  protected verifyConnection = async () => {
    this.logger.info('trying to verify connection to connext');
    try {
      if (!this.channel) {
        throw errors.CONNNEXT_CHANNEL_NOT_INITIATED;
      }

      await this.channel.isAvailable();

      this.emit('connectionVerified', { newIdentifier: this.channel.publicIdentifier });
      await this.setStatus(ClientStatus.ConnectionVerified);
    } catch (err) {
      this.logger.error(
        `could not verify connection to connext, retrying in ${ConnextClient.RECONNECT_TIME_LIMIT} ms`,
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
    const tokenAddress = this.tokenAddresses.get(currency);
    if (!tokenAddress) {
      throw errors.TOKEN_ADDRESS_NOT_FOUND;
    }

    const tokenPaymentResponse = await this.tokenPayment({
      token_address: tokenAddress,
      target_address: destination,
      amount: 1,
      secret_hash: rHash,
    });
    return this.sanitizeTokenPaymentResponse(tokenPaymentResponse);
  }

  public sendPayment = async (deal: SwapDeal): Promise<string> => {
    assert(deal.state === SwapState.Active);
    assert(deal.destination);
    let amount: number;
    let tokenAddress: string;
    let lock_timeout: number | undefined;
    if (deal.role === SwapRole.Maker) {
      // we are the maker paying the taker
      amount = deal.takerUnits;
      tokenAddress = this.tokenAddresses.get(deal.takerCurrency)!;
    } else {
      // we are the taker paying the maker
      amount = deal.makerUnits;
      tokenAddress = this.tokenAddresses.get(deal.makerCurrency)!;
      lock_timeout = deal.makerCltvDelta!;
    }
    if (!tokenAddress) {
      throw errors.TOKEN_ADDRESS_NOT_FOUND;
    }
    try {
      const tokenPaymentResponse = await this.tokenPayment({
        amount,
        lock_timeout,
        token_address: tokenAddress,
        target_address: deal.destination!,
        secret_hash: deal.rHash,
      });
      return this.sanitizeTokenPaymentResponse(tokenPaymentResponse);
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

  private sanitizeTokenPaymentResponse = (response: TokenPaymentResponse) => {
    if (response.secret) {
      const res = {};
      return (res as any);
    } else {
      throw errors.INVALID_TOKEN_PAYMENT_RESPONSE;
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
      if (identifier === Number(pendingTransfer.payment_identifier)) {
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
    let endpoint = 'pending_transfers';
    if (currency) {
      const tokenAddress = this.tokenAddresses.get(currency);
      endpoint += `/${tokenAddress}`;
      if (destination) {
        endpoint += `/${destination}`;
      }
    }
    const res = this.channel?.isAvailable();
    return (res as any);
  }

  private getPaymentEvents = async (
    currency?: string,
    destination?: string,
  ) => {
    let endpoint = 'payments';
    if (currency) {
      const tokenAddress = this.tokenAddresses.get(currency);
      endpoint += `/${tokenAddress}`;
      if (destination) {
        endpoint += `/${destination}`;
      }
    }
    const res = this.channel?.isAvailable();
    return (res as any);
  }

  public getRoute = async () => {
    // not implemented since connext doesnt use routes
    return undefined;
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
    const endpoint = 'version';
    const res = this.channel?.isAvailable();
    return (res as any);
  }

  /**
   * Gets info about a given connext payment channel.
   * @param token_address the token address for the network to which the channel belongs
   * @param channel_address the address of the channel to query
   */
  public getChannel = async (
    token_address: string,
    channel_address: string,
  ): Promise<Channel> => {
    const endpoint = `channels/${token_address}/${channel_address}`;
    const res = this.channel?.isAvailable();
    return (res as any);
  }

  /**
   * Gets info about all non-settled channels.
   * @param token_address an optional parameter to specify channels belonging to the specified token network
   */
  public getChannels = async (token_address?: string): Promise<Channel[]> => {
    const endpoint = token_address ? `channels/${token_address}` : 'channels';
    const res = this.channel?.isAvailable();
    return (res as any);
  }

  public channelBalance = async (
    currency?: string,
  ): Promise<ChannelBalance> => {
    if (!this.channel) {
      throw errors.CONNNEXT_CHANNEL_NOT_INITIATED;
    }
    if (!currency) {
      return { balance: 0, pendingOpenBalance: 0, inactiveBalance: 0 };
    }

    const tokenAddress = this.tokenAddresses.get(currency);

    const freeBalance = await this.channel.getFreeBalance(tokenAddress);

    const balance = this.unitConverter.unitsToAmount({
      currency,
      units: freeBalance[this.channel.multisigAddress].toNumber(),
    });
    return {
      balance,
      pendingOpenBalance: 0,
      inactiveBalance: 0,
    };
  }

  public tradingLimits = async (currency?: string): Promise<TradingLimits> => {
    if (!this.channel) {
      throw errors.CONNNEXT_CHANNEL_NOT_INITIATED;
    }
    if (!currency) {
      return { maxSell: 0, maxBuy: 0 };
    }

    return {
      maxSell: 10 ** 10,
      maxBuy: 10 ** 10,
    };
  }

  /**
   * Returns the balances available in wallet for a specified currency.
   */
  public walletBalance = async (_currency?: string): Promise<WalletBalance> => {
    return { totalBalance: 0, confirmedBalance: 0, unconfirmedBalance: 0 };
  }

  /**
   * Creates a payment channel.
   */
  public openChannel = async ({
    peerIdentifier: peerAddress,
    units,
    currency,
  }: {
    peerIdentifier: string;
    units: number;
    currency: string;
  }): Promise<void> => {
    const tokenAddress = this.tokenAddresses.get(currency);
    if (!tokenAddress) {
      throw errors.TOKEN_ADDRESS_NOT_FOUND;
    }
    await this.openChannelRequest({
      partner_address: peerAddress,
      token_address: tokenAddress,
      total_deposit: units,
      settle_timeout: 20660,
    });
  }

  /**
   * Creates a payment channel request.
   * @returns The channel_address for the newly created channel.
   */
  private openChannelRequest = async (
    payload: OpenChannelPayload,
  ): Promise<string> => {
    const endpoint = 'channels';
    const res = this.channel?.isAvailable();
    return (res as any);
  }

  /**
   * Closes a payment channel.
   * @param channel_address the address of the channel to close
   */
  public closeChannel = async (channel_address: string): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    await this.channel?.isAvailable();
  }

  /**
   * Sends a token payment through the Connext network.
   * @param target_address recipient of the payment
   * @param token_address contract address of the token
   * @param amount
   * @param secret_hash optional; provide your own secret hash
   */
  private tokenPayment = async (
    payload: TokenPaymentRequest,
  ): Promise<TokenPaymentResponse> => {
    const endpoint = `payments/${payload.token_address}/${payload.target_address}`;
    if (payload.secret_hash) {
      payload.secret_hash = `0x${payload.secret_hash}`;
    }

    const res = this.channel?.isAvailable();
    return (res as any);
  }

  /**
   * Deposits more of a token to an existing channel.
   * @param channel_address the address of the channel to deposit to
   * @param balance the amount to deposit to the channel
   */
  public depositToChannel = async (
    channel_address: string,
    balance: number,
  ): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    await this.channel?.isAvailable();
  }

  /** Connext client specific cleanup. */
  protected disconnect = async () => {
    await this.setStatus(ClientStatus.Disconnected);
  }
}

export default ConnextClient;
