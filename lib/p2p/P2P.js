/**
 * @module P2P
 */

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
   * Construct peer's id
   * @param {string} host
   * @param {string} address
   * @param {number} port
   * @returns {string}
   */
  static getPeerId(host, address, port) {
    return address === host
      ? `${address}:${port}`
      : `${host}[${address}]:${port}`;
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
      dns.lookup(host, (dnsErr, address) => {
        if (dnsErr) {
          resolve(`could not resolve ${host}`);
          return;
        }
        const peerId = P2P.getPeerId(host, address, port);
        if (this.peers[peerId]) {
          resolve(`peer ${peerId} is already connected`);
          return;
        };

        const peer = net.connect({
          address,
          port,
        }, () => {
          this.addPeer(peer, peerId);
          const msg = `connected to peer ${peerId}`;
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
   * @param {string} peerId
   */
  addPeer(peer, peerId) {
    assert(!this.peers[peerId], `peer ${peerId} is already connected`);

    this.peers[peerId] = peer;

    peer.on('end', () => {
      this.peers[peerId] = null;
      this.logger.debug(`peer ${peerId} disconnected`);
    });

    peer.on('data', (data) => {
      const dataStr = data.toString();
      this.logger.debug(`received data from ${peerId}: ${dataStr}`);
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
      this.peers[peerId] = null;
      this.logger.debug(`error with connection to peer ${peerId}: ${err}`);
    });
  }
}

module.exports = P2P;
