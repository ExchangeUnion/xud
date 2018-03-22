const net = require('net');
const logger = require('winston');
const assert = require('assert');
const OrderBook = require('../orderbook/orderbook');

class P2P {
  constructor(orderBook) {
    assert(orderBook instanceof OrderBook, 'orderBook must be an instance of OrderBook');
    this.orderBook = orderBook;
    this.port = port;
    this.peers = {};

    this.server = net.createServer(this.connectionListener);
    this.server.on('error', (err) => {
      logger.error(err);
    });
  }

  async broadcast(type, object) {
    const peerKeys = Object.keys(this.peers);
    for (let n = 0; n < peerKeys.length; n += 1) {
      this.peers[peerKeys[n]].write(`${type} ${JSON.stringify(object)}\r\n`);
    }
  }

  async connect(host, port) {
    return new Promise((resolve, reject) => {
      const peer = net.connect({
        host,
        port,
      }, () => {
        this.addPeer(peer);
        logger.debug(`connected to peer ${peer.remoteAddress}:${peer.remotePort}`);
        resolve();
      });
      peer.once('error', (err) => {
        reject(err);
      });
    });
  }

  addPeer(peer) {
    assert(!this.peers[peer.remoteAddress], `peer ${peer.remoteAddress} is already connected`);

    this.peers[peer.remoteAddress] = peer;

    peer.on('end', () => {
      this.peers[peer.remoteAddress] = null;
      logger.debug(`peer ${peer.remoteAddress} disconnected`);
    });

    peer.on('data', (data) => {
      const dataStr = data.toString();
      logger.debug(`received data from ${peer.remoteAddress}: ${dataStr}`);
      const type = dataStr.split(' ', 1)[0];
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
      this.peers[peer.remoteAddress] = null;
      logger.debug(`error with connection to peer ${peer.remoteAddress}: ${err}`);
    });
  }
}

module.exports = P2P;
