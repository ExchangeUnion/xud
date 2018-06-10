import { default as Sequelize, Op } from 'sequelize';

import { db, orders } from '../types';
import Logger from '../Logger';
import DB, { Models } from '../db/DB';
import Bluebird from 'bluebird';
import { OrderAttributes } from '../types/db';

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

  public getPairs = async (): Promise<db.PairInstance[]> => {
    return this.models.Pair.findAll({ raw: true });
  }

  /**
   * Get peer's orders from the orderbook.
   * @param pairId The trading pair to match to retrieved orders, if undefined then all trading pairs are retrieved.
   * @param maxResults The max number of orders to retrieve from each side of the orderbook, if 0 or undefined then
   * the number of orders returned is unlimited.
   */
  public getPeerOrders = (pairId?: string, maxResults?: number) => {
    return this.getOrders(false, pairId, maxResults);
  }

  /**
   * Get this node's own orders from the orderbook.
   * @param pairId The trading pair to match to retrieved orders, if undefined then all trading pairs are retrieved.
   * @param maxResults The max number of orders to retrieve from each side of the orderbook, if 0 or undefined then
   * the number of orders returned is unlimited.
   */
  public getOwnOrders = (pairId?: string, maxResults?: number) => {
    return this.getOrders(true, pairId, maxResults);
  }

  private getOrders = async (ownOrders: boolean, pairId?: string, maxResults?: number): Promise<Orders> => {
    const whereClauseBuy: Sequelize.WhereOptions<OrderAttributes> = { quantity: { [Op.gt]: 0 } };
    const whereClauseSell: Sequelize.WhereOptions<OrderAttributes> = { quantity: { [Op.lt]: 0 } };

    if (ownOrders) {
      whereClauseBuy.hostId = { [Op.eq]: null };
      whereClauseSell.hostId = { [Op.eq]: null };
    } else {
      whereClauseBuy.hostId = { [Op.ne]: null };
      whereClauseSell.hostId = { [Op.ne]: null };
    }

    if (pairId) {
      whereClauseBuy.pairId = { [Op.eq]: pairId };
      whereClauseSell.pairId = { [Op.eq]: pairId };
    }

    const buyQuery: Sequelize.FindOptions<OrderAttributes> = {
      where: whereClauseBuy,
      order: [['price', 'DESC']],
      raw: true,
    };
    const sellQuery: Sequelize.FindOptions<OrderAttributes> = {
      where: whereClauseSell,
      order: [['price', 'ASC']],
      raw: true,
    };
    if (maxResults && maxResults > 0) {
      buyQuery.limit = maxResults;
      sellQuery.limit = maxResults;
    }

    const [buyOrders, sellOrders] = await Promise.all([
      this.models.Order.findAll(buyQuery),
      this.models.Order.findAll(sellQuery),
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

  public addCurrencies = (currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(<db.CurrencyAttributes[]>currencies);
  }

  public addPairs = (pairs: db.PairFactory[]): Bluebird<db.PairInstance[]> => {
    return this.models.Pair.bulkCreate(<db.PairAttributes[]>pairs);
  }
}

export default OrderbookRepository;
export { Orders };
