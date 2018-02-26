const net = require('net');
const logger = require('winston');

const PORT = 8885; // temporary hardcoded default port (X = 88, U = 85 in ASCII)

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

  async init() {
    return new Promise((resolve, reject) => {
      this.server.listen(PORT, () => {
        logger.info(`p2p server listening on port ${PORT}`);
        resolve(true);
      }).once('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = P2PServer;
