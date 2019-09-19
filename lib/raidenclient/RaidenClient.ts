import assert from 'assert';
import http from 'http';
import { SwapClientType, SwapClientStatus, SwapRole, SwapState } from '../constants/enums';
import { CurrencyInstance } from '../db/types';
import Logger from '../Logger';
import SwapClient, { ChannelBalance, ClientStatus, PaymentState } from '../swaps/SwapClient';
import { SwapDeal } from '../swaps/types';
import { UnitConverter } from '../utils/UnitConverter';
import errors from './errors';
import {
  Channel,
  OpenChannelPayload,
  PaymentEvent,
  RaidenChannelCount,
  RaidenClientConfig,
  RaidenInfo, RaidenVersion,
  TokenPaymentRequest,
  TokenPaymentResponse,
} from './types';

type RaidenErrorResponse = { errors: string };

type PendingTransfer = {
  initiator: string;
  locked_amount: string;
  payment_identifier: string;
  role: string;
  target: string;
  token_address: string;
  transferred_amount: string;
};

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
 * A class representing a client to interact with raiden.
 */
class RaidenClient extends SwapClient {
  public readonly type = SwapClientType.Raiden;
  public readonly finalLock = 100;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  private port: number;
  private host: string;
  private disable: boolean;
  private unitConverter: UnitConverter;
  private maximumOutboundAmounts = new Map<string, number>();
  private directChannelChecks: boolean;

  /**
   * Creates a raiden client.
   */
  constructor(
    { config, logger, unitConverter, directChannelChecks = false }:
    { config: RaidenClientConfig, logger: Logger, unitConverter: UnitConverter, directChannelChecks: boolean },
  ) {
    super(logger);
    const { disable, host, port } = config;

    this.port = port;
    this.host = host;
    this.disable = disable;
    this.unitConverter = unitConverter;
    this.directChannelChecks = directChannelChecks;
  }

  public get minutesPerBlock() {
    return 0.25; // 15 seconds per block target
  }

  /**
   * Derives an integer identifier using the first 4 bytes of a provided payment hash in hex.
   * @param rHash a payment hash in hex
   */
  private static getIdentifier(rHash: string) {
    return parseInt(rHash.substr(0, 8), 16);
  }

  /**
   * Checks for connectivity and gets our Raiden account address
   */
  public init = async (currencyInstances: CurrencyInstance[]) => {
    if (this.disable) {
      await this.setStatus(ClientStatus.Disabled);
      return;
    }
    this.setTokenAddresses(currencyInstances);
    await this.verifyConnectionWithTimeout();
  }

  /**
   * Associate raiden with currencies that have a token address
   */
  private setTokenAddresses = (currencyInstances: CurrencyInstance[]) => {
    currencyInstances.forEach((currency) => {
      if (currency.tokenAddress) {
        this.tokenAddresses.set(currency.id, currency.tokenAddress);
      }
    });
  }

  public maximumOutboundCapacity = (currency: string): number => {
    return this.maximumOutboundAmounts.get(currency) || 0;
  }

  protected updateCapacity = async () => {
    try {
      const channelBalancePromises = [];
      for (const [currency] of this.tokenAddresses) {
        const channelBalancePromise = this.channelBalance(currency)
          .then((balance) => {
            return { ...balance, currency };
          });
        channelBalancePromises.push(channelBalancePromise);
      }
      const channelBalances = await Promise.all(channelBalancePromises);
      channelBalances.forEach(({ currency, balance }) => {
        this.maximumOutboundAmounts.set(currency, balance);
      });
    } catch (e) {
      this.logger.error(`failed to fetch channelbalances: ${e}`);
    }
  }

  protected verifyConnection = async () => {
    this.logger.info(`trying to verify connection to raiden with uri: ${this.host}:${this.port}`);
    try {
      const address = await this.getAddress();

      /** The new raiden address value if different from the one we had previously. */
      let newAddress: string | undefined;
      if (this.address !== address) {
        newAddress = address;
        this.address = newAddress;
        this.logger.debug(`address is ${newAddress}`);
      }

      this.emit('connectionVerified', { newIdentifier: newAddress });
      await this.setStatus(ClientStatus.ConnectionVerified);
    } catch (err) {
      this.logger.error(
        `could not verify connection to raiden at ${this.host}:${this.port}, retrying in ${RaidenClient.RECONNECT_TIMER} ms`,
        err,
      );
      await this.disconnect();
    }
  }

  public sendSmallestAmount = async (rHash: string, destination: string, currency: string) => {
    const tokenAddress = this.tokenAddresses.get(currency);
    if (!tokenAddress) {
      throw(errors.TOKEN_ADDRESS_NOT_FOUND);
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
      throw(errors.TOKEN_ADDRESS_NOT_FOUND);
    }
    const tokenPaymentResponse = await this.tokenPayment({
      amount,
      lock_timeout,
      token_address: tokenAddress,
      target_address: deal.destination!,
      secret_hash: deal.rHash,
    });
    return this.sanitizeTokenPaymentResponse(tokenPaymentResponse);
  }

  private sanitizeTokenPaymentResponse = (response: TokenPaymentResponse) => {
    if (response.secret) {
      // remove '0x'
      return response.secret.slice(2);
    } else {
      throw errors.INVALID_TOKEN_PAYMENT_RESPONSE;
    }
  }

  public addInvoice = async () => {
    // not implemented, raiden does not use invoices
  }

  public settleInvoice = async () => {
    // not implemented, raiden does not use invoices
  }

  public removeInvoice = async () => {
    // not implemented, raiden does not use invoices
  }

  public lookupPayment = async (rHash: string, currency?: string, destination?: string) => {
    const identifier = RaidenClient.getIdentifier(rHash);

    // first check if the payment is pending
    const pendingTransfers = await this.getPendingTransfers(currency, destination);
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

    // if there is no pending payment or event found, we assume that the payment was never attempted by raiden
    return { state: PaymentState.Failed };
  }

  private getPendingTransfers = async (currency?: string, destination?: string) => {
    let endpoint = 'pending_transfers';
    if (currency) {
      const tokenAddress = this.tokenAddresses.get(currency);
      endpoint += `/${tokenAddress}`;
      if (destination) {
        endpoint += `/${destination}`;
      }
    }
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<PendingTransfer[]>(res);
  }

  private getPaymentEvents = async (currency?: string, destination?: string) => {
    let endpoint = 'payments';
    if (currency) {
      const tokenAddress = this.tokenAddresses.get(currency);
      endpoint += `/${tokenAddress}`;
      if (destination) {
        endpoint += `/${destination}`;
      }
    }
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<PaymentEvent[]>(res);
  }

  public getRoute = async (units: number, destination: string, currency: string) => {
    // a query routes call is not currently provided by raiden

    /** A placeholder route value that assumes a fixed lock time of 100 Raiden's blocks. */
    const placeholderRoute = {
      getTotalTimeLock: () => 101,
    };

    if (this.directChannelChecks) {
      // temporary check for a direct channel in raiden
      const tokenAddress = this.tokenAddresses.get(currency);
      const channels = await this.getChannels(tokenAddress);
      for (const channel of channels) {
        if (channel.partner_address && channel.partner_address === destination) {
          const balance = channel.balance;
          if (balance >= units) {
            this.logger.debug(`found a direct channel for ${currency} to ${destination} with ${balance} balance`);
            return placeholderRoute;
          } else {
            this.logger.warn(`direct channel found for ${currency} to ${destination} with balance of ${balance} is insufficient for ${units})`);
            return undefined; // we have a direct channel but it doesn't have enough balance, return no route
          }
        }
      }
      this.logger.warn(`no direct channel found for ${currency} to ${destination}`);
      return undefined; // no direct channels, return no route
    } else {
      return placeholderRoute;
    }
  }

  public getHeight = async () => {
    return 1; // raiden's API does not tell us the height
  }

  public getRaidenInfo = async (): Promise<RaidenInfo> => {
    let channels: RaidenChannelCount | undefined;
    let address: string | undefined;
    let error: string | undefined;
    let status: SwapClientStatus = SwapClientStatus.Error;
    let version: string | undefined;
    const chain = Object.keys(this.tokenAddresses).find(key => this.tokenAddresses.get(key) === this.address);

    if (this.isDisabled()) {
      error = errors.RAIDEN_IS_DISABLED.message;
    } else {
      try {
        version = (await this.getVersion()).version;
        const raidenChannels = await this.getChannels();
        channels = {
          active: raidenChannels.filter(c => c.state === 'opened').length,
          settled: raidenChannels.filter(c => c.state === 'settled').length,
          closed: raidenChannels.filter(c => c.state === 'closed').length,
        };
        address = this.address;
        if (channels.active > 0) {
          status = SwapClientStatus.Ready;
        } else {
          error = errors.RAIDEN_IS_UNAVAILABLE(ClientStatus.NoChannels).message;
        }
      } catch (err) {
        error = err.message;
      }
    }

    return {
      chain,
      status,
      channels,
      address,
      error,
      version,
    };
  }

  /**
   * Sends a request to the Raiden REST API.
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
            const body = await parseResponseBody<RaidenErrorResponse>(res);
            reject(errors.INVALID(body.errors));
            break;
          case 500:
            this.logger.error(`raiden server error ${res.statusCode}: ${res.statusMessage}`);
            reject(errors.SERVER_ERROR);
            break;
          default:
            this.logger.error(`unexpected raiden status ${res.statusCode}: ${res.statusMessage}`);
            reject(errors.UNEXPECTED);
            break;
        }
      });

      req.on('error', (err: any) => {
        if (err.code === 'ECONNREFUSED') {
          this.disconnect().catch(this.logger.error);
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

  /**
   * Gets the raiden version.
   */
  public getVersion = async (): Promise<RaidenVersion> => {
    const endpoint = 'version';
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<RaidenVersion>(res);
  }

  /**
   * Gets info about a given raiden payment channel.
   * @param token_address the token address for the network to which the channel belongs
   * @param channel_address the address of the channel to query
   */
  public getChannel = async (token_address: string, channel_address: string): Promise<Channel> => {
    const endpoint = `channels/${token_address}/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<Channel>(res);
  }

  /**
   * Gets info about all non-settled channels.
   * @param token_address an optional parameter to specify channels belonging to the specified token network
   */
  public getChannels = async (token_address?: string): Promise<Channel[]> => {
    const endpoint = token_address ? `channels/${token_address}` : 'channels';
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<[Channel]>(res);
  }

  /**
   * Returns the total balance available across all channels for a specified currency.
   */
  public channelBalance = async (currency?: string): Promise<ChannelBalance> => {
    if (!currency) {
      return { balance: 0, pendingOpenBalance: 0 };
    }

    const channels = await this.getChannels(this.tokenAddresses.get(currency));
    const units = channels.filter(channel => channel.state === 'opened')
      .map(channel => channel.balance)
      .reduce((sum, acc) => sum + acc, 0);
    const balance = this.unitConverter.unitsToAmount({
      currency,
      units,
    });
    return { balance, pendingOpenBalance: 0 };
  }

  /**
   * Creates a payment channel.
   */
  public openChannel = async (
    { peerIdentifier: peerAddress, units, currency }:
    { peerIdentifier: string, units: number, currency: string },
  ): Promise<void> => {
    const tokenAddress = this.tokenAddresses.get(currency);
    if (!tokenAddress) {
      throw(errors.TOKEN_ADDRESS_NOT_FOUND);
    }
    await this.openChannelRequest({
      partner_address: peerAddress,
      token_address: tokenAddress,
      total_deposit: units,
      // TODO: The amount of blocks that the settle timeout should have
      settle_timeout: 500,
    });
  }

  /**
   * Creates a payment channel request.
   * @returns The channel_address for the newly created channel.
   */
  private openChannelRequest = async (payload: OpenChannelPayload): Promise<string> => {
    const endpoint = 'channels';
    const res = await this.sendRequest(endpoint, 'PUT', payload);

    const body = await parseResponseBody<{ channel_address: string }>(res);
    return body.channel_address;
  }

  /**
   * Closes a payment channel.
   * @param channel_address the address of the channel to close
   */
  public closeChannel = async (channel_address: string): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    await this.sendRequest(endpoint, 'PATCH', { state: 'settled' });
  }

  /**
   * Sends a token payment through the Raiden network.
   * @param target_address recipient of the payment
   * @param token_address contract address of the token
   * @param amount
   * @param secret_hash optional; provide your own secret hash
   */
  private tokenPayment = async (payload: TokenPaymentRequest): Promise<TokenPaymentResponse> => {
    const endpoint = `payments/${payload.token_address}/${payload.target_address}`;
    if (payload.secret_hash) {
      payload.secret_hash = `0x${payload.secret_hash}`;
    }

    const res = await this.sendRequest(endpoint, 'POST', payload);
    const body = await parseResponseBody<TokenPaymentResponse>(res);
    return body;
  }

  /**
   * Deposits more of a token to an existing channel.
   * @param channel_address the address of the channel to deposit to
   * @param balance the amount to deposit to the channel
   */
  public depositToChannel = async (channel_address: string, balance: number): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    await this.sendRequest(endpoint, 'PATCH', { balance });
  }

  /**
   * Gets the account address for the raiden node.
   */
  private getAddress = async (): Promise<string> => {
    const endpoint = 'address';
    const res = await this.sendRequest(endpoint, 'GET');

    const body = await parseResponseBody<{ our_address: string }>(res);
    return body.our_address;
  }

  /** Raiden client specific cleanup. */
  protected disconnect = async () => {
    await this.setStatus(ClientStatus.Disconnected);
  }
}

export default RaidenClient;
