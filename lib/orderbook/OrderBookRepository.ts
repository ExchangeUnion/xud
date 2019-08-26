import * as db from '../db/types';
import Bluebird from 'bluebird';
import { Models } from '../db/DB';

class OrderbookRepository {

  constructor(private models: Models) {}

  public getPairs = (): Bluebird<db.PairInstance[]> => {
    return this.models.Pair.findAll();
  }

  public getCurrencies = (): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.findAll();
  }

  public addCurrency = (currency: db.CurrencyFactory): Bluebird<db.CurrencyInstance> => {
    return this.models.Currency.create(<db.CurrencyAttributes>currency);
  }

  public addCurrencies = (currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(<db.CurrencyAttributes[]>currencies);
  }

  public addPair = (pair: db.PairFactory): Bluebird<db.PairInstance> => {
    return this.models.Pair.create(<db.PairAttributes>pair);
  }

  public addPairs = (pairs: db.PairFactory[]): Bluebird<db.PairInstance[]> => {
    return this.models.Pair.bulkCreate(<db.PairAttributes[]>pairs);
  }

  /**
   * Adds an order to the database if it doesn't already exist.
   * @param order order to persist
   * @returns the created order instance, or undefined if it already existed
   */
  public addOrderIfNotExists = async (order: db.OrderFactory) => {
    const count = await this.models.Order.count({
      where: { id: order.id },
    });
    if (count === 0) {
      return this.models.Order.upsert(order);
    } else {
      return undefined;
    }
  }

  public addTrade = (trade: db.TradeFactory) => {
    return this.models.Trade.create(trade);
  }

  public getTrades = (limit?: number): Bluebird<db.TradeInstance[]> => {
    if (limit) {
      return this.models.Trade.findAll({ limit, order: [['createdAt', 'DESC']] });
    } else {
      return this.models.Trade.findAll({ order: [['createdAt', 'DESC']] });
    }
  }
}

export default OrderbookRepository;
