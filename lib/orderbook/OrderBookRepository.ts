import { Op } from 'sequelize';

import { db } from '../types';
import Logger from '../Logger';
import DB from '../db/DB';
import Bluebird from 'bluebird';

type Orders = {
  buyOrders: db.OrderInstance[];
  sellOrders: db.OrderInstance[];
};

class OrderbookRepository {
  logger: Logger = Logger.global;

  constructor(private db: DB) {
    this.logger = Logger.global;
  }

  async getPairs(): Promise<db.PairInstance[]> {
    return this.db.models.Pair.findAll({ raw: true });
  }

  async getPeerOrders(pairId?: string, maxResults?: number): Promise<Orders> {
    const whereClauseBuy: any = { quantity: { [Op.gt]: 0 }, peerId: { [Op.ne]: null } };
    const whereClauseSell: any = { quantity: { [Op.lt]: 0 }, peerId: { [Op.ne]: null } };

    if (pairId) {
      whereClauseBuy.pairId = { [Op.eq]: pairId };
      whereClauseSell.pairId = { [Op.eq]: pairId };
    }

    const [buyOrders, sellOrders] = await Promise.all([
      this.db.models.Order.findAll({
        limit: maxResults,
        where: whereClauseBuy,
        order: [['price', 'DESC']],
        raw: true,
      }),
      this.db.models.Order.findAll({
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
      this.db.models.Order.findAll({
        limit: maxResults,
        where: whereClauseBuy,
        order: [['price', 'DESC']],
        raw: true,
      }),
      this.db.models.Order.findAll({
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

  public addOrder = (order: db.OrderFactory): Bluebird<db.OrderInstance> => {
    return this.db.models.Order.create(<db.OrderAttributes>order);
  }

  public addOrders = (orders: db.OrderFactory[]): Bluebird<db.OrderInstance[]> => {
    return this.db.models.Order.bulkCreate(<db.OrderAttributes[]>orders);
  }

  public addCurrencies(currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> {
    return this.db.models.Currency.bulkCreate(<db.CurrencyAttributes[]>currencies);
  }

  public addPairs(pairs: db.PairFactory[]): Bluebird<db.PairInstance[]> {
    return this.db.models.Pair.bulkCreate(<db.PairAttributes[]>pairs);
  }
}

export default OrderbookRepository;
export { Orders };
