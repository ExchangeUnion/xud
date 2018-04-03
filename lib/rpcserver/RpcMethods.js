const Logger = require('../Logger');
const errors = require('../constants/errors');

class RpcMethods {
  constructor({
    orderbook,
    lndClient,
    p2p,
    shutdown,
  }) {
    this.orderbook = orderbook;
    this.lndClient = lndClient;
    this.p2p = p2p;
    this.shutdown = shutdown;
    this.logger = Logger.global;

    this.getInfo = this.getInfo.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.connect = this.connect.bind(this);
    this.shutdown = this.shutdown.bind(this);
  }

  getInfo() {
    if (this.lndClient) {
      return this.lndClient.getInfo();
    } else {
      return errors.LND_NOT_CONNECTED;
    }
  }

  getOrders() {
    return this.orderbook.getOrders();
  }

  async placeOrder(params) {
    const { order } = params;
    // temporary simple invoices until swaps are operational
    const invoice = await this.lndClient.addInvoice(order.price * order.quantity);
    order.invoice = invoice.payment_request;
    await this.orderbook.addOrder(order);
    this.p2p.broadcast('neworder', params);
  }

  async connect(params) {
    await this.p2p.connect(params.host, params.port);
  }

  shutdown() {
    if (this.shutdown) {
      return this.shutdown();
    }
    return 'nothing to shutdown';
  }
}

module.exports = RpcMethods;
