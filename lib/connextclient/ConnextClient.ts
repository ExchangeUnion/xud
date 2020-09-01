import assert from 'assert';
import http from 'http';
import { SwapClientType, SwapRole, SwapState } from '../constants/enums';
import { CurrencyInstance } from '../db/types';
import { XudError } from '../types';
import Logger from '../Logger';
import swapErrors from '../swaps/errors';
import SwapClient, {
  ChannelBalance,
  ClientStatus,
  PaymentState,
  WalletBalance,
  TradingLimits,
  SwapClientInfo,
  PaymentStatus,
  WithdrawArguments,
} from '../swaps/SwapClient';
import { SwapDeal, CloseChannelParams, OpenChannelParams } from '../swaps/types';
import { UnitConverter } from '../utils/UnitConverter';
import errors, { errorCodes } from './errors';
import {
  ConnextErrorResponse,
  ConnextInitWalletResponse,
  ConnextConfigResponse,
  ConnextBalanceResponse,
  ConnextTransferResponse,
  ConnextClientConfig,
  ConnextInfo,
  ConnextVersion,
  TokenPaymentRequest,
  ConnextTransferStatus,
  ExpectedIncomingTransfer,
  ProvidePreimageEvent,
  TransferReceivedEvent,
  ConnextDepositResponse,
  OnchainTransferResponse,
} from './types';
import { parseResponseBody } from '../utils/utils';
import { Observable, fromEvent, from, combineLatest, defer } from 'rxjs';
import { take, pluck, timeout, filter, mergeMap } from 'rxjs/operators';

const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;

interface ConnextClient {
  on(event: 'preimage', listener: (preimageRequest: ProvidePreimageEvent) => void): void;
  on(event: 'transferReceived', listener: (transferReceivedRequest: TransferReceivedEvent) => void): void;
  on(event: 'htlcAccepted', listener: (rHash: string, amount: number, currency: string) => void): this;
  on(event: 'connectionVerified', listener: (swapClientInfo: SwapClientInfo) => void): this;
  on(event: 'depositConfirmed', listener: (hash: string) => void): this;
  once(event: 'initialized', listener: () => void): this;
  emit(event: 'htlcAccepted', rHash: string, amount: number, currency: string): boolean;
  emit(event: 'connectionVerified', swapClientInfo: SwapClientInfo): boolean;
  emit(event: 'initialized'): boolean;
  emit(event: 'preimage', preimageRequest: ProvidePreimageEvent): void;
  emit(event: 'transferReceived', transferReceivedRequest: TransferReceivedEvent): void;
  emit(event: 'depositConfirmed', hash: string): void;
}

/**
 * Waits for the preimage event from SwapClient for a specified hash
 * @param client the swap client instance to listen events from
 * @param expectedHash the expected hash of the payment
 * @param errorTimeout optional maximum duration of time to wait for the preimage
 */
const waitForPreimageByHash = (
  client: SwapClient,
  expectedHash: string,
  errorTimeout = 89000,
): Promise<string> => {
  // create an observable that emits values when a preimage
  // event is triggered on the client
  const preimage$: Observable<ProvidePreimageEvent> = fromEvent(client, 'preimage');
  const expectedPreimageReceived$ = preimage$.pipe(
    // filter out events that do not match our expected hash
    filter(preimageEvent => preimageEvent.rHash === expectedHash),
    // map the ProvidePreimageEvent object to a string as the consumer is
    // only interested in the value of the preimage
    pluck('preimage'),
    // complete the observable and clean up all the listeners
    // once we receive 1 event that matches our conditions
    take(1),
    // emit an error if the observable does not emit any values
    // for the specified duration
    timeout(errorTimeout),
  );
  // convert the observable to a promise that resolves on complete
  // and rejects on error
  return expectedPreimageReceived$.toPromise();
};

/**
 * A class representing a client to interact with connext.
 */
class ConnextClient extends SwapClient {
  public readonly type = SwapClientType.Connext;
  public readonly finalLock = 200;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  /**
   * A map of expected invoices by hash.
   * This is equivalent to invoices of lnd with the difference
   * being that we're managing the state of invoice on xud level.
   */
  private expectedIncomingTransfers = new Map<string, ExpectedIncomingTransfer>();
  /** The set of hashes for outgoing transfers. */
  private outgoingTransferHashes = new Set<string>();
  private port: number;
  private host: string;
  private webhookport: number;
  private webhookhost: string;
  private unitConverter: UnitConverter;
  private seed: string | undefined;
  /** A map of currencies to promises representing balance requests. */
  private getBalancePromises = new Map<string, Promise<ConnextBalanceResponse>>();
  private _totalOutboundAmount = new Map<string, number>();

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
    this.webhookhost = config.webhookhost;
    this.webhookport = config.webhookport;
    this.unitConverter = unitConverter;
    this.setTokenAddresses(currencyInstances);
  }

  public get minutesPerBlock() {
    return 0.25; // 15 seconds per block target
  }

  public get label() {
    return 'Connext';
  }

  public initSpecific = async () => {
    this.on('transferReceived', this.onTransferReceived.bind(this));
  }

  private onTransferReceived = (transferReceivedRequest: TransferReceivedEvent) => {
    const {
      tokenAddress,
      units,
      timelock,
      rHash,
      paymentId,
    } = transferReceivedRequest;

    if (this.outgoingTransferHashes.has(rHash)) {
      this.outgoingTransferHashes.delete(rHash);
      this.logger.debug(`outgoing hash lock transfer with rHash ${rHash} created`);
      return;
    }
    const expectedIncomingTransfer = this.expectedIncomingTransfers.get(rHash);
    if (!expectedIncomingTransfer) {
      this.logger.warn(`received unexpected incoming transfer created event with rHash ${rHash}`);
      return;
    }

    const {
      units: expectedUnits,
      expiry: expectedTimelock,
      tokenAddress: expectedTokenAddress,
    } = expectedIncomingTransfer;
    const currency = this.getCurrencyByTokenaddress(tokenAddress);
    if (
      tokenAddress === expectedTokenAddress &&
      units === expectedUnits &&
      timelock === expectedTimelock
    ) {
      expectedIncomingTransfer.paymentId = paymentId;
      this.logger.debug(`accepting incoming transfer with rHash: ${rHash}, units: ${units}, timelock ${timelock}, currency ${currency}, and paymentId ${paymentId}`);
      this.emit('htlcAccepted', rHash, units, currency);
    }
  }

  // TODO: Ideally, this would be set in the constructor.
  // Related issue: https://github.com/ExchangeUnion/xud/issues/1494
  public setSeed = (seed: string) => {
    this.seed = seed;
  }

  /**
   * Initiates wallet for the Connext client
   */
  public initWallet = async (seedMnemonic: string) => {
    const res = await this.sendRequest('/mnemonic', 'POST', { mnemonic: seedMnemonic });
    return await parseResponseBody<ConnextInitWalletResponse>(res);
  }

  public initConnextClient = async (seedMnemonic: string) => {
    const res = await this.sendRequest('/connect', 'POST', { mnemonic: seedMnemonic });
    return await parseResponseBody<ConnextConfigResponse>(res);
  }

  private subscribeDeposit = async () => {
    await this.sendRequest('/subscribe', 'POST', {
      event: 'DEPOSIT_CONFIRMED_EVENT',
      webhook: `http://${this.webhookhost}:${this.webhookport}/deposit-confirmed`,
    });
  }

  private subscribePreimage = async () => {
    await this.sendRequest('/subscribe', 'POST', {
      event: 'CONDITIONAL_TRANSFER_UNLOCKED_EVENT',
      webhook: `http://${this.webhookhost}:${this.webhookport}/preimage`,
    });
  }

  private subscribeIncomingTransfer = async () => {
    await this.sendRequest('/subscribe', 'POST', {
      event: 'CONDITIONAL_TRANSFER_CREATED_EVENT',
      webhook: `http://${this.webhookhost}:${this.webhookport}/incoming-transfer`,
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

  public totalOutboundAmount = (currency: string): number => {
    return this._totalOutboundAmount.get(currency) || 0;
  }

  public maxChannelOutboundAmount = (currency: string): number => {
    return this._totalOutboundAmount.get(currency) || 0;
  }

  public maxChannelInboundAmount = (_currency: string): number => {
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

  protected getCurrencyByTokenaddress(tokenAddress: string): string {
    let currency;
    for (const [key, value] of this.tokenAddresses.entries()) {
      if (value === tokenAddress) {
        currency = key;
      }
    }
    if (!currency) {
      throw errors.CURRENCY_NOT_FOUND_BY_TOKENADDRESS(tokenAddress);
    }
    return currency;
  }

  protected verifyConnection = async () => {
    this.logger.info('trying to verify connection to connext');
    try {
      if (!this.seed) {
        throw errors.MISSING_SEED;
      }
      await this.sendRequest('/health', 'GET');
      await this.initWallet(this.seed);
      const config = await this.initConnextClient(this.seed);
      await this.subscribePreimage();
      await this.subscribeIncomingTransfer();
      await this.subscribeDeposit();
      const { userIdentifier } = config;
      this.emit('connectionVerified', {
        newIdentifier: userIdentifier,
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
    let amount: string;
    let tokenAddress: string;
    let lockTimeout: number | undefined;
    try {
      let secret;
      if (deal.role === SwapRole.Maker) {
        // we are the maker paying the taker
        amount = BigInt(deal.takerUnits).toString();
        tokenAddress = this.tokenAddresses.get(deal.takerCurrency)!;
        const executeTransfer = this.executeHashLockTransfer({
          amount,
          assetId: tokenAddress,
          timelock: deal.takerCltvDelta.toString(),
          lockHash: `0x${deal.rHash}`,
          recipient: deal.destination,
        });
        // @ts-ignore
        const [executeTransferResponse, preimage] = await Promise.all([
          executeTransfer,
          waitForPreimageByHash(this, deal.rHash),
        ]);
        this.logger.debug(`received preimage ${preimage} for payment with hash ${deal.rHash}`);
        secret = preimage;
      } else {
        // we are the taker paying the maker
        amount = BigInt(deal.makerUnits).toString();
        tokenAddress = this.tokenAddresses.get(deal.makerCurrency)!;
        lockTimeout = deal.makerCltvDelta!;
        secret = deal.rPreimage!;
        const executeTransfer = this.executeHashLockTransfer({
          amount,
          assetId: tokenAddress,
          timelock: lockTimeout.toString(),
          lockHash: `0x${deal.rHash}`,
          recipient: deal.destination,
        });
        await executeTransfer;
      }
      return secret;
    } catch (err) {
      switch (err.code) {
        case 'ECONNRESET':
        case errorCodes.UNEXPECTED:
        case errorCodes.TIMEOUT:
        case errorCodes.SERVER_ERROR:
        case errorCodes.INVALID_TOKEN_PAYMENT_RESPONSE:
        default:
          throw swapErrors.UNKNOWN_PAYMENT_ERROR(err.message);
      }
    }
  }

  public addInvoice = async (
    { rHash: expectedHash, units: expectedUnits, expiry: expectedTimelock, currency: expectedCurrency }:
    { rHash: string, units: number, expiry?: number, currency?: string },
  ) => {
    if (!expectedCurrency) {
      throw errors.CURRENCY_MISSING;
    }
    if (!expectedTimelock) {
      throw errors.EXPIRY_MISSING;
    }
    const expectedTokenAddress = this.getTokenAddress(expectedCurrency);
    const expectedIncomingTransfer: ExpectedIncomingTransfer = {
      rHash: expectedHash,
      units: expectedUnits,
      expiry: expectedTimelock,
      tokenAddress: expectedTokenAddress,
    };
    this.expectedIncomingTransfers.set(expectedHash, expectedIncomingTransfer);
  }

  /**
   * Resolves a HashLock Transfer on the Connext network.
   */
  public settleInvoice = async (rHash: string, rPreimage: string, currency: string) => {
    this.logger.debug(`settling ${currency} invoice for ${rHash} with preimage ${rPreimage}`);
    const assetId = this.tokenAddresses.get(currency);
    await this.sendRequest('/hashlock-resolve', 'POST', {
      assetId,
      preImage: `0x${rPreimage}`,
    });
    this.expectedIncomingTransfers.delete(rHash);
  }

  public removeInvoice = async (rHash: string) => {
    const expectedIncomingTransfer = this.expectedIncomingTransfers.get(rHash);
    if (expectedIncomingTransfer) {
      const { paymentId } = expectedIncomingTransfer;
      if (paymentId) {
        // resolve a hashlock with a paymentId but no preimage to cancel it
        await this.sendRequest('/hashlock-resolve', 'POST', {
          paymentId,
          assetId: expectedIncomingTransfer.tokenAddress,
        });
        this.logger.debug(`canceled incoming transfer with rHash ${rHash}`);
      } else {
        this.logger.warn(`could not find paymentId for incoming transfer with hash ${rHash}`);
      }
      this.expectedIncomingTransfers.delete(rHash);
    } else {
      this.logger.warn(`could not find expected incoming transfer with hash ${rHash}`);
    }
  }

  private async getHashLockStatus(lockHash: string, assetId: string) {
    const res = await this.sendRequest(`/hashlock-status/0x${lockHash}/${assetId}`, 'GET');
    const transferStatusResponse = await parseResponseBody<ConnextTransferStatus>(res);
    return transferStatusResponse;
  }

  public lookupPayment = async (rHash: string, currency: string): Promise<PaymentStatus> => {
    try {
      const assetId = this.getTokenAddress(currency);
      const transferStatusResponse = await this.getHashLockStatus(rHash, assetId);

      this.logger.trace(`hashlock status for payment with hash ${rHash} is ${transferStatusResponse.status}`);
      switch (transferStatusResponse.status) {
        case 'PENDING':
          return { state: PaymentState.Pending };
        case 'COMPLETED':
          return {
            state: PaymentState.Succeeded,
            preimage: transferStatusResponse.preImage?.slice(2),
          };
        case 'EXPIRED':
        case 'FAILED':
          return { state: PaymentState.Failed };
        default:
          this.logger.debug(`no hashlock status for payment with hash ${rHash}: ${JSON.stringify(transferStatusResponse)}`);
          return { state: PaymentState.Pending };
      }
    } catch (err) {
      if (err.code === errorCodes.PAYMENT_NOT_FOUND) {
        return { state: PaymentState.Failed };
      }
      this.logger.error(`could not lookup payment for ${rHash}`, err);
      return { state: PaymentState.Pending }; // return pending if we hit an error
    }
  }

  public getRoute = async () => {
    /** A placeholder route value that assumes a fixed lock time of 100 for Connext. */
    return {
      getTotalTimeLock: () => 101,
    };
  }

  public canRouteToNode = async () => {
    return true;
  }

  public getHeight = async () => {
    return 1; // connext's API does not tell us the height
  }

  public getInfo = async (): Promise<ConnextInfo> => {
    let address: string | undefined;
    let version: string | undefined;
    let status = errors.CONNEXT_CLIENT_NOT_INITIALIZED.message;
    if (this.isDisabled()) {
      status = errors.CONNEXT_IS_DISABLED.message;
    } else {
      try {
        const getInfo$ = combineLatest(
          from(this.getVersion()),
          from(this.getClientConfig()),
        ).pipe(
          // error if no response within 5000 ms
          timeout(5000),
          // complete the stream when we receive 1 value
          take(1),
        );
        const [streamVersion, clientConfig] = await getInfo$.toPromise();
        status = 'Ready';
        version = streamVersion;
        address = clientConfig.signerAddress;
      } catch (err) {
        status = err.message;
      }
    }

    return { status, address, version };
  }

  /**
   * Gets the connext version.
   */
  public getVersion = async (): Promise<string> => {
    const res = await this.sendRequest('/version', 'GET');
    const { version } = await parseResponseBody<ConnextVersion>(res);
    return version;
  }

  /**
   * Gets the configuration of Connext client.
   */
  public getClientConfig = async (): Promise<ConnextConfigResponse> => {
    const res = await this.sendRequest('/config', 'GET');
    const clientConfig = await parseResponseBody<ConnextConfigResponse>(res);
    return clientConfig;
  }

  public channelBalance = async (
    currency?: string,
  ): Promise<ChannelBalance> => {
    if (!currency) {
      return { balance: 0, pendingOpenBalance: 0, inactiveBalance: 0 };
    }

    const { freeBalanceOffChain } = await this.getBalance(currency);

    const freeBalanceAmount = this.unitConverter.unitsToAmount({
      currency,
      units: Number(freeBalanceOffChain),
    });

    this._totalOutboundAmount.set(currency, freeBalanceAmount);
    return {
      balance: freeBalanceAmount,
      inactiveBalance: 0,
      pendingOpenBalance: 0,
    };
  }

  public tradingLimits = async (currency: string): Promise<TradingLimits> => {
    await this.channelBalance(currency); // refreshes the max outbound balance
    return {
      maxSell: this.maxChannelOutboundAmount(currency),
      maxBuy: this.maxChannelInboundAmount(currency),
    };
  }

  /**
   * Returns the balances available in wallet for a specified currency.
   */
  public walletBalance = async (
    currency?: string,
  ): Promise<WalletBalance> => {
    if (!currency) {
      return {
        totalBalance: 0,
        confirmedBalance: 0,
        unconfirmedBalance: 0,
      };
    }

    const { freeBalanceOnChain } = await this.getBalance(currency);

    const confirmedBalanceAmount = this.unitConverter.unitsToAmount({
      currency,
      units: Number(freeBalanceOnChain),
    });

    return {
      totalBalance: confirmedBalanceAmount,
      confirmedBalance: confirmedBalanceAmount,
      unconfirmedBalance: 0,
    };
  }

  private getBalance = (currency: string): Promise<ConnextBalanceResponse> => {
    // check if we already have a balance request that we are waiting a response for
    // it's not helpful to have simultaneous requests for the current balance, as they
    // should return the same info.
    let getBalancePromise = this.getBalancePromises.get(currency);
    if (!getBalancePromise) {
      // if not make a new balance request and store the promise that's waiting for a response
      const tokenAddress = this.getTokenAddress(currency);
      getBalancePromise = this.sendRequest(`/balance/${tokenAddress}`, 'GET').then((res) => {
        return parseResponseBody<ConnextBalanceResponse>(res);
      }).finally(() => {
        this.getBalancePromises.delete(currency); // clear the stored promise
      });
      this.getBalancePromises.set(currency, getBalancePromise);
    }

    return getBalancePromise;
  }

  public deposit = async () => {
    const clientConfig = await this.getClientConfig();
    return clientConfig.signerAddress;
  }

  public openChannel = async ({ currency, units }: OpenChannelParams) => {
    if (!currency) {
      throw errors.CURRENCY_MISSING;
    }
    const assetId = this.getTokenAddress(currency);
    const depositResponse = await this.sendRequest('/deposit', 'POST', {
      assetId,
      amount: BigInt(units).toString(),
    });
    const { txhash } = await parseResponseBody<ConnextDepositResponse>(depositResponse);
    const channelCollateralized$ = fromEvent(this, 'depositConfirmed').pipe(
      filter(hash => hash === txhash), // only proceed if the incoming hash matches our expected txhash
      take(1), // complete the stream after 1 matching event
      timeout(86400000), // clear up the listener after 1 day
      mergeMap(() => {
        // use defer to only create the inner observable when the outer one subscribes
        return defer(() => {
          return from(
            this.sendRequest('/request-collateral', 'POST', {
              assetId,
            }),
          );
        });
      }),
    );
    channelCollateralized$.subscribe({
      complete: () => {
        this.logger.verbose(`collateralized channel for ${currency}`);
      },
      error: (err) => {
        this.logger.error(`failed requesting collateral for ${currency}`, err);
      },
    });
  }

  public closeChannel = async ({ units, currency, destination }: CloseChannelParams): Promise<void> => {
    if (!currency) {
      throw errors.CURRENCY_MISSING;
    }
    const amount = units || (await this.getBalance(currency)).freeBalanceOffChain;

    await this.sendRequest('/withdraw', 'POST', {
      recipient: destination,
      amount: BigInt(amount).toString(),
      assetId: this.tokenAddresses.get(currency),
    });
  }

  /**
   * Create a HashLock Transfer on the Connext network.
   * @param targetAddress recipient of the payment
   * @param tokenAddress contract address of the token
   * @param amount
   * @param lockHash
   */
  private executeHashLockTransfer = async (payload: TokenPaymentRequest): Promise<string> => {
    this.logger.debug(`sending payment of ${payload.amount} with hash ${payload.lockHash} to ${payload.recipient}`);
    this.outgoingTransferHashes.add(payload.lockHash);
    const res = await this.sendRequest('/hashlock-transfer', 'POST', payload);
    const { appId } = await parseResponseBody<ConnextTransferResponse>(res);
    return appId;
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
      assetId,
      amount: BigInt(amount).toString(),
    });
  }

  public withdraw = async ({
    all,
    currency,
    amount: argAmount,
    destination,
    fee,
  }: WithdrawArguments): Promise<string> => {
    if (fee) {
      // TODO: allow overwriting gas price
      throw Error('setting fee for Ethereum withdrawals is not supported yet');
    }

    let units = '';

    const { freeBalanceOnChain } = await this.getBalance(currency);

    if (all) {
      if (currency === 'ETH') {
        // TODO: query Ether balance, subtract gas price times 21000 (gas usage of transferring Ether), and set that as amount
        throw new Error('withdrawing all ETH is not supported yet');
      }
      units = freeBalanceOnChain;
    } else if (argAmount) {
      const argUnits = this.unitConverter.amountToUnits({
        currency,
        amount: argAmount,
      });
      if (Number(freeBalanceOnChain) < argUnits) {
        throw errors.INSUFFICIENT_BALANCE;
      }
      units = argUnits.toString();
    }

    const res = await this.sendRequest('/onchain-transfer', 'POST', {
      assetId: this.getTokenAddress(currency),
      amount: units,
      recipient: destination,
    });
    const { txhash } = await parseResponseBody<OnchainTransferResponse>(res);
    return txhash;
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

      this.logger.trace(`sending request to ${endpoint}${payloadStr ? `: ${payloadStr}` : ''}`);
      const req = http.request(options, async (res) => {
        let err: XudError | undefined;
        switch (res.statusCode) {
          case 200:
          case 201:
          case 204:
            resolve(res);
            break;
          case 402:
            err = errors.INSUFFICIENT_BALANCE;
            break;
          case 404:
            err = errors.PAYMENT_NOT_FOUND;
            break;
          case 408:
            err = errors.TIMEOUT;
            break;
          case 409:
            const body = await parseResponseBody<ConnextErrorResponse>(res);
            this.logger.error(`409 status error: ${body}`);
            reject(body.message);
            break;
          case 500:
            err = errors.SERVER_ERROR(res.statusCode, res.statusMessage);
            break;
          default:
            err = errors.UNEXPECTED(res.statusCode!, res.statusMessage);
            break;
        }
        if (err) {
          this.logger.error(err.message);
          reject(err);
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
