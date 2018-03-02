const http = require('http');
const assert = require('assert');

class XUClient {
  constructor(port) {
    if (port) {
      assert(typeof port === 'number', 'port must be a number');
      assert(port > 1023 && port < 65536, 'port must be between 1024 and 65535');
    }
    this.port = port || 8885;

    this.id = 1;
  }

  callRpc(method, params) {
    return new Promise((resolve, reject) => {
      const { id } = this;
      const postData = JSON.stringify({
        jsonrpc: '2.0',
        params,
        method,
        id,
      });
      const req = http.request({
        port: this.port,
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
          if (response.result) {
            resolve(response.result);
          } else {
            reject(response.error);
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(postData);
      req.end();
      this.id += 1;
    });
  }

  async getInfo() {
    return this.callRpc('getInfo');
  }

  async getOrders() {
    return this.callRpc('getOrders');
  }

  async placeOrder(order) {
    return this.callRpc('placeOrder', {
      order,
    });
  }
}

module.exports = XUClient;
