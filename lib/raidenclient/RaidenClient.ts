import http from 'http';
import assert from 'assert';

import BaseClient, { ClientStatus } from'../BaseClient';
import errors from './errors';

/**
 * A utility function to parse the payload from an http response.
 */
async function parseResponseBody(res: http.IncomingMessage): Promise<any> {
  res.setEncoding('utf8');
  return new Promise<object>((resolve, reject) => {
    let body: string = '';
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

/**
 * The payload for the [[tokenSwap]] call.
 */
type TokenSwapPayload = {
  /** Either "maker" for initiating a swap or "taker" for filling one */
  role: string;
  /** The amount being sent */
  sending_amount: number;
  /** The identifier for the token being sent */
  sending_token: string;
  /** The amount being received */
  receiving_amount: number;
  /** The identifier for the token being received */
  receiving_token: string;
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
 * A class representing a client to interact with raiden.
 */
class RaidenClient extends BaseClient {
  private port: number;
  private host: string;

  /**
   * Create a raiden client.
   */
  constructor(config: RaidenClientConfig) {
    super();
    const { disable, host, port } = config;

    this.port = port;
    this.host = host;
    if (disable) {
      this.setStatus(ClientStatus.DISABLED);
    }
  }

  /**
   * Send a request to the Raiden REST API.
   * @param endpoint The URL endpoint
   * @param method An HTTP request method
   * @param payload The request payload
   */
  private sendRequest(endpoint: string, method: string, payload?: object): Promise<http.IncomingMessage> {
    if (this.isDisabled()) {
      throw errors.RAIDEN_IS_DISABLED;
    }
    const options: http.RequestOptions = {
      method,
      hostname: this.host,
      port: this.port,
      path: `/api/1/${endpoint}`,
    };

    let payloadStr: string;
    if (payload) {
      payloadStr = JSON.stringify(payload);
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr),
      };
    }

    return new Promise((resolve, reject) => {
      const req: http.ClientRequest = http.request(options, (res) => {
        resolve(res);
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
   * Initiates or completes a Raiden token swap
   * @param target_address The address of the intended swap counterparty
   * @param payload The token swap payload
   * @param identifier An identification number for this swap
   */
  public async tokenSwap(target_address: string, payload: TokenSwapPayload, identifier: string): Promise<void> {
    let endpoint = `token_swaps/${target_address}`;
    if (identifier) {
      endpoint += `/${identifier}`;
    }

    const res = await this.sendRequest(endpoint, 'PUT', payload);
    assert(res.statusCode === 201, `${res.statusCode}: ${res.statusMessage}`);
  }

  /**
   * Get info about a given raiden payment channel.
   * @param channel_address The address of the channel to query
   */
  public getChannel = async (channel_address: string): Promise<Channel> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');
    assert(res.statusCode === 200, `${res.statusCode}: ${res.statusMessage}`);
    return parseResponseBody(res);
  }

  /**
   * Get info about all non-settled channels.
   */
  public getChannels = async (): Promise<[Channel]> => {
    const endpoint = 'channels';
    const res = await this.sendRequest(endpoint, 'GET');
    assert(res.statusCode === 200, `${res.statusCode}: ${res.statusMessage}`);
    return parseResponseBody(res);
  }

  /**
   * Create a payment channel.
   * @returns The channel_address for the newly created channel.
   */
  public openChannel = async (payload: OpenChannelPayload): Promise<string> => {
    const endpoint = 'channels';
    const res = await this.sendRequest(endpoint, 'PUT', payload);

    assert(res.statusCode === 201, `${res.statusCode}: ${res.statusMessage}`);
    const body = await parseResponseBody(res);
    return body.channel_address;
  }

  /**
   * Close a payment channel.
   * @param channel_address The address of the channel to close
   */
  public closeChannel = async (channel_address: string): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'PATCH', { state: 'settled' });
    assert(res.statusCode === 200, `${res.statusCode}: ${res.statusMessage}`);
  }

  /**
   * Deposit more of a token to an existing channel
   * @param channel_address The address of the channel to deposit to
   * @param balance The amount to deposit to the channel
   */
  public depositToChannel = async(channel_address: string, balance: number): Promise<void> => {
    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'PATCH', { balance });
    assert(res.statusCode === 200, `${res.statusCode}: ${res.statusMessage}`);
  }

  /**
   * Get the account address for the raiden node.
   */
  public getAddress = async (): Promise<string> => {
    const endpoint = `address`;
    const res = await this.sendRequest(endpoint, 'GET');

    assert(res.statusCode === 200, `${res.statusCode}: ${res.statusMessage}`);
    const body = await parseResponseBody(res);
    return body.our_address;
  }
}

export default RaidenClient;
export { RaidenClientConfig, TokenSwapPayload, OpenChannelPayload };
