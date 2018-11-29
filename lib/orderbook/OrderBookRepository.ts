import { db } from '../types';
import Logger from '../Logger';
import Bluebird from 'bluebird';
import { Models } from '../db/DB';
import { OrderAttributes } from 'lib/types/db';

class OrderbookRepository {

  constructor(private logger: Logger, private models: Models) {}

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
   * Only persist order if it doesn't exists.
   * @param order order to persist
   */
  public addOrderIfNotExists = async (order: db.OrderFactory) => {
    const count = await this.models.Order.count({
      where: { id: order.id },
    });
    if (count === 0) {
      await this.models.Order.create(order);
    }
  }

  public addTrade = async (trade: db.TradeFactory) => {
    await this.models.Trade.create(trade);
  }
}

export default OrderbookRepository;
