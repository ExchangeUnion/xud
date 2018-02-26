const mysql = require('promise-mysql');
const logger = require('winston');

class OrderBook {
  async init() {
    this.pool = await mysql.createPool({
      host: 'localhost',
      database: 'mordor',
    });
  }

  async getOrders() {
    const [bids, asks] = await Promise.all([
      this.pool.query('SELECT `price`, `quantity`, FROM orders WHERE `quantity` > 0 ORDER BY `price` DESC'),
      this.pool.query('SELECT `price`, `quantity`, FROM orders WHERE `quantity` < 0 ORDER BY `price` ASC'),
    ]);
    return {
      bids,
      asks,
    };
  }

  async placeOrder(order) {
    const result = await this.pool.query('INSERT INTO orders SET ?', order);
    logger.info(`placed order: ${order}`);
    return result;
  }
}

module.exports = OrderBook;
