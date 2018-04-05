const net = require('net');
const Logger = require('../Logger');
const assert = require('assert');
const OrderBook = require('../orderbook/OrderBook');
const dns = require('dns');

class P2P {
  constructor(orderBook) {
    assert(orderBook instanceof OrderBook, 'orderBook must be an instance of OrderBook');

    this.logger = Logger.global;
    this.orderBook = orderBook;
    this.peers = {};

    this.server = net.createServer(this.connectionListener);
    this.server.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async broadcast(type, object) {
    const peerKeys = Object.keys(this.peers);
    for (let n = 0; n < peerKeys.length; n += 1) {
      this.peers[peerKeys[n]].write(`${type} ${JSON.stringify(object)}\r\n`);
    }
  }

  connect(host, port) {
    return new Promise((resolve, reject) => {
      dns.lookup(host, (dnsErr, ipAddr) => {
        if (dnsErr) {
          resolve(`could not resolve ${host}`);
        }
        if (this.peers[`${ipAddr}:${port}`]) {
          resolve(`peer ${host}:${port} is already connected`);
        }
        const peer = net.connect({
          host,
          port,
        }, () => {
          this.addPeer(peer);
          const msg = `connected to peer ${peer.remoteAddress}:${peer.remotePort}`;
          this.logger.debug(msg);
          resolve(msg);
        });
        peer.once('error', (err) => {
          reject(err);
        });
      });
    });
  }

  closeAllConnections() {
    const peerKeys = Object.keys(this.peers);
    for (let n = 0; n < peerKeys.length; n += 1) {
      const peer = this.peers[peerKeys[n]];
      if (peer) {
        peer.destroy();
      }
    }
  }

  addPeer(peer) {
    assert(!this.peers[peer.remoteAddress], `peer ${peer.remoteAddress} is already connected`);

    this.peers[`${peer.remoteAddress}:${peer.remotePort}`] = peer;

    peer.on('end', () => {
      this.peers[peer.remoteAddress] = null;
      this.logger.debug(`peer ${peer.remoteAddress} disconnected`);
    });

    peer.on('data', (data) => {
      const dataStr = data.toString();
      this.logger.debug(`received data from ${peer.remoteAddress}: ${dataStr}`);
      const type = dataStr.split(' ', 1)[0];
      try {
        const obj = JSON.parse(dataStr.substring(type.length + 1));

        switch (type) {
          case 'neworder':
            this.orderBook.addOrder(obj);
            break;
          default:
            // TODO ban peers for repeated bad p2p messages
            this.logger.warn(`unknown p2p message type: ${type}`);
        }
      } catch (err) {
        // TODO ban peers for repeated bad p2p messages
        this.logger.warn(`could not parse p2p emssage: ${dataStr}`);
      }
    });

    peer.on('error', (err) => {
      this.peers[peer.remoteAddress] = null;
      this.logger.debug(`error with connection to peer ${peer.remoteAddress}:${peer.remotePort} - ${err}`);
    });
  }
}

module.exports = P2P;
