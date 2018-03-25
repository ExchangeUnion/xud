const net = require('net');
const Logger = require('../Logger');
const assert = require('assert');

class P2PServer {
  constructor(p2p) {
    this.logger = Logger.global;
    this.p2p = p2p;
    this.server = net.createServer((peer) => {
      p2p.addPeer(peer);
      this.logger.debug(`peer ${peer.remoteAddress}:${peer.remotePort} connected`);
    });
    this.server.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    return new Promise((resolve, reject) => {
      this.server.listen(port, '0.0.0.0', () => {
        this.logger.info(`P2P server listening on port ${port}`);
        resolve(true);
      }).once('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = P2PServer;
