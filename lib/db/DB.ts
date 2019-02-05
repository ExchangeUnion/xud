import path from 'path';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';
import Logger from '../Logger';
import * as db from './types';
import { SwapClients } from '../constants/enums';
import { exists, readdir } from '../utils/fsUtils';

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
  public init = async (initDb = false): Promise<void> => {
    this.models = await this.loadModels();
    const newDb = !this.storage || !(await exists(this.storage));
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

    if (newDb && initDb) {
      // populate new databases with default data
      // TODO: make seed peers configurable
      const promises: Bluebird<any>[] = [];
      promises.push(Node.bulkCreate(<db.NodeAttributes[]>[
        {
          nodePubKey: '02b66438730d1fcdf4a4ae5d3d73e847a272f160fee2938e132b52cab0a0d9cfc6',
          addresses: [{ host: 'xud1.test.exchangeunion.com', port: 8885 }],
        },
        {
          nodePubKey: '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a',
          addresses: [{ host: 'xud2.test.exchangeunion.com', port: 8885 }],
        },
        {
          nodePubKey: '03fd337659e99e628d0487e4f87acf93e353db06f754dccc402f2de1b857a319d0',
          addresses: [{ host: 'xud3.test.exchangeunion.com', port: 8885 }],
        },
      ]));

      promises.push(Currency.bulkCreate(<db.CurrencyAttributes[]>[
        { id: 'BTC', swapClient: SwapClients.Lnd, decimalPlaces: 8 },
        { id: 'LTC', swapClient: SwapClients.Lnd, decimalPlaces: 8 },
        // { id: 'ZRX', swapClient: SwapClients.Raiden, decimalPlaces: 18 },
        // { id: 'GNT', swapClient: SwapClients.Raiden, decimalPlaces: 18 },
      ]));

      await Promise.all(promises);

      await Pair.bulkCreate(<db.PairAttributes[]>[
        { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
        // { baseCurrency: 'ZRX', quoteCurrency: 'GNT' },
      ]);
    }
  }

  public close = (): Bluebird<void> => {
    return this.sequelize.close();
  }

  public dropTables = (): Bluebird<void> => {
    return this.sequelize.drop();
  }

  private loadModels = async (): Promise<Models> => {
    const models: { [index: string]: Sequelize.Model<any, any> } = {};
    const modelsFolder = path.join(__dirname, 'models');
    (await readdir(modelsFolder))
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
