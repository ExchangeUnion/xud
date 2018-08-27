import { db } from '../types';
import Logger from '../Logger';
import Bluebird from 'bluebird';
import { Models } from '../db/DB';

class OrderbookRepository {

  constructor(private logger: Logger, private models: Models) {}

  public getPairs = async (): Promise<db.PairInstance[]> => {
    return this.models.Pair.findAll({ raw: true });
  }

  public addCurrencies = (currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(<db.CurrencyAttributes[]>currencies);
  }

  public addPairs = (pairs: db.PairFactory[]): Bluebird<db.PairInstance[]> => {
    return this.models.Pair.bulkCreate(<db.PairAttributes[]>pairs);
  }
}

export default OrderbookRepository;
