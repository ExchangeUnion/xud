const Logger = require('../Logger');
const { Op } = require('sequelize');
const baseRepository = require('../db/baseRepository');

class OrderbookRepository {
  constructor(db) {
    this.logger = Logger.global;
    this.models = db.getModels();
  }

  async getOrders() {
    const [bids, asks] = await Promise.all([
      this.models.Order.findAll({
        where: { quantity: { [Op.gt]: 0 } },
        order: [['price', 'DESC']],
      }),
      this.models.Order.findAll({
        where: { quantity: { [Op.lt]: 0 } },
        order: [['price', 'ASC']],
      }),
    ]);
    return {
      bids,
      asks,
    };
  }

  addOrder(order) {
    return baseRepository.addOne(this.models.Order, order);
  }

  addOrders(orders) {
    return baseRepository.addMany(this.models.Order, orders);
  }

  addCurrencies(currencies) {
    return baseRepository.addMany(this.models.Currency, currencies);
  }

  addPairs(pairs) {
    return baseRepository.addMany(this.models.Pair, pairs);
  }
}

module.exports = OrderbookRepository;
