import http from 'http';
import Logger from '../Logger';
import SwapClient, { ClientStatus, ChannelBalance } from '../swaps/SwapClient';
import errors from './errors';
import { SwapDeal } from '../swaps/types';
import { SwapClientType, SwapState, SwapRole } from '../constants/enums';
import assert from 'assert';
import { RaidenClientConfig, RaidenInfo, OpenChannelPayload, Channel, TokenPaymentRequest, TokenPaymentResponse } from './types';

type RaidenErrorResponse = { errors: string };

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
  public readonly cltvDelta: number = 1;
  public address?: string;
  /** A map of currency symbols to token addresses. */
  public tokenAddresses = new Map<string, string>();
  private port: number;
  private host: string;
  private disable: boolean;

  /**
   * Creates a raiden client.
   */
  constructor(config: RaidenClientConfig, logger: Logger) {
    super(logger);
    const { disable, host, port } = config;

    this.port = port;
    this.host = host;
    this.disable = disable;
  }

  /**
   * Checks for connectivity and gets our Raiden account address
   */
  public init = async () => {
    if (this.disable) {
      await this.setStatus(ClientStatus.Disabled);
      return;
    }
    await this.verifyConnection();
  }

  protected verifyConnection = async () => {
    this.logger.info(`trying to verify connection to raiden with uri: ${this.host}:${this.port}`);
    try {
      const address = await this.getAddress();

      /** The new raiden address value if different from the one we had previously. */
      let newAddress: string | undefined;
      if (this.address !== address) {
        this.logger.debug(`address is ${newAddress}`);
        newAddress = address;
        this.address = newAddress;
      }

      this.emit('connectionVerified', newAddress);
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
    let amount = 0;
    let tokenAddress;
    if (deal.role === SwapRole.Maker) {
      // we are the maker paying the taker
      amount = deal.takerAmount;
      tokenAddress = this.tokenAddresses.get(deal.takerCurrency);
    } else {
      // we are the taker paying the maker
      amount = deal.makerAmount;
      tokenAddress = this.tokenAddresses.get(deal.makerCurrency);
    }
    if (!tokenAddress) {
      throw(errors.TOKEN_ADDRESS_NOT_FOUND);
    }
    const tokenPaymentResponse = await this.tokenPayment({
      amount,
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

  public getRoutes =  async (_amount: number, _destination: string) => {
    // stub placeholder, query routes not currently implemented in raiden
    return [{
      getTotalTimeLock: () => 1,
    }];
  }

  public getHeight = async () => {
    return 1; // raiden's API does not tell us the height
  }

  public getRaidenInfo = async (): Promise<RaidenInfo> => {
    let channels: number | undefined;
    let address: string | undefined;
    let error: string | undefined;
    const version = ''; // Intentionally left blank until Raiden API exposes it

    if (this.isDisabled()) {
      error = errors.RAIDEN_IS_DISABLED.message;
    } else {
      try {
        channels = (await this.getChannels()).length;
        address = this.address;
      } catch (err) {
        error = err.message;
      }
    }

    return {
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

      req.on('error', (err) => {
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
   * Returns the total balance available across all channels.
   */
  public channelBalance = async (): Promise<ChannelBalance> => {
    // TODO: refine logic to determine balance per token rather than all combined
    const channels = await this.getChannels();
    const balance = channels.filter(channel => channel.state === 'opened')
      .map(channel => channel.balance)
      .reduce((acc, sum) => sum + acc, 0);
    return { balance, pendingOpenBalance: 0 };
  }

  /**
   * Creates a payment channel.
   * @returns The channel_address for the newly created channel.
   */
  public openChannel = async (payload: OpenChannelPayload): Promise<string> => {
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
    payload.identifier = Math.round(Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1);
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
