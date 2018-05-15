import http from 'http';
import assert from 'assert';

import BaseClient, { ClientStatus } from'../BaseClient';
import errors from './errors';

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
  role: string;
  sending_amount: number;
  sending_token: string;
  receiving_amount: number;
  receiving_token: string;
};

/**
 * Information about a raiden payment channel.
 */
type ChannelInfo = {
  channel_address: string;
  partner_address: string;
  token_address: string;
  balance: number;
  state: string;
  settle_timeout: number;
};

/**
 * A class representing a client to interact with raiden.
 */
class RaidenClient extends BaseClient {
  port: number;
  host: string;

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
  sendRequest(endpoint: string, method: string, payload?: object): Promise<http.IncomingMessage> {
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
   * @param payload.role Either "maker" for initiating a swap or "taker" for filling one
   * @param payload.sending_amount The amount being sent
   * @param payload.sending_token The identifier for the token being sent
   * @param payload.receiving_amount The amount being received
   * @param payload.receiving_token The identifier for the token being received
   * @param identifier An identification number for this swap
   */
  async tokenSwap(target_address: string, payload: TokenSwapPayload, identifier: string): Promise<string> {
    let endpoint: string = `token_swaps/${target_address}`;
    if (identifier) {
      endpoint += `/${identifier}`;
    }

    const res: any = await this.sendRequest(endpoint, 'PUT', payload);
    if (res.statusCode === 201) {
      return 'swap created';
    } else {
      throw new Error(`${res.statusCode}: ${res.statusMessage}`);
    }
  }

  /**
   * Get info about a given raiden payment channel.
   */
  async getChannelInfo(channel_address: string): Promise<ChannelInfo> {
    assert(typeof channel_address === 'string', 'channel_address must be a string');

    const endpoint: string = `channels/${channel_address}`;
    const res: any = await this.sendRequest(endpoint, 'GET', undefined);

    res.setEncoding('utf8');
    return new Promise<ChannelInfo>((resolve, reject) => {
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
}

export default RaidenClient;
export { RaidenClientConfig, TokenSwapPayload };
