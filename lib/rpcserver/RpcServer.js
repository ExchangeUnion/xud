const HttpJsonRpcServer = require('http-jsonrpc-server');
const Logger = require('../Logger');
const assert = require('assert');
const RpcMethods = require('./RpcMethods');
const utils = require('../utils/utils');

class RpcServer {
  constructor({
    orderBook,
    lndClient,
    p2p,
    shutdown,
  }) {
    const rpcMethods = new RpcMethods({
      orderBook,
      lndClient,
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

  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    await this.server.listen(port);
    this.logger.info(`RPC server listening on port ${port}`);
  }

  async close() {
    await this.server.close();
    this.logger.info('RPC server stopped listening');
  }
}

module.exports = RpcServer;
