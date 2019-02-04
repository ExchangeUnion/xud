import http from 'http';
import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';
import { ms } from '../utils/utils';
import { Order } from '../orderbook/types';

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
 * The payload for the [[tokenSwap]] call.
 */
type TokenSwapPayload = {
  /** Either "maker" for initiating a swap or "taker" for filling one */
  role: string;
  /** The amount being sent */
  sendingAmount: number;
  /** The address for the token being sent */
  sendingToken: string;
  /** The amount being received */
  receivingAmount: number;
  /** The address for the token being received */
  receivingToken: string;
   // TODO: Either move this type definition out of RaidenClient or remove nodepubkey as it's not part of the actual raiden tokenswap payload
  /** The xud pubkey of the swap peer */
  nodePubKey: string;
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

interface RaidenClient {
  on(event: 'swap', listener: (order: Order) => void): this;
  emit(event: 'swap', order: Order): boolean;
}

/**
 * A class representing a client to interact with raiden.
 */
class RaidenClient extends BaseClient {
  public address?: string;
  private port: number;
  private host: string;
  /** Map of token swap identifiers to order ids */
  private swapIdOrderMap = new Map<number, Order>();

  /**
   * Create a raiden client.
   */
  constructor(config: RaidenClientConfig, logger: Logger) {
    super(logger);
    const { disable, host, port } = config;

    this.port = port;
    this.host = host;

    if (disable) {
      this.setStatus(ClientStatus.Disabled);
    }
  }

  /**
   * Check for connectivity and get our Raiden account address
   */
  public init = async () => {
    if (this.isDisabled()) {
      this.logger.error(`can't init raiden. raiden is disabled`);
      return;
    }
    try {
      this.address = await this.getAddress();
      this.setStatus(ClientStatus.ConnectionVerified);
    } catch (err) {
      this.logger.error('could not get raiden address', err);
    }
  }

  public getRaidenInfo = async (): Promise<RaidenInfo> => {
    let channels: number | undefined;
    let address: string | undefined;
    let error: string | undefined;
    const version = 'v0.3.0'; // Hardcoded for now until they expose it to their API;

    if (this.isDisabled()) {
      error = errors.RAIDEN_IS_DISABLED.message;
    } else {
      try {
        channels = (await this.getChannels()).length;
        address = this.address!;
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
   * Send a request to the Raiden REST API.
   * @param endpoint the URL endpoint
   * @param method an HTTP request method
   * @param payload the request payload
   */
  private sendRequest = (endpoint: string, method: string, payload?: object): Promise<http.IncomingMessage> => {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(errors.RAIDEN_IS_DISABLED);
      }

      const options: http.RequestOptions = {
        method,
        hostname: this.host,
        port: this.port,
        path: `/api/1/${endpoint}`,
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
   * Query for events tied to a specific channel.
   */
  private getChannelEvents = async (channel_address: string) => {
    // TODO: specify a "from_block"  query argument to only get events since a specific block.
    const endpoint = `events/channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<ChannelEvent[]>(res);
  }

  /**
   * Check for swap execution on a specified channel and emit swap events.
   */
  public checkForSwapExecution = async (channel_address: string) => {
    const channelEvents = await this.getChannelEvents(channel_address);
    channelEvents.forEach((channelEvent) => {
      if (channelEvent.event_type === 'EventTransferSentSuccess' || channelEvent.event_type === 'EventTransferReceivedSuccess') {
        // successful swap
        const order = this.swapIdOrderMap.get(channelEvent.identifier!);
        if (order) {
          // this matches a known order
          // TODO detect and specify amount swapped for partial executions, currently assume full execution
          this.emit('swap', { ...order, quantity: 0 });
        }
      }
    });
  }

  /**
   * Initiates or attempts to complete a Raiden token swap
   * @param target_address the address of the intended swap counterparty
   * @param payload the token swap payload
   */
  public tokenSwap = async (target_address: string, payload: TokenSwapPayload, order?: Order): Promise<void> => {
    const identifier = ms();
    const endpoint = `token_swaps/${target_address}/${identifier}`;

    if (order) {
      this.swapIdOrderMap.set(identifier, order);
    }

    await this.sendRequest(endpoint, 'PUT', payload);
  }

  /**
   * Get info about a given raiden payment channel.
   * @param channel_address the address of the channel to query
   */
  public getChannel = async (channel_address: string): Promise<Channel> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<Channel>(res);
  }

  /**
   * Get info about all non-settled channels.
   */
  public getChannels = async (): Promise<[Channel]> => {
    const endpoint = 'channels';
    const res = await this.sendRequest(endpoint, 'GET');
    return parseResponseBody<[Channel]>(res);
  }

  /**
   * Create a payment channel.
   * @returns The channel_address for the newly created channel.
   */
  public openChannel = async (payload: OpenChannelPayload): Promise<string> => {
    const endpoint = 'channels';
    const res = await this.sendRequest(endpoint, 'PUT', payload);

    const body = await parseResponseBody<{ channel_address: string }>(res);
    return body.channel_address;
  }

  /**
   * Close a payment channel.
   * @param channel_address the address of the channel to close
   */
  public closeChannel = async (channel_address: string): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'PATCH', { state: 'settled' });
  }

  /**
   * Deposit more of a token to an existing channel.
   * @param channel_address the address of the channel to deposit to
   * @param balance the amount to deposit to the channel
   */
  public depositToChannel = async (channel_address: string, balance: number): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'PATCH', { balance });
  }

  /**
   * Get the account address for the raiden node.
   */
  private getAddress = async (): Promise<string> => {
    const endpoint = `address`;
    const res = await this.sendRequest(endpoint, 'GET');

    const body = await parseResponseBody<{ our_address: string }>(res);
    return body.our_address;
  }
}

export default RaidenClient;
export { RaidenClientConfig, RaidenInfo, TokenSwapPayload, OpenChannelPayload };
