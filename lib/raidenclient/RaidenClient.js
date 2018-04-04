/* eslint-disable camelcase */

const http = require('http');
const assert = require('assert');

class RaidenClient {
  constructor(options) {
    this.port = options.port;
  }

  sendRequest(endpoint, method, payload) {
    const options = {
      hostname: '127.0.0.1',
      port: this.port,
      path: `/api/1/${endpoint}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        resolve(res);
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  }

  async tokenSwap(target_address, payload, identifier) {
    assert(typeof target_address === 'string', 'target_address must be a string');

    let endpoint = `token_swaps/${target_address}`;
    if (identifier) {
      endpoint += `/${identifier}`;
    }

    const res = await this.sendRequest(endpoint, 'PUT', payload);
    if (res.statusCode === 201) {
      return 'swap created';
    } else {
      throw res.statusMessage;
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
