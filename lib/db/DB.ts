import assert from 'assert';
import { promises as fs } from 'fs';
import { ModelCtor, Sequelize } from 'sequelize';
import { XuNetwork } from '../constants/enums';
import { defaultCurrencies, defaultNodes, defaultPairs } from '../db/seeds';
import Logger from '../Logger';
import { derivePairId } from '../utils/utils';
import migrations from './migrations';
import * as Models from './models';
import * as db from './types';

type Models = {
  Currency: ModelCtor<db.CurrencyInstance>;
  Node: ModelCtor<db.NodeInstance>;
  SwapDeal: ModelCtor<db.SwapDealInstance>;
  Pair: ModelCtor<db.PairInstance>;
  ReputationEvent: ModelCtor<db.ReputationEventInstance>;
  Order: ModelCtor<db.OrderInstance>;
  Trade: ModelCtor<db.TradeInstance>;
  Password: ModelCtor<db.PasswordInstance>;
};

function loadModels(sequelize: Sequelize): Models {
  const models: Models = {
    Currency: Models.Currency(sequelize),
    Node: Models.Node(sequelize),
    Order: Models.Order(sequelize),
    Pair: Models.Pair(sequelize),
    ReputationEvent: Models.ReputationEvent(sequelize),
    SwapDeal: Models.SwapDeal(sequelize),
    Trade: Models.Trade(sequelize),
    Password: Models.Password(sequelize),
  };

  models.Currency.hasMany(models.Pair, {
    as: 'quoteCurrencies',
    foreignKey: 'quoteCurrency',
    constraints: true,
  });
  models.Currency.hasMany(models.Pair, {
    as: 'baseCurrencies',
    foreignKey: 'baseCurrency',
    constraints: true,
  });

  models.Node.hasMany(models.ReputationEvent, {
    foreignKey: 'nodeId',
    constraints: true,
  });

  models.Order.belongsTo(models.Node, {
    foreignKey: 'nodeId',
    constraints: true,
  });
  models.Order.belongsTo(models.Pair, {
    foreignKey: 'pairId',
    constraints: false,
  });
  models.Order.hasMany(models.Trade, {
    as: 'makerTrades',
    foreignKey: 'makerOrderId',
    constraints: true,
  });
  models.Order.hasMany(models.Trade, {
    as: 'takerTrades',
    foreignKey: 'takerOrderId',
    constraints: true,
  });
  models.Order.hasMany(models.SwapDeal, {
    foreignKey: 'orderId',
    constraints: true,
  });

  models.Pair.belongsTo(models.Currency, {
    as: 'baseCurrencyInstance',
    constraints: true,
    foreignKey: 'baseCurrency',
  });

  models.Pair.belongsTo(models.Currency, {
    as: 'takerCurrencyInstance',
    constraints: true,
    foreignKey: 'quoteCurrency',
  });

  models.Pair.beforeBulkCreate((pairs) => pairs.forEach((pair) => (pair.id = derivePairId(pair))));
  models.Pair.beforeCreate((pair) => {
    pair.id = derivePairId(pair);
  });

  models.ReputationEvent.belongsTo(models.Node, {
    foreignKey: 'nodeId',
    constraints: true,
  });

  models.SwapDeal.belongsTo(models.Order, {
    foreignKey: 'orderId',
    constraints: true,
  });
  models.SwapDeal.belongsTo(models.Node, {
    foreignKey: 'nodeId',
    constraints: true,
  });

  models.Trade.belongsTo(models.Order, {
    as: 'makerOrder',
    foreignKey: 'makerOrderId',
    constraints: true,
  });
  models.Trade.belongsTo(models.Order, {
    as: 'takerOrder',
    foreignKey: 'takerOrderId',
    constraints: false,
  });
  models.Trade.belongsTo(models.SwapDeal, {
    foreignKey: 'rHash',
    constraints: false,
  });

  return models;
}

/** A class representing a connection to a SQL database. */
class DB {
  public sequelize: Sequelize;
  public models: Models;

  private static VERSION = 1;

  /**
   * @param storage the file path for the sqlite database file, if ':memory:' or not specified the db is stored in memory
   */
  constructor(private logger: Logger, private storage?: string) {
    this.sequelize = new Sequelize({
      storage,
      logging: this.logger.trace,
      dialect: 'sqlite',
    });

    this.models = loadModels(this.sequelize);
  }

  /**
   * Initialize the connection to the database.
   * @param initDb whether to intialize a new database with default values if no database exists
   */
  public init = async (network = XuNetwork.SimNet, initDb = false): Promise<void> => {
    const isNewDb = await this.isNewDb();

    try {
      await this.sequelize.authenticate();
      this.logger.info(`connected to database ${this.storage ? this.storage : 'in memory'}`);
    } catch (err) {
      this.logger.error('unable to connect to the database', err);
      throw err;
    }

    if (isNewDb) {
      await this.sequelize.query(`PRAGMA user_version=${DB.VERSION};`);
    }

    // version is useful for tracking migrations & upgrades to the xud database when
    // the database schema is modified or restructured
    let version: number;
    const userVersionPragma = await this.sequelize.query('PRAGMA user_version;');
    assert(Array.isArray(userVersionPragma) && Array.isArray(userVersionPragma[0]));
    const userVersion = userVersionPragma[0][0].user_version;
    assert(typeof userVersion === 'number');
    version = userVersion;
    this.logger.trace(`db version is ${version}`);

    if (version <= DB.VERSION) {
      // if our db is not the latest version, we call each migration procedure necessary
      // to bring us from our current version up to the latest version.
      for (let n = version; n < DB.VERSION; n += 1) {
        this.logger.info(`migrating db from version ${n} to version ${n + 1}`);
        await migrations[n](this.sequelize);
        await this.sequelize.query(`PRAGMA user_version=${n + 1};`);
        this.logger.info(`migration to version ${n + 1} complete`);
      }
    }

    const { Node, Currency, Pair, ReputationEvent, SwapDeal, Order, Trade, Password } = this.models;
    // sync schemas with the database in phases, according to FKs dependencies
    await Promise.all([Node.sync(), Currency.sync(), Password.sync()]);

    // Pair is dependent on Currency, ReputationEvent is dependent on Node
    await Promise.all([Pair.sync(), ReputationEvent.sync()]);
    // Order is dependent on Pair
    await Promise.all([Order.sync()]);
    await Promise.all([Trade.sync(), SwapDeal.sync()]);

    if (initDb) {
      // initialize database with the seed nodes for the configured network
      const nodes = defaultNodes(network);
      if (nodes) {
        const existingNodes = await Models.Node(this.sequelize).findAll();
        const newNodes = nodes.filter(
          (node) => !existingNodes.find((n) => n.nodePubKey === node.nodePubKey),
        );

        if (newNodes.length > 0) {
          await Node.bulkCreate(newNodes);
        }
      }
      // initialize database with the default currencies for the configured network
      const currencies = defaultCurrencies(network);
      if (currencies) {
        const existingCurrencies = await Models.Currency(this.sequelize).findAll();
        const newCurrencies = currencies.filter(
          (currency) => !existingCurrencies.find((n) => n.id === currency.id),
        );

        if (newCurrencies.length > 0) {
          await Currency.bulkCreate(newCurrencies);
        }
      }

      // initialize database with the default trading pairs for the configured network
      const pairs = defaultPairs(network);
      if (pairs) {
        const existingPairs = await Models.Pair(this.sequelize).findAll();
        const newPairs = pairs.filter(
          (pair) =>
            !existingPairs.find(
              (n) => n.baseCurrency === pair.baseCurrency && n.quoteCurrency === pair.quoteCurrency,
            ),
        );

        if (newPairs.length > 0) {
          await Pair.bulkCreate(newPairs);
        }
      }
    }
  };

  /**
   * Checks whether the database is new, in other words whether we are not
   * loading a preexisting database from disk.
   */
  private isNewDb = async () => {
    if (this.storage && this.storage !== ':memory:') {
      // check if database file exists
      try {
        await fs.access(this.storage);
        return false;
      } catch (err) {
        if (err.code !== 'ENOENT') {
          // we ignore errors due to file not existing, otherwise throw
          throw err;
        }
      }
    }
    return true;
  };

  public close = () => {
    return this.sequelize.close();
  };
}

export default DB;
export { Models };
