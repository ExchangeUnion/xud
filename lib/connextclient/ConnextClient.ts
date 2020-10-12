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
  SwapClientInfo,
  PaymentStatus,
  WithdrawArguments,
} from '../swaps/SwapClient';
import { SwapDeal, CloseChannelParams, OpenChannelParams, SwapCapacities } from '../swaps/types';
import { UnitConverter } from '../utils/UnitConverter';
import errors, { errorCodes } from './errors';
import {
  ConnextErrorResponse,
  ConnextInitWalletResponse,
  ConnextConfig,
  ConnextConfigResponse,
  ConnextChannelResponse,
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
  ConnextWithdrawResponse,
  OnchainTransferResponse,
} from './types';
import { parseResponseBody, generatePreimageAndHash } from '../utils/utils';
import { Observable, fromEvent, from, combineLatest, defer, timer } from 'rxjs';
import { take, pluck, timeout, filter, catchError, mergeMapTo } from 'rxjs/operators';
import { sha256 } from '@ethersproject/solidity';

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
  /** A map of currencies to promises representing collateral requests. */
  private requestCollateralPromises = new Map<string, Promise<any>>();
  private outboundAmounts = new Map<string, number>();
  private inboundAmounts = new Map<string, number>();

  /** Public identifier for Connext */
  private publicIdentifier: string | undefined;
  /** Channel multisig address for Connext */
  private channel: string | undefined;

  /** The minimum incremental quantity that we may use for collateral requests. */
  private static MIN_COLLATERAL_REQUEST_SIZES: { [key: string]: number | undefined } = {
    ETH: 0.1 * 10 ** 8,
    USDT: 100 * 10 ** 8,
    DAI: 100 * 10 ** 8,
  };

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
      this.logger.warn(`received unexpected incoming transfer created event with rHash ${rHash}, units: ${units}, timelock ${timelock}, token address ${tokenAddress}, and paymentId ${paymentId}`);
      return;
    }

    const {
      units: expectedUnits,
      // expiry: expectedTimelock,
      tokenAddress: expectedTokenAddress,
    } = expectedIncomingTransfer;
    const currency = this.getCurrencyByTokenaddress(tokenAddress);
    if (
      tokenAddress === expectedTokenAddress &&
      units === expectedUnits
      // timelock === expectedTimelock
    ) {
      expectedIncomingTransfer.paymentId = paymentId;
      this.logger.debug(`accepting incoming transfer with rHash: ${rHash}, units: ${units}, timelock ${timelock}, currency ${currency}, and paymentId ${paymentId}`);
      this.expectedIncomingTransfers.delete(rHash);
      this.emit('htlcAccepted', rHash, units, currency);
    } else {
      if (tokenAddress !== expectedTokenAddress) {
        this.logger.warn(`incoming transfer for rHash ${rHash} with token address ${tokenAddress} does not match expected ${expectedTokenAddress}`);
      }
      if (units !== expectedUnits) {
        this.logger.warn(`incoming transfer for rHash ${rHash} with value ${units} does not match expected ${expectedUnits}`);
      }
      /*
      if (timelock !== expectedTimelock) {
        this.logger.warn(`incoming transfer for rHash ${rHash} with time lock ${timelock} does not match expected ${expectedTimelock}`);
      }
      */
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

  private subscribeIncomingTransfer = async () => {
    await this.sendRequest("/event/subscribe", "POST", {
      CONDITIONAL_TRANSFER_CREATED: `http://${this.webhookhost}:${this.webhookport}/incoming-transfer`,
    });
  };

  /*
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
  */

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
    return this.outboundAmounts.get(currency) || 0;
  }

  /**
   * Checks whether we have a pending collateral request for the currency and,
   * if one doesn't exist, starts a new request for the specified amount. Then
   * calls channelBalance to refresh the inbound capacity for the currency.
   */
  private requestCollateralInBackground = (currency: string, units: number) => {
    // first check whether we already have a pending collateral request for this currency
    // if not start a new request, and when it completes call channelBalance to refresh our inbound capacity
    const requestCollateralPromise = this.requestCollateralPromises.get(currency) ?? this.sendRequest('/request-collateral', 'POST', {
      assetId: this.tokenAddresses.get(currency),
      amount: units.toLocaleString('fullwide', { useGrouping: false }),
    }).then(() => {
      this.requestCollateralPromises.delete(currency);
      this.logger.debug(`completed collateral request of ${units} ${currency} units`);
      return this.channelBalance(currency);
    }).catch((err) => {
      this.requestCollateralPromises.delete(currency);
      this.logger.error(err);
    });
    this.requestCollateralPromises.set(currency, requestCollateralPromise);
  }

  public checkInboundCapacity = (inboundAmount: number, currency: string) => {
    const inboundCapacity = this.inboundAmounts.get(currency) || 0;
    if (inboundCapacity < inboundAmount) {
      // we do not have enough inbound capacity to receive the specified inbound amount so we must request collateral
      this.logger.debug(`collateral of ${inboundCapacity} for ${currency} is insufficient for order amount ${inboundAmount}`);

      // we want to make a request for the current collateral plus the greater of any
      // minimum request size for the currency or the capacity shortage + 5% buffer
      const quantityToRequest = inboundCapacity + Math.max(
        inboundAmount * 1.05 - inboundCapacity,
        ConnextClient.MIN_COLLATERAL_REQUEST_SIZES[currency] ?? 0,
      );
      const unitsToRequest = this.unitConverter.amountToUnits({ currency, amount: quantityToRequest });
      this.requestCollateralInBackground(currency, unitsToRequest);

      throw errors.INSUFFICIENT_COLLATERAL;
    }
  }

  public setReservedInboundAmount = (reservedInboundAmount: number, currency: string) => {
    const inboundCapacity = this.inboundAmounts.get(currency) || 0;
    if (inboundCapacity < reservedInboundAmount) {
      // we do not have enough inbound capacity to fill all open orders, so we will request more
      this.logger.debug(`collateral of ${inboundCapacity} for ${currency} is insufficient for reserved order amount of ${reservedInboundAmount}`);

      // we want to make a request for the current collateral plus the greater of any
      // minimum request size for the currency or the capacity shortage + 3% buffer
      const quantityToRequest = inboundCapacity + Math.max(
        reservedInboundAmount * 1.03 - inboundCapacity,
        ConnextClient.MIN_COLLATERAL_REQUEST_SIZES[currency] ?? 0,
      );
      const unitsToRequest = this.unitConverter.amountToUnits({ currency, amount: quantityToRequest });

      // we don't await this request - instead we allow for "lazy collateralization" to complete since
      // we don't expect all orders to be filled at once, we can be patient
      this.requestCollateralInBackground(currency, unitsToRequest);
    }
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
      // await this.initWallet(this.seed);
      /*
      await Promise.all([
        this.subscribePreimage(),
        this.subscribeIncomingTransfer(),
        this.subscribeDeposit(),
      ]);
      */
      // const { publicIdentifier } = (await this.getClientConfig());
      const config = await this.getClientConfig();
      console.log('config is', config);
      const { publicIdentifier } = config;
      console.log('setting publicIdentifier to', publicIdentifier);
      this.publicIdentifier = publicIdentifier;
      const channel = await this.getChannel();
      this.channel = channel;
      console.log('channel is', channel);
      await this.subscribeIncomingTransfer();
      this.emit('connectionVerified', {
        newIdentifier: publicIdentifier,
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

    assert(this.channel, 'cannot send transfer without channel address');
    assert(this.publicIdentifier, 'cannot send transfer with channel address');
    const { rPreimage } = await generatePreimageAndHash();
    await this.executeHashLockTransfer({
      type: "HashlockTransfer",
      amount: '1',
      assetId: tokenAddress,
      details: {
        lockHash: `0x${rHash}`,
        expiry: "0", // TODO: timelock: this.finalLock.toString()
      },
      recipient: destination,
      meta: {
        // TODO: we generate a random 32 byte hex string until connext
        // adds support to generate it from their side. Currently, it is buggy.
        routingId: `0x${rPreimage}`,
      },
      channelAddress: this.channel,
      publicIdentifier: this.publicIdentifier,
    });
    return 'sendSmallestAmount is broken';
  }

  public sendPayment = async (deal: SwapDeal): Promise<string> => {
    assert(deal.state === SwapState.Active);
    assert(deal.destination);
    assert(this.channel, 'cannot send transfer without channel address');
    assert(this.publicIdentifier, 'cannot send transfer with channel address');
    let amount: string;
    let tokenAddress: string;
    // let lockTimeout: number | undefined;
    const { rPreimage } = await generatePreimageAndHash();
    try {
      let secret;
      if (deal.role === SwapRole.Maker) {
        // we are the maker paying the taker
        amount = deal.takerUnits.toLocaleString('fullwide', { useGrouping: false });
        tokenAddress = this.tokenAddresses.get(deal.takerCurrency)!;
        const executeTransfer = this.executeHashLockTransfer({
          type: "HashlockTransfer",
          amount,
          assetId: tokenAddress,
          details: {
            lockHash: `0x${deal.rHash}`,
            expiry: "0", // TODO: timelock: this.finalLock.toString() - expiry is now absolute
          },
          recipient: deal.destination,
          meta: {
            // TODO: we generate a random 32 byte hex string until connext
            // adds support to generate it from their side. Currently, it is buggy.
            routingId: `0x${rPreimage}`,
          },
          channelAddress: this.channel,
          publicIdentifier: this.publicIdentifier,
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
        amount = deal.makerUnits.toLocaleString('fullwide', { useGrouping: false });
        tokenAddress = this.tokenAddresses.get(deal.makerCurrency)!;
        // lockTimeout = deal.makerCltvDelta!; // TODO: expiry is now absolute
        secret = deal.rPreimage!;
        const executeTransfer = this.executeHashLockTransfer({
          type: "HashlockTransfer",
          amount,
          assetId: tokenAddress,
          details: {
            lockHash: `0x${deal.rHash}`,
            expiry: "0", // TODO: lockTimeout.toString()
          },
          recipient: deal.destination,
          meta: {
            // TODO: we generate a random 32 byte hex string until connext
            // adds support to generate it from their side. Currently, it is buggy.
            routingId: `0x${rPreimage}`,
          },
          channelAddress: this.channel,
          publicIdentifier: this.publicIdentifier,
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
    const assetId = this.getTokenAddress(currency);
    await this.sendRequest('/hashlock-resolve', 'POST', {
      assetId,
      preImage: `0x${rPreimage}`,
    });
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

      this.logger.trace(`hashlock status for connext transfer with hash ${rHash} is ${transferStatusResponse.status}`);
      switch (transferStatusResponse.status) {
        case 'PENDING':
          return { state: PaymentState.Pending };
        case 'COMPLETED':
          return {
            state: PaymentState.Succeeded,
            preimage: transferStatusResponse.preImage?.slice(2),
          };
        case 'EXPIRED':
          const expiredTransferUnlocked$ = defer(() => from(
            // when the connext transfer (HTLC) expires the funds are not automatically returned to the channel balance
            // in order to unlock the funds we'll need to call /hashlock-resolve with the paymentId
            this.sendRequest('/hashlock-resolve', 'POST', {
              assetId,
              // providing a placeholder preImage for rest-api-client because it's a required field
              preImage: '0x',
              paymentId: sha256(['address', 'bytes32'], [assetId, `0x${rHash}`]),
            }),
          )).pipe(
            catchError((e, caught) => {
              const RETRY_INTERVAL = 30000;
              this.logger.error(`failed to unlock an expired connext transfer with rHash: ${rHash} - retrying in ${RETRY_INTERVAL}ms`, e);
              return timer(RETRY_INTERVAL).pipe(mergeMapTo(caught));
            }),
            take(1),
          );
          expiredTransferUnlocked$.subscribe({
            complete: () => {
              this.logger.debug(`successfully unlocked an expired connext transfer with rHash: ${rHash}`);
            },
          });
          return { state: PaymentState.Failed };
        case 'FAILED':
          return { state: PaymentState.Failed };
        default:
          this.logger.debug(`no hashlock status for connext transfer with hash ${rHash}: ${JSON.stringify(transferStatusResponse)} - attempting to reject app install proposal`);
          try {
            await this.sendRequest('/reject-install', 'POST', {
              appIdentityHash: transferStatusResponse.senderAppIdentityHash,
            });
            this.logger.debug(`connext transfer proposal with hash ${rHash} successfully rejected - transfer state is now failed`);
            return { state: PaymentState.Failed };
          } catch (e) {
            // in case of error we're still consider the payment as pending
            this.logger.error('failed to reject connext app install proposal', e);
            return { state: PaymentState.Pending };
          }
      }
    } catch (err) {
      if (err.code === errorCodes.PAYMENT_NOT_FOUND) {
        return { state: PaymentState.Failed };
      }
      this.logger.error(`could not lookup connext transfer for ${rHash}`, err);
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
    console.log('response from version', version);

    return version;
  }

  /**
   * Gets the configuration of Connext client.
   */
  private getClientConfig = async (): Promise<ConnextConfig> => {
    const res = await this.sendRequest('/config', 'GET');
    const clientConfig = await parseResponseBody<ConnextConfigResponse>(res);
    return clientConfig[0];
  }

  private getChannel = async (): Promise<string> => {
    const res = await this.sendRequest('/channel', 'GET');
    const channel = await parseResponseBody<ConnextChannelResponse>(res);
    if (channel.length === 0) {
      await this.sendRequest('/request-setup', 'POST', {
        // TODO: values from config
        aliceUrl: 'http://192.168.63.131:8007',
        chainId: '1337',
        timeout: '36000'
      });
      return (await this.getChannel());
    }
    return channel[0];
  }

  public channelBalance = async (
    currency?: string,
  ): Promise<ChannelBalance> => {
    if (!currency) {
      return { balance: 0, pendingOpenBalance: 0, inactiveBalance: 0 };
    }

    const { freeBalanceOffChain, nodeFreeBalanceOffChain } = await this.getBalance(currency);

    const freeBalanceAmount = this.unitConverter.unitsToAmount({
      currency,
      units: Number(freeBalanceOffChain),
    });
    const nodeFreeBalanceAmount = this.unitConverter.unitsToAmount({
      currency,
      units: Number(nodeFreeBalanceOffChain),
    });

    this.outboundAmounts.set(currency, freeBalanceAmount);
    if (nodeFreeBalanceAmount !== this.inboundAmounts.get(currency)) {
      this.inboundAmounts.set(currency, nodeFreeBalanceAmount);
      this.logger.debug(`new inbound capacity (collateral) for ${currency} of ${nodeFreeBalanceAmount}`);
    }

    return {
      balance: freeBalanceAmount,
      inactiveBalance: 0,
      pendingOpenBalance: 0,
    };
  }

  public swapCapacities = async (currency: string): Promise<SwapCapacities> => {
    await this.channelBalance(currency); // refreshes the balances
    const outboundAmount = this.outboundAmounts.get(currency) ?? 0;
    const inboundAmount = this.inboundAmounts.get(currency) ?? 0;
    return {
      maxOutboundChannelCapacity: outboundAmount,
      maxInboundChannelCapacity: inboundAmount,
      totalOutboundCapacity: outboundAmount,
      totalInboundCapacity: inboundAmount,
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
    /*
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
    */
    let getBalancePromise = this.getBalancePromises.get(currency);
    if (!getBalancePromise) {
      // if not make a new balance request and store the promise that's waiting for a response
      const tokenAddress = this.getTokenAddress(currency);
      getBalancePromise = this.sendRequest(`/channel/${this.channel}/${this.publicIdentifier}`, 'GET').then(async (res) => {
        const channelDetails = await parseResponseBody<any>(res);
        const assetIdIndex = channelDetails.assetIds.indexOf(tokenAddress);
        if (assetIdIndex === -1) {
          const response = {
            freeBalanceOffChain: 0,
            nodeFreeBalanceOffChain: 0,
            freeBalanceOnChain: 0,
          } as unknown as ConnextBalanceResponse;
          return response;
        } else {
          const inboundBalance = channelDetails.balances[assetIdIndex].amount[0];
          const balance = channelDetails.balances[assetIdIndex].amount[1];
          const response = {
            freeBalanceOffChain: balance,
            nodeFreeBalanceOffChain: inboundBalance,
            freeBalanceOnChain: 0,
          } as unknown as ConnextBalanceResponse;
          return response;
        }
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
      amount: units.toLocaleString('fullwide', { useGrouping: false }), // toLocaleString avoids scientific notation
    });
    const { txhash } = await parseResponseBody<ConnextDepositResponse>(depositResponse);

    const minCollateralRequestQuantity = ConnextClient.MIN_COLLATERAL_REQUEST_SIZES[currency];
    if (minCollateralRequestQuantity !== undefined) {
      const minCollateralRequestUnits = this.unitConverter.amountToUnits({ currency, amount: minCollateralRequestQuantity });
      const depositConfirmed$ = fromEvent(this, 'depositConfirmed').pipe(
        filter(hash => hash === txhash), // only proceed if the incoming hash matches our expected txhash
        take(1), // complete the stream after 1 matching event
        timeout(86400000), // clear up the listener after 1 day
      );
      depositConfirmed$.subscribe({
        complete: () => {
          this.requestCollateralInBackground(currency, minCollateralRequestUnits);
        },
      });
    }

    return txhash;
  }

  public closeChannel = async ({ units, currency, destination }: CloseChannelParams): Promise<string[]> => {
    if (!currency) {
      throw errors.CURRENCY_MISSING;
    }
    const amount = units || (await this.getBalance(currency)).freeBalanceOffChain;

    const withdrawResponse = await this.sendRequest('/withdraw', 'POST', {
      recipient: destination,
      amount: amount.toLocaleString('fullwide', { useGrouping: false }),
      assetId: this.tokenAddresses.get(currency),
    });

    const { txhash } = await parseResponseBody<ConnextWithdrawResponse>(withdrawResponse);

    return [txhash];
  }

  /**
   * Create a HashLock Transfer on the Connext network.
   * @param targetAddress recipient of the payment
   * @param tokenAddress contract address of the token
   * @param amount
   * @param lockHash
   */
  private executeHashLockTransfer = async (payload: TokenPaymentRequest): Promise<ConnextTransferResponse> => {
    const lockHash = payload.details.lockHash;
    this.logger.debug(`sending payment of ${payload.amount} with hash ${lockHash} to ${payload.recipient}`);
    this.outgoingTransferHashes.add(lockHash);
    const res = await this.sendRequest('/hashlock-transfer', 'POST', payload);
    const transferResponse = await parseResponseBody<ConnextTransferResponse>(res);
    return transferResponse;
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
      amount: amount.toLocaleString('fullwide', { useGrouping: false }),
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
        let body;
        switch (res.statusCode) {
          case 200:
          case 201:
          case 204:
            resolve(res);
            break;
          case 400:
            body = await parseResponseBody<ConnextErrorResponse>(res);
            this.logger.error(`400 status error: ${JSON.stringify(body)}`);
            reject(body);
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
            body = await parseResponseBody<ConnextErrorResponse>(res);
            this.logger.error(`409 status error: ${JSON.stringify(body)}`);
            reject(body);
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
