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
  SwapClientInfo,
} from '../swaps/SwapClient';
import { SwapDeal, ProvidePreimageRequest, TransferReceivedRequest } from '../swaps/types';
import { UnitConverter } from '../utils/UnitConverter';
import errors, { errorCodes } from './errors';
import {
  ConnextErrorResponse,
  ConnextInitWalletResponse,
  ConnextChannelConfig,
  ConnextBalanceResponse,
  ConnextTransferResponse,
  ConnextChannelCount,
  ConnextClientConfig,
  ConnextInfo,
  ConnextVersion,
  TokenPaymentRequest,
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

interface ConnextClient {
  once(event: 'preimage', listener: (preimageRequest: ProvidePreimageRequest) => void): void;
  once(event: 'transferReceived', listener: (transferReceivedRequest: TransferReceivedRequest) => void): void;
  on(event: 'htlcAccepted', listener: (rHash: string, amount: number, currency: string) => void): this;
  on(event: 'connectionVerified', listener: (swapClientInfo: SwapClientInfo) => void): this;
  once(event: 'initialized', listener: () => void): this;
  emit(event: 'htlcAccepted', rHash: string, amount: number, currency: string): boolean;
  emit(event: 'connectionVerified', swapClientInfo: SwapClientInfo): boolean;
  emit(event: 'initialized'): boolean;
  emit(event: 'preimage', preimageRequest: ProvidePreimageRequest): void;
  emit(event: 'transferReceived', transferReceivedRequest: TransferReceivedRequest): void;
}
/**
 * A class representing a client to interact with connext.
 */
class ConnextClient extends SwapClient {
  public readonly type = SwapClientType.Connext;
  public readonly finalLock = 200;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  private port: number;
  private host: string;
  private unitConverter: UnitConverter;
  private seed: string | undefined;

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
    if (!this.seed) {
      throw new Error('Cannot initialize ConnextClient without seed');
    }
    await this.initWallet(this.seed);
    await this.initConnextClient();
    await this.unsubscribeAll();
    await this.subscribePreimage();
    await this.subscribeIncomingTransfer();

    // Temp hack, remove/fix me before merging
    setTimeout(() => {
      this.verifyConnectionWithTimeout();
    }, 2000);
    // end of temp hack
  }

  public setSeed = (seed: string) => {
    this.seed = seed;
  }

  /**
   * Initiates wallet for the Connext client
   */
  public initWallet = async (seedMnemonic: string) => {
    const res = await this.sendRequest('/mnemonic', 'POST', { mnemonic: seedMnemonic });
    return parseResponseBody<ConnextInitWalletResponse>(res);
  }

  public initConnextClient = async () => {
    const res = await this.sendRequest('/connect', 'POST');
    return parseResponseBody<ConnextChannelConfig>(res);
  }

  private unsubscribeAll = async () => {
    await this.sendRequest('/subscribe/all', 'DELETE');
  }

  private subscribePreimage = async () => {
    await this.sendRequest('/subscribe', 'POST', {
      event: 'UPDATE_STATE_EVENT',
      // TODO: not always running on localhost
      webhook: 'http://localhost:8887/preimage',
    });
  }

  private subscribeIncomingTransfer = async () => {
    await this.sendRequest('/subscribe', 'POST', {
      event: 'MESSAGE_APP_INSTANCE_INSTALL',
      // TODO: not always running on localhost
      webhook: 'http://localhost:8887/incoming-transfer',
    });
  }

  /**
   * Associate connext with currencies that have a token address
   */
  private setTokenAddresses = (currencyInstances: CurrencyInstance[]) => {
    currencyInstances.forEach((currency) => {
      if (currency.tokenAddress && currency.swapClient === SwapClientType.Connext) {
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
      const configRes = await this.sendRequest('/config', 'GET');
      // TODO: fix types, extract private config
      const config = await parseResponseBody<any>(configRes);
      const { userPublicIdentifier } = config;
      this.emit('connectionVerified', {
        newIdentifier: userPublicIdentifier,
      });
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

    const secret = await this.executeHashLockTransfer({
      amount: '1',
      assetId: tokenAddress,
      lockHash: rHash,
      timelock: this.finalLock.toString(),
      recipient: destination,
    });
    return secret;
  }

  public sendPayment = async (deal: SwapDeal): Promise<string> => {
    assert(deal.state === SwapState.Active);
    assert(deal.destination);
    let amount: number;
    let tokenAddress: string;
    let lockTimeout: number | undefined;
    const waitForTransferClaimed = new Promise((resolve, reject) => {
      const failTimeout = setTimeout(() => {
        reject('hash lock transfer was not claimed within the timeout');
      }, 30000);
      // TODO: what happens in case of multiple transfers at the same time?
      this.once('preimage', (preimageRequest: ProvidePreimageRequest) => {
        // TODO: check that the hash and preimage match
        clearTimeout(failTimeout);
        resolve(preimageRequest.preimage);
      });
    });
    try {
      let secret;
      if (deal.role === SwapRole.Maker) {
        // we are the maker paying the taker
        amount = deal.takerUnits;
        tokenAddress = this.tokenAddresses.get(deal.takerCurrency)!;
        // secret = await this.executeHashLockResolve(deal.rPreimage);
        const executeTransfer = this.executeHashLockTransfer({
          assetId: tokenAddress,
          amount: `${amount}`,
          // TODO: double check timelock (100 is the connext internal buffer)
          timelock: (deal.takerCltvDelta + 100).toString(),
          lockHash: `0x${deal.rHash}`,
          recipient: deal.destination!,
        });
        const [executeTransferResponse, preimage] = await Promise.all([executeTransfer, waitForTransferClaimed]);
        console.log('executeTransferResponse', executeTransferResponse);
        // TODO: process the preimage earlier
        secret = (preimage as string).slice(2);
      } else {
        // we are the taker paying the maker
        amount = deal.makerUnits;
        tokenAddress = this.tokenAddresses.get(deal.makerCurrency)!;
        lockTimeout = deal.makerCltvDelta!;
        // TODO: why do we have to return preimage as a taker?
        // We already know it! -> deal.rPreimage.
        secret = deal.rPreimage!;

        const executeTransfer = this.executeHashLockTransfer({
          assetId: tokenAddress,
          amount: `${amount}`,
          timelock: lockTimeout.toString(),
          lockHash: `0x${deal.rHash}`,
          recipient: deal.destination!,
        });
        await Promise.all([executeTransfer, waitForTransferClaimed]);
      }
      return secret;
    } catch (err) {
      // TODO: review all of these
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

  // TODO: Connext does not have the concept of invoices, but
  // internally we reject the incoming transfer if it does not match the requirements.
  public addInvoice = async () => {
    // TODO: what happens in case of multiple transfers at the same time?
    this.once('transferReceived', (transferReceivedRequest) => {
      // TODO: validations for amount and timelock
      this.emit(
        'htlcAccepted',
        transferReceivedRequest.rHash,
        transferReceivedRequest.amount,
        // TODO: filter from this.tokenAddresses instead
        'ETH',
        // transferReceivedRequest.tokenAddress,
      );
    });
  }

  /**
   * Resolve a HashLock Transfer on the Connext network.
   */
  public settleInvoice = async (_rHash: string, rPreimage: string) => {
    await this.sendRequest('/hashlock-resolve', 'POST', {
      lockHash: `0x${rPreimage}`,
    });
    // TODO: error handling
  }

  public removeInvoice = async () => {
    // not implemented, connext does not use invoices
  }

  private async getHashLockStatus(lockHash: string) {
    const res = await this.sendRequest(`/hashlock-status/${lockHash}`, 'GET');
    const { status } = await parseResponseBody<ConnextTransferStatus>(res);
    return status;
  }

  public lookupPayment = async (rHash: string) => {
    try {
      const status = await this.getHashLockStatus(rHash);

      switch (status) {
        case 'PENDING':
          return { state: PaymentState.Pending };
        case 'COMPLETED':
          return { state: PaymentState.Succeeded };
        case 'EXPIRED':
        case 'FAILED':
          return { state: PaymentState.Failed };
        default:
          return { state: PaymentState.Failed };
      }
    } catch (e) {
      throw errors.PAYMENT_NOT_FOUND;
    }
  }

  public getRoute = async () => {
    return {
      // TODO: verify that it's OK to return
      // static getTotalTimeLock
      getTotalTimeLock: () => 101,
    };
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
          active: connextChannels.length,
          settled: 0,
          closed: 0,
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
  public getChannel = async (): Promise<ConnextChannelConfig> => {
    const res = await this.sendRequest('/config', 'GET');
    const channel = await parseResponseBody<ConnextChannelConfig>(res);
    return channel;
  }

  /**
   * Gets info about all non-settled channels.
   * @param tokenAddress an optional parameter to specify channels belonging to the specified token network
   */
  public getChannels = async (): Promise<ConnextChannelConfig[]> => {
    const channel = await this.getChannel();
    return [channel];
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

    const freeBalanceAmount = this.unitConverter.unitsToAmount({
      currency,
      units: Number(freeBalance),
    });
    const inactiveBalance = 0;
    const balance = freeBalanceAmount + inactiveBalance;

    return {
      balance,
      // TODO: inactiveBalance
      inactiveBalance,
      // TODO: is there a way to check pending channel balance for Connext?
      pendingOpenBalance: 0,
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
  public walletBalance = async (): Promise<WalletBalance> => {
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
   * Create a HashLock Transfer on the Connext network.
   * @param targetAddress recipient of the payment
   * @param tokenAddress contract address of the token
   * @param amount
   * @param lockHash
   */
  private executeHashLockTransfer = async (payload: TokenPaymentRequest): Promise<string> => {
    const res = await this.sendRequest('/hashlock-transfer', 'POST', payload);
    const { appId } = await parseResponseBody<ConnextTransferResponse>(res);
    return appId;

    /* TODO: we don't need this?
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
    */
  }

  /**
   * Deposits more of a token to an existing client.
   * @param multisigAddress the address of the client to deposit to
   * @param balance the amount to deposit to the client
   */
  public depositToChannel = async (
    assetId: string,
    amount: number,
  ): Promise<void> => {
    await this.sendRequest('/hashlock-transfer', 'POST', {
      amount,
      assetId,
    });
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
        path: `${endpoint}`,
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
