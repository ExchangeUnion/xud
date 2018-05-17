import HttpJsonRpcServer from 'http-jsonrpc-server';
import assert from 'assert';

import Logger from '../Logger';
import utils from '../utils/utils';
import RpcMethods from './RpcMethods';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient from '../raidenclient/RaidenClient';
import Pool from '../p2p/Pool';
import Config from '../Config';

/**
 * The components required by the RPC server.
 */
type RpcComponents = {
  config: Config;
  orderBook: OrderBook;
  lndClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  /** The function to be called to shutdown the parent process */
  shutdown: Function;
};

/** Class representing an Exchange Union RPC Server. */
class RpcServer {
  server: HttpJsonRpcServer;
  logger: Logger;

  /**
   * Create an RPC server.
   */
  constructor(components: RpcComponents) {
    const rpcMethods = new RpcMethods(components);

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
export { RpcComponents };
