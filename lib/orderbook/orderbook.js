const Logger = require('../Logger');
const { Op } = require('sequelize');

class OrderBook {
  constructor(db) {
    this.db = db;
    this.logger = Logger.global;
  }

  async getOrders() {
    const [bids, asks] = await Promise.all([
      this.db.Order.findAll({
        where: { quantity: { [Op.gt]: 0 } },
        order: [['price', 'DESC']],
      }),
      this.db.Order.findAll({
        where: { quantity: { [Op.lt]: 0 } },
        order: [['price', 'ASC']],
      }),
    ]);
    return {
      bids,
      asks,
    };
  }

  async addOrder(order) {
    const result = await this.db.Order.create(order);
    this.logger.debug(`added order: ${JSON.stringify(order)}`);
    return result.id;
  }
}

module.exports = OrderBook;
