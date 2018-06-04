import { default as Sequelize, Op } from 'sequelize';

import { db, orders } from '../types';
import Logger from '../Logger';
import DB, { Models } from '../db/DB';
import Bluebird from 'bluebird';

type Orders = {
  buyOrders: db.OrderInstance[];
  sellOrders: db.OrderInstance[];
};

class OrderbookRepository {
  private logger: Logger = Logger.orderbook;
  private models: Models;
  private sequelize: Sequelize.Sequelize;

  constructor(db: DB) {
    this.models = db.models;
    this.sequelize = db.sequelize;
  }

  public async getPairs(): Promise<db.PairInstance[]> {
    return this.models.Pair.findAll({ raw: true });
  }

  public async getPeerOrders(pairId?: string, maxResults?: number): Promise<Orders> {
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

  public async getOwnOrders(pairId?: string, maxResults?: number): Promise<Orders> {
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

  public addOrder = (order: db.OrderFactory): Bluebird<db.OrderInstance> => {
    return this.models.Order.create(<db.OrderAttributes>order);
  }

  public addOrders = (orders: db.OrderFactory[]): Bluebird<db.OrderInstance[]> => {
    return this.models.Order.bulkCreate(<db.OrderAttributes[]>orders);
  }

  public updateOrderQuantity = async (orderId: string, decreasedQuantity: number) => {
    await this.models.Order.update({ quantity: this.sequelize.literal(`quantity - ${decreasedQuantity}`) }, { where: { id: orderId } });
  }

  public addCurrencies(currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> {
    return this.models.Currency.bulkCreate(<db.CurrencyAttributes[]>currencies);
  }

  public addPairs(pairs: db.PairFactory[]): Bluebird<db.PairInstance[]> {
    return this.models.Pair.bulkCreate(<db.PairAttributes[]>pairs);
  }
}

export default OrderbookRepository;
export { Orders };
