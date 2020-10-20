import { derivePairId } from '../utils/utils';
import { ModelCtor, Sequelize } from 'sequelize';
import { XuNetwork } from '../constants/enums';
import { defaultCurrencies, defaultNodes, defaultPairs } from '../db/seeds';
import Logger from '../Logger';
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

  models.Pair.beforeBulkCreate(pairs => pairs.forEach(pair => pair.id = derivePairId(pair)));
  models.Pair.beforeCreate((pair) => { pair.id = derivePairId(pair); });

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

    if (initDb) {
      // initialize database with the seed nodes for the configured network
      const nodes = defaultNodes(network);
      if (nodes) {
        const existingNodes = await Models.Node(this.sequelize).findAll();
        const newNodes = nodes.filter(node => (!existingNodes.find(n => (n.nodePubKey === node.nodePubKey))));

        if (newNodes.length > 0) {
          await Node.bulkCreate(newNodes);
        }
      }
      // initialize database with the default currencies for the configured network
      const currencies = defaultCurrencies(network);
      if (currencies) {
        const existingCurrencies = await Models.Currency(this.sequelize).findAll();
        const newCurrencies = currencies.filter(currency => (!existingCurrencies.find(n => (n.id === currency.id))));

        if (newCurrencies.length > 0) {
          await Currency.bulkCreate(newCurrencies);
        }
      }

      // initialize database with the default trading pairs for the configured network
      const pairs = defaultPairs(network);
      if (pairs) {
        const existingPairs = await Models.Pair(this.sequelize).findAll();
        const newPairs = pairs.filter(pair => (!existingPairs.find(n => (n.baseCurrency === pair.baseCurrency &&
            n.quoteCurrency === pair.quoteCurrency))));

        if (newPairs.length > 0) {
          await Pair.bulkCreate(newPairs);
        }
      }
    }
  }

  public close = () => {
    return this.sequelize.close();
  }
}

export default DB;
export { Models };
