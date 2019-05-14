import path from 'path';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';
import Logger from '../Logger';
import * as db from './types';
import { SwapClientType, XuNetwork } from '../constants/enums';
import { promises as fs } from 'fs';
import seeds from '../p2p/seeds';

type Models = {
  Node: Sequelize.Model<db.NodeInstance, db.NodeAttributes>;
  Currency: Sequelize.Model<db.CurrencyInstance, db.CurrencyAttributes>;
  SwapDeal: Sequelize.Model<db.SwapDealInstance, db.SwapDealAttributes>;
  Pair: Sequelize.Model<db.PairInstance, db.PairAttributes>;
  ReputationEvent: Sequelize.Model<db.ReputationEventInstance, db.ReputationEventAttributes>;
  Order: Sequelize.Model<db.OrderInstance, db.OrderAttributes>;
  Trade: Sequelize.Model<db.TradeInstance, db.TradeAttributes>;
};

/** A class representing a connection to a SQL database. */
class DB {
  public sequelize: Sequelize.Sequelize;
  public models!: Models;

  /**
   * @param storage the file path for the sqlite database file, if ':memory:' or not specified the db is stored in memory
   */
  constructor(private logger: Logger, private storage?: string) {
    this.sequelize = new Sequelize({
      storage,
      logging: this.logger.trace,
      dialect: 'sqlite',
      operatorsAliases: false,
    });
  }

  /**
   * Initialize the connection to the database.
   * @param initDb whether to intialize a new database with default values if no database exists
   */
  public init = async (network = XuNetwork.SimNet, initDb = false): Promise<void> => {
    this.models = await this.loadModels();
    let newDb = !this.storage;
    if (this.storage) {
      // check if database file exists
      try {
        await fs.access(this.storage);
      } catch (err) {
        if (err.code === 'ENOENT') {
          newDb = true;
        }
      }
    }

    try {
      await this.sequelize.authenticate();
      this.logger.info(`connected to database ${this.storage ? this.storage : 'in memory'}`);
    } catch (err) {
      this.logger.error('unable to connect to the database', err);
      throw err;
    }
    const { Node, Currency, Pair, ReputationEvent, SwapDeal, Order, Trade } = this.models;
    // sync schemas with the database in phases, according to FKs dependencies
    await Promise.all([
      Node.sync(),
      Currency.sync(),
    ]);
    // Pair is dependent on Currency, ReputationEvent is dependent on Node
    await Promise.all([
      Pair.sync(),
      ReputationEvent.sync(),
    ]);
    // Order is dependent on Pair
    await Promise.all([
      Order.sync(),
    ]);
    await Promise.all([
      Trade.sync(),
      SwapDeal.sync(),
    ]);

    if (initDb && newDb) {
      // initialize database with the seed nodes for the configured network
      const nodes = seeds.get(network);
      if (nodes) {
        await Node.bulkCreate(nodes);
      }

      // initialize new databases with default data.
      await Currency.bulkCreate(<db.CurrencyAttributes[]>[
        { id: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
        { id: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
      ]);

      await Pair.bulkCreate(<db.PairAttributes[]>[
        { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
      ]);
    }
  }

  public close = (): Bluebird<void> => {
    return this.sequelize.close();
  }

  private loadModels = async (): Promise<Models> => {
    const models: { [index: string]: Sequelize.Model<any, any> } = {};
    const modelsFolder = path.join(__dirname, 'models');
    (await fs.readdir(modelsFolder))
      // filter for only files that end in .js or .ts (but not .d.ts)
      .filter(file => file !== path.basename(__filename) && file.match(/.js$|(^.?|\.[^d]|[^.]d|[^.][^d])\.ts$/))
      .forEach((file) => {
        const model = this.sequelize.import(path.join(modelsFolder, file));
        models[model.name] = model;
      });

    Object.keys(models).forEach((key) => {
      const model = models[key];
      if (model.associate) {
        model.associate(models);
      }
    });

    return <Models>models;
  }
}

export default DB;
export { Models };
