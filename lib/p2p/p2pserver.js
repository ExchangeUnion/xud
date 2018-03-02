const net = require('net');
const logger = require('winston');
const assert = require('assert');

class P2PServer {
  constructor() {
    this.server = net.createServer((client) => {
      logger.debug('client connected');
      client.on('end', () => {
        logger.debug('client disconnected');
      });
      client.write('hello\r\n');
      client.pipe(client);
    });
    this.server.on('error', (err) => {
      throw err;
    });
  }

  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        logger.info(`P2P server listening on port ${port}`);
        resolve(true);
      }).once('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = P2PServer;
