import { Models } from '../db/DB';
import * as db from '../db/types';

class OrderbookRepository {
  constructor(private models: Models) {}

  public getPairs = (): Promise<db.PairInstance[]> => {
    return this.models.Pair.findAll();
  };

  public getCurrencies = (): Promise<db.CurrencyInstance[]> => {
    return this.models.Currency.findAll();
  };

  public addCurrency = (currency: db.CurrencyCreationAttributes): Promise<db.CurrencyInstance> => {
    return this.models.Currency.create(currency);
  };

  public addCurrencies = (currencies: db.CurrencyCreationAttributes[]): Promise<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(currencies);
  };

  public addPair = (pair: db.PairCreationAttributes): Promise<db.PairInstance> => {
    return this.models.Pair.create(<db.PairAttributes>pair);
  };

  public addPairs = (pairs: db.PairCreationAttributes[]): Promise<db.PairInstance[]> => {
    return this.models.Pair.bulkCreate(<db.PairAttributes[]>pairs);
  };

  /**
   * Adds an order to the database if it doesn't already exist.
   * @param order order to persist
   * @returns the created order instance, or undefined if it already existed
   */
  public addOrderIfNotExists = async (order: db.OrderCreationAttributes) => {
    try {
      const createdOrder = await this.models.Order.create(order);
      return createdOrder;
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return undefined;
      } else {
        throw err;
      }
    }
  };

  public getOrder = (id: string) => {
    return this.models.Order.findOne({ where: { id } });
  };

  public addTrade = (trade: db.TradeCreationAttributes) => {
    return this.models.Trade.create(trade);
  };

  public getTrades = (limit?: number): Promise<db.TradeInstance[]> => {
    return this.models.Trade.findAll({
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: this.models.Order, as: 'makerOrder' },
        { model: this.models.Order, as: 'takerOrder' },
        { model: this.models.SwapDeal, include: [this.models.Node] },
      ],
    });
  };
}

export default OrderbookRepository;
