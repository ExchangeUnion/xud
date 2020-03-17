import assert from 'assert';
import http from 'http';
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
import errors, { errorCodes } from './errors';
import {
  ConnextErrorResponse,
  ConnextInitWalletResponse,
  ConnextInitClientResponse,
  ConnextBalanceResponse,
  ConnextTransferResponse,
  ConnextChannelCount,
  ConnextClientConfig,
  ConnextInfo,
  ConnextVersion,
  TokenPaymentRequest,
  TokenPaymentResponse,
  ConnextTransferStatus,
} from './types';

const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;

/**
 * A utility function to parse the payload from an http response.
 */
async function parseResponseBody<T>(res: http.IncomingMessage): Promise<T> {
  res.setEncoding('utf8');
  return new Promise<T>((resolve, reject) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      resolve(JSON.parse(body));
    });
    res.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * A class representing a client to interact with connext.
 */
class ConnextClient extends SwapClient {
  public readonly type = SwapClientType.Connext;
  public readonly finalLock = 100;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  private port: number;
  private host: string;
  private unitConverter: UnitConverter;

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

    this.port = config.port;
    this.host = config.host;
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
    await this.initConnextClient();
    this.setStatus(ClientStatus.Initialized);
    this.emit('initialized');
    await this.verifyConnectionWithTimeout();
  }
  /**
   * Initiates wallet for the Connext client
   */
  public initWallet = async (seedMnemonic: string[]) => {
    const res = await this.sendRequest('/mnemonic', 'POST', { mnemonic: seedMnemonic.join(' ') });
    return parseResponseBody<ConnextInitWalletResponse>(res);
  }

  public initConnextClient = async () => {
    const res = await this.sendRequest('/connect', 'POST');
    return parseResponseBody<ConnextInitClientResponse>(res);
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
      await this.sendRequest('/health', 'GET');

      // TODO: get SwapClientInfo
      this.emit('connectionVerified', { newIdentifier: '' });
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

  public lookupPayment = async (rHash: string) => {
    const res = await this.sendRequest(`/hashlock-status/${rHash}`, 'GET');
    const { success } = await parseResponseBody<ConnextTransferStatus>(res);

    if (success) {
      return { state: PaymentState.Succeeded };
    }
    return { state: PaymentState.Failed };
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
   * @param multisigAddress the address of the client to query
   */
  public getChannel = async (
    tokenAddress: string,
    multisigAddress: string,
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
    if (!currency) {
      return { balance: 0, pendingOpenBalance: 0, inactiveBalance: 0 };
    }

    const tokenAddress = this.getTokenAddress(currency);

    const res = await this.sendRequest(`/balance/${tokenAddress}`, 'GET');
    const { freeBalance } = await parseResponseBody<ConnextBalanceResponse>(res);

    const pendingOpenBalance = this.unitConverter.unitsToAmount({
      currency,
      units: Number(freeBalance),
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
  public walletBalance = async (currency?: string): Promise<WalletBalance> => {
    return { totalBalance: 0, confirmedBalance: 0, unconfirmedBalance: 0 };
  }
  /**
   * Creates a payment client.
   */
  public openChannel = async (): Promise<void> => {
    await this.initConnextClient();
  }

  /**
   * Closes a payment client.
   * @param multisigAddress the address of the client to close
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
    const res = await this.sendRequest('/hashlock-transfer', 'POST', {
      amount: `${payload.amount}`,
      preImage: payload.secretHash,
      assetId: payload.tokenAddress,
    });
    const { preImage } = await parseResponseBody<ConnextTransferResponse>(res);

    const response: TokenPaymentResponse = {
      ...payload,
      secret: preImage,
    };

    if (response.secret && response.secret.startsWith('0x')) {
      // remove '0x'
      return response.secret.slice(2);
    } else {
      throw errors.INVALID_TOKEN_PAYMENT_RESPONSE;
    }
  }

  /**
   * Deposits more of a token to an existing client.
   * @param multisigAddress the address of the client to deposit to
   * @param balance the amount to deposit to the client
   */
  public depositToChannel = async (
    multisigAddress: string,
    balance: number,
  ): Promise<void> => {
    return ({} as any);
  }

  /** Connext client specific cleanup. */
  protected disconnect = async () => {
    this.setStatus(ClientStatus.Disconnected);
  }

  /**
   * Sends a request to the Connext REST API.
   * @param endpoint the URL endpoint
   * @param method an HTTP request method
   * @param payload the request payload
   */
  private sendRequest = (endpoint: string, method: string, payload?: object): Promise<http.IncomingMessage> => {
    return new Promise((resolve, reject) => {
      const options: http.RequestOptions = {
        method,
        hostname: this.host,
        port: this.port,
        path: `/api/v1/${endpoint}`,
      };

      let payloadStr: string | undefined;
      if (payload) {
        payloadStr = JSON.stringify(payload);
        options.headers = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payloadStr),
        };
      }

      this.logger.trace(`sending request to ${endpoint}: ${payloadStr}`);
      const req = http.request(options, async (res) => {
        switch (res.statusCode) {
          case 200:
          case 201:
          case 204:
            resolve(res);
            break;
          case 402:
            reject(errors.INSUFFICIENT_BALANCE);
            break;
          case 408:
            reject(errors.TIMEOUT);
            break;
          case 409:
            const body = await parseResponseBody<ConnextErrorResponse>(res);
            reject(body.message);
            break;
          case 500:
            this.logger.error(`connext server error ${res.statusCode}: ${res.statusMessage}`);
            reject(errors.SERVER_ERROR);
            break;
          default:
            this.logger.error(`unexpected connext status ${res.statusCode}: ${res.statusMessage}`);
            reject(errors.UNEXPECTED);
            break;
        }
      });

      req.on('error', async (err: any) => {
        if (err.code === 'ECONNREFUSED') {
          await this.disconnect();
        }
        this.logger.error(err);
        reject(err);
      });

      if (payloadStr) {
        req.write(payloadStr);
      }
      req.end();
    });
  }
}

export default ConnextClient;
