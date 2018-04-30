import http from 'http';
import assert from 'assert';

import Logger from '../Logger';
import errors from './errors';

class RaidenClient {
  static statuses = {
    DISABLED: 'DISABLED',
    CONNECTION_VERIFIED: 'CONNECTION_VERIFIED', // assuming connection does not remain open
  };

  logger: any;
  port: any;
  status: any;

  constructor(options) {
    const { disable, port } = options;
    assert(typeof disable === 'boolean', 'disable must be a boolean');
    assert(typeof port === 'number', 'port must be a number');

    this.logger = Logger.global;
    this.port = port;
    if (disable) {
      this.setStatus(RaidenClient.statuses.DISABLED);
    }
  }

  setStatus(val) {
    this.logger.info(`raidenClient status: ${val}`);
    this.status = val;
  }

  isDisabled() {
    return this.status === RaidenClient.statuses.DISABLED;
  }

  sendRequest(endpoint, method, payload) {
    if (this.isDisabled()) {
      throw errors.RAIDEN_IS_DISABLED;
    }
    const options : any = {
      method,
      hostname: '127.0.0.1',
      port: this.port,
      path: `/api/1/${endpoint}`,
    };

    let payloadStr;
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
   * @param {string} target_address - The address of the intended swap counterparty
   * @param {Object} payload
   * @param {string} payload.role - Either "maker" for initiating a swap or "taker" for filling one
   * @param {number} payload.sending_amount - The amount being sent
   * @param {string} payload.sending_token - The identifier for the token being sent
   * @param {number} payload.receiving_amount - The amount being received
   * @param {string} payload.receiving_token - The identifier for the token being received
   * @param {number} identifier -An identification number for this swap
   */
  async tokenSwap(target_address, payload, identifier) {
    assert(typeof target_address === 'string', 'target_address must be a string');
    assert(typeof identifier === 'number', 'identifier must be a string');
    assert(typeof payload === 'object', 'object must be an object');
    assert(typeof payload.role === 'string', 'role must be an object');
    assert(typeof payload.sending_amount === 'number', 'sending_amount must be a number');
    assert(typeof payload.sending_token === 'string', 'sending_token must be a string');
    assert(typeof payload.receiving_amount === 'number', 'receiving_amount must be a number');
    assert(typeof payload.receiving_token === 'string', 'receiving_token must be a string');

    let endpoint = `token_swaps/${target_address}`;
    if (identifier) {
      endpoint += `/${identifier}`;
    }

    const res : any = await this.sendRequest(endpoint, 'PUT', payload);
    if (res.statusCode === 201) {
      return 'swap created';
    } else {
      throw new Error(`${res.statusCode}: ${res.statusMessage}`);
    }
  }

  async getChannelInfo(channel_address) {
    assert(typeof channel_address === 'string', 'channel_address must be a string');

    const endpoint = `channels/${channel_address}`;
    const res : any = await this.sendRequest(endpoint, 'GET', null);

    res.setEncoding('utf8');

    return new Promise((resolve, reject) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(JSON.stringify(body));
      });
      res.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export default RaidenClient;
