import fs from 'fs';
import path from 'path';
import assert from 'assert';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';

import Logger from '../Logger';
import { db } from '../types';
import { SwapClients } from '../types/enums';

type Models = {
  Node: Sequelize.Model<db.NodeInstance, db.NodeAttributes>;
  Currency: Sequelize.Model<db.CurrencyInstance, db.CurrencyAttributes>;
  Pair: Sequelize.Model<db.PairInstance, db.PairAttributes>;
};

/** A class representing a connection to a SQL database. */
class DB {
  public sequelize: Sequelize.Sequelize;
  public models: Models;

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
    this.models = this.loadModels();
  }

  /**
   * Initialize the connection to the database.
   * @param initDb whether to intialize a new database with default values if no database exists
   */
  public init = async (initDb = false): Promise<void> => {
    const newDb = !this.storage || !fs.existsSync(this.storage);
    try {
      await this.sequelize.authenticate();
      this.logger.info(`connected to database ${this.storage ? this.storage : 'in memory'}`);
    } catch (err) {
      this.logger.error('unable to connect to the database', err);
      throw err;
    }
    const { Node, Currency, Pair } = this.models;
    // sync schemas with the database in phases, according to FKs dependencies
    await Promise.all([
      Node.sync(),
      Currency.sync(),
    ]);
    await Promise.all([
      Pair.sync(),
    ]);

    if (newDb && initDb) {
      // populate new databases with default data
      // TODO: make seed peers configurable
      await Node.bulkCreate(<db.NodeAttributes[]>[
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
      ]);

      await Currency.bulkCreate(<db.CurrencyAttributes[]>[
        { id: 'BTC', swapClient: SwapClients.LND, decimalPlaces: 8 },
        { id: 'LTC', swapClient: SwapClients.LND, decimalPlaces: 8 },
        { id: 'ZRX', swapClient: SwapClients.RAIDEN, decimalPlaces: 18 },
        { id: 'GNT', swapClient: SwapClients.RAIDEN, decimalPlaces: 18 },
      ]);

      await Pair.bulkCreate(<db.PairAttributes[]>[
        { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
        { baseCurrency: 'ZRX', quoteCurrency: 'GNT' },
      ]);
    }
  }

  public close = (): Bluebird<void> => {
    return this.sequelize.close();
  }

  public dropTables = (): Bluebird<void> => {
    return this.sequelize.drop();
  }

  private loadModels = (): Models => {
    const models: { [index: string]: Sequelize.Model<any, any> } = {};
    const modelsFolder = path.join(__dirname, 'models');
    fs.readdirSync(modelsFolder)
      .filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3).match(/.js|.ts/)))
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
