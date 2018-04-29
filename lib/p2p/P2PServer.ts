const Peer: any = require('./Peer');

import net from 'net';
import Logger from '../Logger';
import assert from 'assert';

/** Class representing a server that accepts incoming peer connections */
class P2PServer {
  logger: any;
  p2p: any;
  server: any;

  /** Create a server to accept incoming peer connections */
  constructor(p2p) {
    this.logger = Logger.global;
    this.p2p = p2p;
    this.server = net.createServer(async (socket) => {
      const peer = new Peer({ address: socket.remoteAddress, port: socket.remotePort });
      await p2p.addPeer(peer, socket);
      this.logger.debug(`peer ${peer.toString()} connected`);
    });
    this.server.on('error', (err) => {
      this.logger.error(err);
    });
  }

  /**
   * Start listening for incoming connections on a given port.
   * @param {number} port
   */
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

  /**
   * Stop listening for incoming connections.
   */
  close() {
    this.server.close(() => { this.logger.info('P2P server closed'); }).once('error', (err) => {
      throw (err);
    });
    this.logger.info('P2P server stopped listening');
  }
}

export default P2PServer;
