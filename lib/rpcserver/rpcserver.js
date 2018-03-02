const HttpJsonRpcServer = require('http-jsonrpc-server');
const logger = require('winston');
const assert = require('assert');

class RpcServer {
  constructor(orderBook, lndClient) {
    this.orderBook = orderBook;
    this.lndClient = lndClient;

    const options = {
      onRequest: (request) => {
        logger.debug(`received RPC request: ${JSON.stringify(request)}`);
      },
      onRequestError: (err, id) => {
        logger.error(`error for RPC request ${id}: ${err}`);
      },
      onServerError: (err) => {
        logger.error(`server error: ${err}`);
      },
      methods: {
        getInfo: lndClient.getInfo.bind(lndClient),
        getOrders: orderBook.getOrders.bind(orderBook),
        placeOrder: this.placeOrder.bind(this),
      },
    };
    this.server = new HttpJsonRpcServer(options);
  }

  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    await this.server.listen(port);
    logger.info(`RPC server listening on port ${port}`);
  }

  async placeOrder(params) {
    return this.orderBook.placeOrder(params.order);
  }
}

module.exports = RpcServer;
