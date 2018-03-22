'use strict';

const HttpJsonRpcServer = require('http-jsonrpc-server');
const Logger = require('../Logger');
const assert = require('assert');

class RpcServer {
  constructor(orderBook, lndClient) {
    this.orderBook = orderBook;
    this.lndClient = lndClient;
    this.logger = Logger.global;

    const options = {
      onRequest: (request) => {
        this.logger.debug(`received RPC request: ${JSON.stringify(request)}`);
      },
      onRequestError: (err, id) => {
        this.logger.error(`error for RPC request ${id}: ${err}`);
      },
      onServerError: (err) => {
        this.logger.error(`server error: ${err}`);
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
    this.logger.info(`RPC server listening on port ${port}`);
  }

  async placeOrder(params) {
    const { order } = params;
    // temporary simple invoices until swaps are operational
    const invoice = await this.lndClient.addInvoice(order.price * order.quantity);
    order.invoice = invoice.payment_request;
    await this.orderBook.addOrder(order);
    this.p2p.broadcast('neworder', params);
  }
}

module.exports = RpcServer;
