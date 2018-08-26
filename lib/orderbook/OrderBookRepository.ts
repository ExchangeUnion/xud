import { db } from '../types';
import Logger from '../Logger';
import Bluebird from 'bluebird';
import DB, { Models } from '../db/DB';

class OrderbookRepository {
  private models: Models;
  private options: any;

  constructor(private logger: Logger, db: DB) {
    this.models = db.models;
    this.options = db.options;
  }

  public getPairs = async (): Promise<db.PairInstance[]> => {
    return this.models.Pair.findAll(this.options && { raw: true });
  }

  public addCurrencies = (currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(<db.CurrencyAttributes[]>currencies, this.options);
  }

  public addPairs = (pairs: db.PairFactory[]): Bluebird<db.PairInstance[]> => {
    return this.models.Pair.bulkCreate(<db.PairAttributes[]>pairs, this.options);
  }
}

export default OrderbookRepository;
