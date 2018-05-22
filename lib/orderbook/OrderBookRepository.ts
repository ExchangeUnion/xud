import { Op } from 'sequelize';

import Logger from '../Logger';
import baseRepository from '../db/baseRepository';
import { Orders } from './OrderBook';

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

  async getOrders(maxResults?: number, pairId?: string): Promise<Orders> {
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

  async getOwnOrders(maxResults?: number, pairId?: string) {
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
