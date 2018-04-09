/* eslint-disable camelcase */

const http = require('http');
const assert = require('assert');
const Logger = require('../Logger');

class RaidenClient {
  constructor(options) {
    this.port = options.port;
    this.logger = Logger.global;
  }

  sendRequest(endpoint, method, payload) {
    const options = {
      hostname: '127.0.0.1',
      port: this.port,
      path: `/api/1/${endpoint}`,
      method,
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

    const res = await this.sendRequest(endpoint, 'PUT', payload);
    if (res.statusCode === 201) {
      return 'swap created';
    } else {
      throw new Error(`${res.statusCode}: ${res.statusMessage}`);
    }
  }

  async getChannelInfo(channel_address) {
    assert(typeof channel_address === 'string', 'channel_address must be a string');

    const endpoint = `channels/${channel_address}`;
    const res = await this.sendRequest(endpoint, 'GET');

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

module.exports = RaidenClient;
