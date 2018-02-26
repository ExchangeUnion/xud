const HttpJsonRpcServer = require('http-jsonrpc-server');
const logger = require('winston');

const PORT = 8886; // temporary hardcoded default port

class RpcServer {
  constructor(orderBook, lndClient) {
    this.orderBook = orderBook;
    this.lndClient = lndClient;
    this.server = new HttpJsonRpcServer();

    this.server.setMethod('getInfo', lndClient.getInfo.bind(lndClient));
    this.server.setMethod('getOrders', orderBook.getOrders.bind(orderBook));

    this.server.setMethod('placeOrder', this.placeOrder.bind((this)));

    this.server.onRequest = (request) => {
      logger.debug(`received RPC request: ${JSON.stringify(request)}`);
    };

    this.server.onError = (err, id) => {
      logger.error(`error for RPC request ${id}: ${err}`);
    };
  }

  async listen() {
    await this.server.listen(PORT);
    logger.info(`RPC server listening on port ${PORT}`);
  }

  async placeOrder(params) {
    return this.orderBook.placeOrder(params.order);
  }
}

module.exports = RpcServer;
