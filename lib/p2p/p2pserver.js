const net = require('net');
const logger = require('winston');
const assert = require('assert');

class P2PServer {
  constructor() {
    this.server = net.createServer((peer) => {
      logger.debug(`peer ${peer.remoteAddress} connected`);

      peer.on('end', () => {
        logger.debug(`peer ${peer.remoteAddress} disconnected`);
      });

      peer.on('data', (data) => {
        logger.debug(`received data from ${peer.remoteAddress}: ${data.toString()}`);
      });

      peer.on('error', (err) => {
        logger.debug(`error with connection to peer ${peer.remoteAddress}: ${err}`);
      });

      peer.write('hello\r\n');
      peer.pipe(peer);
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
