import HttpJsonRpcServer from 'http-jsonrpc-server';
import Logger from '../Logger';
import assert from 'assert';
import RpcMethods from './RpcMethods';
import utils from '../utils/utils';

/** Class representing an Exchange Union RPC Server. */
class RpcServer {
  server: any;
  logger: any;

  /**
   * Create an RPC server.
   * @param {OrderBook} $0.orderBook
   * @param {LndClient} $0.lndClient
   * @param {RaidenClient} $0.raidenClient
   * @param {P2P} $0.p2p
   * @param {function} $0.shutdown - The function to be called to shutdown the parent process
   */
  constructor({
    orderBook,
    lndClient,
    raidenClient,
    p2p,
    shutdown,
  }) {
    const rpcMethods = new RpcMethods({
      orderBook,
      lndClient,
      raidenClient,
      p2p,
      shutdown,
    });
    this.server = new HttpJsonRpcServer({
      onRequest: (request) => {
        this.logger.debug(`RPC server request: ${JSON.stringify(request)}`);
      },
      onRequestError: (err, id) => {
        this.logger.error(`RPC server request (${id}) error`, err);
      },
      onServerError: (err) => {
        this.logger.error('RPC server error', err);
      },
      methods: utils.getPublicMethods(rpcMethods),
    });
    this.logger = Logger.global;
  }

  /**
   * Starts the server and begins listening on the provided port
   * @param {number} port
   */
  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    await this.server.listen(port);
    this.logger.info(`RPC server listening on port ${port}`);
  }

  /**
   * Closes the server and stops listening
   */
  async close() {
    await this.server.close();
    this.logger.info('RPC server stopped listening');
  }
}

export default RpcServer;
