'use strict';

const net = require('net');
const Logger = require('../Logger');
const assert = require('assert');

class P2PServer {
  constructor(orderBook) {
    this.orderBook = orderBook;
    this.peers = [];
    this.logger = Logger.global;

    this.server = net.createServer(this.connectionListener);
    this.server.on('error', (err) => {
      this.logger.error(err);
    });
  }

  connectionListener(peer) {
    this.peers.push(peer);

    this.logger.debug(`peer ${peer.remoteAddress} connected`);

    peer.on('end', () => {
      this.logger.debug(`peer ${peer.remoteAddress} disconnected`);
    });

    peer.on('data', (data) => {
      const dataStr = data.toString();
      this.logger.debug(`received data from ${peer.remoteAddress}: ${dataStr}`);
      const type = dataStr.split(' ', 1);
      const obj = JSON.parse(dataStr.substring(type.length + 1));

      switch (type) {
        case 'neworder':
          this.orderBook.addOrder(obj);
          break;
        default:
          this.logger.error(`unknown p2p message type: ${type}`);
      }
    });

    peer.on('error', (err) => {
      this.logger.debug(`error with connection to peer ${peer.remoteAddress}: ${err}`);
    });

    peer.pipe(peer);
  }

  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        this.logger.info(`P2P server listening on port ${port}`);
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
