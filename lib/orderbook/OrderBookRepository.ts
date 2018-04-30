import { Op } from 'sequelize';

import Logger from '../Logger';
import baseRepository from '../db/baseRepository';

class OrderbookRepository {
  logger: any;
  models: any;

  constructor(db) {
    this.logger = Logger.global;
    this.models = db.getModels();
  }

  getPairs() {
    return this.models.Pair.findAll({ raw: true });
  }

  async getOrders() {
    const [buy, sell] = await Promise.all([
      this.models.Order.findAll({
        where: { quantity: { [Op.gt]: 0 }, peerId: { [Op.ne]: null } },
        order: [['price', 'DESC']],
        raw: true,
      }),
      this.models.Order.findAll({
        where: { quantity: { [Op.lt]: 0 }, peerId: { [Op.ne]: null } },
        order: [['price', 'ASC']],
        raw: true,
      }),
    ]);
    return {
      buy,
      sell,
    };
  }

  async getOwnOrders() {
    const [buy, sell] = await Promise.all([
      this.models.Order.findAll({
        where: { quantity: { [Op.gt]: 0 }, peerId: { [Op.eq]: null } },
        order: [['price', 'DESC']],
        raw: true,
      }),
      this.models.Order.findAll({
        where: { quantity: { [Op.lt]: 0 }, peerId: { [Op.eq]: null } },
        order: [['price', 'ASC']],
        raw: true,
      }),
    ]);
    return {
      buy,
      sell,
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

export default OrderbookRepository;
