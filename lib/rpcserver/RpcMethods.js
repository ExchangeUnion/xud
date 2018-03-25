class RpcMethods {
  constructor(orderbook, lndClient, p2p) {
    this.orderbook = orderbook;
    this.lndClient = lndClient;
    this.p2p = p2p;

    this.getInfo = this.getInfo.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.connect = this.connect.bind(this);
  }

  getInfo() {
    return this.lndClient.getInfo();
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
}

module.exports = RpcMethods;
