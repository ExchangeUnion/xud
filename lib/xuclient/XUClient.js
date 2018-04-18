/* eslint-disable camelcase */

const http = require('http');
const assert = require('assert');

class XUClient {
  constructor(port) {
    if (port) {
      assert(typeof port === 'number', 'port must be a number');
      assert(port > 1023 && port < 65536, 'port must be between 1024 and 65535');
    }
    this.port = port || 8886;

    this.id = 1;
  }

  callRpc(method, params) {
    const { port, id } = this;
    this.id += 1;
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        jsonrpc: '2.0',
        params,
        method,
        id,
      });
      const req = http.request({
        port,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': postData.length,
        },
        method: 'POST',
      }, (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const response = JSON.parse(body);
          if (response.jsonrpc !== '2.0' || parseInt(response.id, 10) !== id) {
            reject(new Error('unexpected response'));
          }
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.result);
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(postData);
      req.end();
    });
  }

  getInfo() {
    return this.callRpc('getInfo');
  }

  getOrders() {
    return this.callRpc('getOrders');
  }

  placeOrder(order) {
    assert(typeof order.price === 'number', 'price name must be a number');
    assert(typeof order.price > 0, 'price must be greater than 0');
    assert(typeof order.quantity === 'number', 'quantity must be a number');
    assert(typeof order.pairId === 'string', 'pairId name must be a string');
    return this.callRpc('placeOrder', {
      order,
    });
  }

  connect(host, port) {
    return this.callRpc('connect', {
      host,
      port,
    });
  }

  tokenSwap(target_address, payload, identifier) {
    return this.callRpc('tokenSwap', {
      target_address,
      payload,
      identifier,
    });
  }

  shutdown() {
    return this.callRpc('shutdown');
  }
}

module.exports = XUClient;
