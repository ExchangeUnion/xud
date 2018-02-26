const HttpJsonRpcServer = require('http-jsonrpc-server');

const PORT = 8885; // temporary default port (X = 88, U = 85 in ASCII)

class RpcServer {
  constructor(orderBook, lndClient) {
    this.orderBook = orderBook;
    this.lndClient = lndClient;
    this.server = new HttpJsonRpcServer();
    this.server.setMethod('getInfo', lndClient.getInfo);
    this.server.setMethod('getOrders', orderBook.getOrders);
    this.server.setMethod('placeOrder', this.placeOrder);
  }

  async listen() {
    await this.server.listen(PORT);
  }

  async placeOrder(params) {
    return this.orderBook.placeOrder(params.order);
  }
}

export default RpcServer;
