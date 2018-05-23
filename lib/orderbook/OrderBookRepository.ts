import { Op } from 'sequelize';

import { orders, pairs } from '../types';
import Logger from '../Logger';
import baseRepository from '../db/baseRepository';

type Orders = {
  buyOrders: orders.dbOrder[];
  sellOrders: orders.dbOrder[];
};

class OrderbookRepository {
  logger: Logger = Logger.global;
  models: any;

  constructor(db) {
    this.logger = Logger.global;
    this.models = db.getModels();
  }

  async getPairs(): Promise<pairs.dbPair[]> {
    return this.models.Pair.findAll({ raw: true });
  }

  async getPeerOrders(): Promise<Orders> {
    const [buyOrders, sellOrders] = await Promise.all([
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
      buyOrders,
      sellOrders,
    };
  }

  async getOwnOrders(): Promise<Orders> {
    const [buyOrders, sellOrders] = await Promise.all([
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
      buyOrders,
      sellOrders,
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
export { Orders };
