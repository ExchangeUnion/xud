import http from 'http';
import Logger from '../Logger';
import BaseClient, { ClientStatus, ChannelBalance } from '../BaseClient';
import errors from './errors';
import { SwapDeal } from '../swaps/types';
import { SwapClient, SwapState, SwapRole } from '../constants/enums';
import assert from 'assert';
import OrderBookRepository from '../orderbook/OrderBookRepository';
import { Models } from '../db/DB';

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
 * The configurable options for the raiden client.
 */
type RaidenClientConfig = {
  disable: boolean;
  host: string;
  port: number;
};

/** General information about the state of this raiden client. */
type RaidenInfo = {
  error?: string;
  address?: string;
  channels?: number;
  version?: string;
};

/**
 * The payload for the [[openChannel]] call.
 */
type OpenChannelPayload = {
  partner_address: string;
  token_address: string;
  balance: number;
  settle_timeout: 100;
};

/**
 * A raiden payment channel.
 */
type Channel = OpenChannelPayload & {
  channel_address: string;
  state: string;
};

/**
 * A raiden channel event.
 */
type ChannelEvent = {
  event_type: string;
  identifier?: number;
  amount?: number;
};

type TokenPaymentResponse = {
  secret: string;
};

/**
 * A class representing a client to interact with raiden.
 */
class RaidenClient extends BaseClient {
  public readonly type = SwapClient.Raiden;
  public readonly cltvDelta: number = 1;
  public address = '';
  public tokenAddresses = new Map<string, string>();
  private port: number;
  private host: string;
  private disable: boolean;
  private repository: OrderBookRepository;

  /**
   * Creates a raiden client.
   */
  constructor(config: RaidenClientConfig, logger: Logger, models: Models) {
    super(logger);
    const { disable, host, port } = config;

    this.port = port;
    this.host = host;
    this.disable = disable;

    this.repository = new OrderBookRepository(logger, models);
  }

  /**
   * Checks for connectivity and gets our Raiden account address
   */
  public init = async () => {
    if (this.disable) {
      await this.setStatus(ClientStatus.Disabled);
      return;
    }
    // associate the client with all currencies that have a contract address
    await this.setCurrencies();
    await this.verifyConnection();
  }

  private setCurrencies = async () => {
    try {
      const currencies = await this.repository.getCurrencies();
      const raidenCurrencies = currencies.filter((currency) => {
        const tokenAddress = currency.getDataValue('tokenAddress');
        if (tokenAddress) {
          this.tokenAddresses.set(currency.getDataValue('id'), tokenAddress);
        }
      });
    } catch (e) {
      this.logger.error('failed to set tokenAddresses for Raiden', e);
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
      }

      this.emit('connectionVerified', newAddress);
      await this.setStatus(ClientStatus.ConnectionVerified);
    } catch (err) {
      this.logger.error(
        `could not verify connection to raiden at ${this.host}:${this.port}, retrying in ${RaidenClient.RECONNECT_TIMER} ms`,
      );
      await this.setStatus(ClientStatus.Disconnected);
    }
  }

  public sendSmallestAmount = async (rHash: string, destination: string, currency: string) => {
    const tokenAddress = this.tokenAddresses.get(currency);
    if (!tokenAddress) {
      throw(errors.TOKEN_ADDRESS_NOT_FOUND);
    }

    const tokenPaymentResponse = await this.tokenPayment(tokenAddress, destination, 1, rHash);
    return tokenPaymentResponse.secret;
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
    // TODO: Secret hash. Depending on sha256 <-> keccak256 problem:
    // https://github.com/ExchangeUnion/xud/issues/870
    const tokenPaymentResponse = await this.tokenPayment(tokenAddress, deal.destination!, amount);
    return tokenPaymentResponse.secret;

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

      const req = http.request(options, (res) => {
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
            reject(errors.INVALID);
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
   * Queries for events tied to a specific channel.
   */
  private getChannelEvents = async (channel_address: string) => {
    // TODO: specify a "from_block"  query argument to only get events since a specific block.
    const endpoint = `events/channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<ChannelEvent[]>(res);
  }

  /**
   * Gets info about a given raiden payment channel.
   * @param channel_address the address of the channel to query
   */
  public getChannel = async (channel_address: string): Promise<Channel> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<Channel>(res);
  }

  /**
   * Gets info about all non-settled channels.
   */
  public getChannels = async (): Promise<[Channel]> => {
    const endpoint = 'channels';
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
    const res = await this.sendRequest(endpoint, 'PATCH', { state: 'settled' });
  }

  /**
   * Sends a token payment through the Raiden network.
   * @param target_address recipient of the payment
   * @param token_address contract address of the token
   * @param amount
   * @param secret_hash optional; provide your own secret hash
   */
  private tokenPayment = async (
    token_address: string,
    target_address: string,
    amount: number,
    secret_hash?: string,
  ): Promise<TokenPaymentResponse> => {
    const endpoint = `payments/${token_address}/${target_address}`;
    let payload = {
      amount,
      // Raiden payment will timeout without an error if the identifier
      // is not specified.
      identifier: Math.round(Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1),
    };
    if (secret_hash) {
      payload = Object.assign(payload, { secret_hash });
    }
    try {
      const res = await this.sendRequest(endpoint, 'POST', payload);
      const body = await parseResponseBody<TokenPaymentResponse>(res);
      return body;
    } catch (e) {
      this.logger.error(`got exception from RaidenClient.tokenPayment:`, e);
      throw e;
    }
  }

  /**
   * Deposits more of a token to an existing channel.
   * @param channel_address the address of the channel to deposit to
   * @param balance the amount to deposit to the channel
   */
  public depositToChannel = async (channel_address: string, balance: number): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'PATCH', { balance });
  }

  /**
   * Gets the account address for the raiden node.
   */
  private getAddress = async (): Promise<string> => {
    const endpoint = `address`;
    const res = await this.sendRequest(endpoint, 'GET');

    const body = await parseResponseBody<{ our_address: string }>(res);
    return body.our_address;
  }

  /** Raiden client specific cleanup. */
  protected closeSpecific() {}
}

export default RaidenClient;
export { RaidenClientConfig, RaidenInfo, OpenChannelPayload };
