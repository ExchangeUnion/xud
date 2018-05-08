import http from 'http';
import assert from 'assert';

import BaseClient, { ClientStatus } from'../BaseClient';
import errors from './errors';

type RaidenClientConfig = {
  disable: boolean;
  port: number;
};

type TokenSwapPayload = {
  role: string;
  sending_amount: number;
  sending_token: string;
  receiving_amount: number;
  receiving_token: string;
};

class RaidenClient extends BaseClient {
  port: number;

  constructor(config: RaidenClientConfig) {
    super();
    const { disable, port } = config;

    this.port = port;
    if (disable) {
      this.setStatus(ClientStatus.DISABLED);
    }
  }

  sendRequest(endpoint: string, method: string, payload: object | undefined): Promise<any> {
    if (this.isDisabled()) {
      throw errors.RAIDEN_IS_DISABLED;
    }
    const options: any = {
      method,
      hostname: '127.0.0.1',
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
      const req = http.request(options, (res) => {
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
   * @param target_address - The address of the intended swap counterparty
   * @param payload.role - Either "maker" for initiating a swap or "taker" for filling one
   * @param payload.sending_amount - The amount being sent
   * @param payload.sending_token - The identifier for the token being sent
   * @param payload.receiving_amount - The amount being received
   * @param payload.receiving_token - The identifier for the token being received
   * @param identifier -An identification number for this swap
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

  async getChannelInfo(channel_address: string): Promise<any> {
    assert(typeof channel_address === 'string', 'channel_address must be a string');

    const endpoint: string = `channels/${channel_address}`;
    const res: any = await this.sendRequest(endpoint, 'GET', undefined);

    res.setEncoding('utf8');

    return new Promise((resolve, reject) => {
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
