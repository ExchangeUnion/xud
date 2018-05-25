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

  async getPeerOrders(pairId?: string, maxResults?: number): Promise<Orders> {
    const whereClauseBuy: any = { quantity: { [Op.gt]: 0 }, peerId: { [Op.ne]: null } };
    const whereClauseSell: any = { quantity: { [Op.lt]: 0 }, peerId: { [Op.ne]: null } };

    if (pairId) {
      whereClauseBuy.pairId = { [Op.eq]: pairId };
      whereClauseSell.pairId = { [Op.eq]: pairId };
    }

    const [buyOrders, sellOrders] = await Promise.all([
      this.models.Order.findAll({
        limit: maxResults,
        where: whereClauseBuy,
        order: [['price', 'DESC']],
        raw: true,
      }),
      this.models.Order.findAll({
        limit: maxResults,
        where: whereClauseSell,
        order: [['price', 'ASC']],
        raw: true,
      }),
    ]);
    return {
      buyOrders,
      sellOrders,
    };
  }

  async getOwnOrders(pairId?: string, maxResults?: number): Promise<Orders> {
    const whereClauseBuy: any = { quantity: { [Op.gt]: 0 }, peerId: { [Op.eq]: null } };
    const whereClauseSell: any = { quantity: { [Op.lt]: 0 }, peerId: { [Op.eq]: null } };

    if (pairId) {
      whereClauseBuy.pairId = { [Op.eq]: pairId };
      whereClauseSell.pairId = { [Op.eq]: pairId };
    }

    const [buyOrders, sellOrders] = await Promise.all([
      this.models.Order.findAll({
        limit: maxResults,
        where: whereClauseBuy,
        order: [['price', 'DESC']],
        raw: true,
      }),
      this.models.Order.findAll({
        limit: maxResults,
        where: whereClauseSell,
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
