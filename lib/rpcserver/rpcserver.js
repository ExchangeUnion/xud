const HttpJsonRpcServer = require('http-jsonrpc-server');
const logger = require('winston');

const PORT = 8886; // temporary hardcoded default port

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

  async listen() {
    await this.server.listen(PORT);
    logger.info(`RPC server listening on port ${PORT}`);
  }

  async placeOrder(params) {
    return this.orderBook.placeOrder(params.order);
  }
}

module.exports = RpcServer;
