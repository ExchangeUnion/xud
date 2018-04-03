const Logger = require('../Logger');
const OrderBookRepository = require('./OrderBookRepository');

class OrderBook {
  constructor(db) {
    this.logger = Logger.global;
    this.repository = new OrderBookRepository(db);

    this.getOrders = this.getOrders.bind(this);
    this.addOrder = this.addOrder.bind(this);
  }

  getOrders() {
    return this.repository.getOrders();
  }

  async addOrder(order) {
    const id = await this.repository.addOrder(order);
    this.logger.debug(`added order: ${JSON.stringify(order)}`);
    return id;
  }
}

module.exports = OrderBook;
