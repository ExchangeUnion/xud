const net = require('net');
const logger = require('winston');
const assert = require('assert');

class P2PServer {
  constructor(orderBook) {
    this.orderBook = orderBook;
    this.peers = [];

    this.server = net.createServer(this.connectionListener);
    this.server.on('error', (err) => {
      logger.error(err);
    });
  }

  connectionListener(peer) {
    this.peers.push(peer);

    logger.debug(`peer ${peer.remoteAddress} connected`);

    peer.on('end', () => {
      logger.debug(`peer ${peer.remoteAddress} disconnected`);
    });

    peer.on('data', (data) => {
      const dataStr = data.toString();
      logger.debug(`received data from ${peer.remoteAddress}: ${dataStr}`);
      const type = dataStr.split(' ', 1);
      const obj = JSON.parse(dataStr.substring(type.length + 1));

      switch (type) {
        case 'neworder':
          this.orderBook.addOrder(obj);
          break;
        default:
          logger.error(`unknown p2p message type: ${type}`);
      }
    });

    peer.on('error', (err) => {
      logger.debug(`error with connection to peer ${peer.remoteAddress}: ${err}`);
    });

    peer.pipe(peer);
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

  async broadcast(type, object) {
    for (let n = 0; n < this.peers.length; n += 1) {
      this.peers[n].write(`${type} ${JSON.stringify(object)}`);
    }
  }
}

module.exports = P2PServer;
