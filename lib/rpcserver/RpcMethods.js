const Logger = require('../Logger');
const errors = require('../constants/errors');

/** Class containing the available RPC methods for Exchange Union */
class RpcMethods {
  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor({
    orderbook,
    lndClient,
    raidenClient,
    p2p,
    shutdown,
  }) {
    this.orderbook = orderbook;
    this.lndClient = lndClient;
    this.raidenClient = raidenClient;
    this.p2p = p2p;
    this.shutdown = shutdown;
    this.logger = Logger.global;

    this.getInfo = this.getInfo.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.connect = this.connect.bind(this);
    this.tokenSwap = this.tokenSwap.bind(this);
    this.shutdown = this.shutdown.bind(this);
  }

  /**
   * Placeholder for a method to return general information about an Exchange Union node
   * @returns {object}
   */
  getInfo() {
    if (this.lndClient) {
      return this.lndClient.getInfo();
    } else {
      return errors.LND_NOT_CONNECTED;
    }
  }

  /**
   * @typedef {Object} Orders
   * @property {Array} buys - A list of buy orders ordered by descending price
   * @property {Array} sells - A list of sell orders ordered by ascending price
   */

  /**
   * Get a list of standing orders from the orderbook
   * @returns {Orders}
   */
  getOrders() {
    return this.orderbook.getOrders();
  }

  /**
   * Add an order to the orderbook
   * @param {Object} params
   * @param {Object} params.order
   */
  async placeOrder(params) {
    const { order } = params;
    // temporary simple invoices until swaps are operational
    const invoice = await this.lndClient.addInvoice(order.price * order.quantity);
    order.invoice = invoice.payment_request;
    await this.orderbook.addOrder(order);
    this.p2p.broadcast('neworder', params);
  }

  /**
   * Connect to an XU node on a given host and port.
   * @param {Object} params
   * @param {string} params.host
   * @param {number} params.port
   */
  connect(params) {
    return this.p2p.connect(params.host, params.port);
  }

  /**
   * Demo method to execute a Raiden Token Swap through XUD.
  */
  tokenSwap(params) {
    return this.raidenClient.tokenSwap(params.target_address, params.payload, params.identifier);
  }

  /**
   * Gracefully shutdown the parent process.
   */
  shutdown() {
    if (this.shutdown) {
      return this.shutdown();
    }
    return 'nothing to shutdown';
  }
}

module.exports = RpcMethods;
