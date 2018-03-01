const net = require('net');
const logger = require('winston');

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
