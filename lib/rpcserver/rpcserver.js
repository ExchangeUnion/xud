'use strict';

const HttpJsonRpcServer = require('http-jsonrpc-server');
const assert = require('assert');
const Service = require('./Service');
const util = require('../utils/util');
const Logger = require('../Logger');


class RpcServer {
  constructor(orderbook, lndClient) {
    const service = new Service(orderbook, lndClient);
    this.logger = Logger.global;

    this.server = new HttpJsonRpcServer({
      onRequest: (request) => {
        this.logger.debug(`RPC server request: ${JSON.stringify(request)}`);
      },
      onRequestError: (err, id) => {
        this.logger.error(`RPC server request (${id}) error`, err);
      },
      onServerError: (err) => {
        this.logger.error(`RPC server error`, err);
      },
      methods: util.getPublicFunctions(service)
    });
  }

  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    await this.server.listen(port);
    this.logger.info(`RPC server listening on port ${port}`);
  }
}

module.exports = RpcServer;
