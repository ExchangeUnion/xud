const net = require('net');
const { EventEmitter } = require('events');
const Logger = require('../Logger');
const assert = require('assert');
const dns = require('dns');

/** Class representing a pool of XU peers */
class P2P extends EventEmitter {
  /**
   * Create a pool of XU peers.
   */
  constructor() {
    super();
    this.logger = Logger.global;
    this.peers = {};

    this.server = net.createServer(this.connectionListener);
    this.server.on('error', (err) => {
      this.logger.error(err);
    });
  }

  /**
   * Broadcast a message to all peers.
   * @param {string} type - The type of message to broadcast.
   * @param {Object} object - The JSON body of the message to be converted and sent as a string.
   */
  async broadcast(type, object) {
    const peerKeys = Object.keys(this.peers);
    for (let n = 0; n < peerKeys.length; n += 1) {
      this.peers[peerKeys[n]].write(`${type} ${JSON.stringify(object)}\r\n`);
    }
  }

  /**
   * Connect to an XU peer on a given host and port.
   * @param {string} host
   * @param {number} port
   */
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

  /**
   * Close all connections to peers.
   */
  closeAllConnections() {
    const peerKeys = Object.keys(this.peers);
    for (let n = 0; n < peerKeys.length; n += 1) {
      const peer = this.peers[peerKeys[n]];
      if (peer) {
        peer.destroy();
      }
    }
  }

  /**
   * Add a peer to the list of peers and set handlers for socket events.
   * @param {net.Socket} peer
   */
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
            this.emit(type, obj);
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
