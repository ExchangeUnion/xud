import fs from 'fs';
import path from 'path';
import assert from 'assert';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';

import Logger from '../Logger';
import { db } from '../types';
import { SwapProtocol } from '../types/enums';

type SequelizeConfig = {
  host: string;
  port: number;
  username: string;
  password?: string;
  database?: string;
};

type DBConfig = SequelizeConfig & {
  database: string;
};

type Models = {
  Node: Sequelize.Model<db.NodeInstance, db.NodeAttributes>;
  Currency: Sequelize.Model<db.CurrencyInstance, db.CurrencyAttributes>;
  Pair: Sequelize.Model<db.PairInstance, db.PairAttributes>;
};

/** A class representing a connection to a SQL database. */
class DB {
  public sequelize: Sequelize.Sequelize;
  public models: Models;

  constructor(private config: DBConfig, private logger: Logger) {
    assert(Number.isInteger(config.port) && config.port > 1023 && config.port < 65536, 'port must be an integer between 1024 and 65535');

    this.sequelize = this.createSequelizeInstance(this.config);
    this.models = this.loadModels();
  }

  private static isDbDoesNotExistError(err: Error): boolean {
    return err instanceof Sequelize.ConnectionError && (<any>err).original.code === 'ER_BAD_DB_ERROR';
  }

  public init = async (): Promise<void> => {
    let newDb = false;
    try {
      await this.sequelize.authenticate();
      const { host, port, database } = this.config;
      this.logger.info(`connected to database. host:${host} port:${port} database:${database}`);
    } catch (err) {
      if (DB.isDbDoesNotExistError(err)) {
        newDb = true;
        await this.createDatabase();
      } else {
        this.logger.error('unable to connect to the database', err);
        throw err;
      }
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

    if (newDb) {
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
        { id: 'BTC' },
        { id: 'LTC' },
        { id: 'ZRX' },
        { id: 'GNT' },
      ]);

      await Pair.bulkCreate(<db.PairAttributes[]>[
        { baseCurrency: 'LTC', quoteCurrency: 'BTC', swapProtocol: SwapProtocol.LND },
        { baseCurrency: 'ZRX', quoteCurrency: 'GNT', swapProtocol: SwapProtocol.RAIDEN },
      ]);
    }
  }

  public close = (): Bluebird<void> => {
    return this.sequelize.close();
  }

  public dropTables = (): Bluebird<void> => {
    return this.sequelize.drop();
  }

  public truncate = async (): Promise<void> => {
    await this.sequelize.transaction(async (t) => {
      const options = { raw: true, transaction: t };
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options);
      await this.sequelize.query('truncate table pairs', options);
      await this.sequelize.query('truncate table currencies', options);
      await this.sequelize.query('truncate table nodes', options);
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options);
    });
  }

  private createSequelizeInstance = (config: SequelizeConfig): Sequelize.Sequelize => {
    return new Sequelize({
      ...config,
      logging: this.logger.trace,
      dialect: 'mysql',
      operatorsAliases: false,
      dialectOptions: {
        multipleStatements: true,
      },
    });
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

  private createDatabase = async (): Promise<void> => {
    try {
      const { database, ...databaselessConfig } = this.config;
      const sequelize = this.createSequelizeInstance(databaselessConfig);
      await sequelize.authenticate();
      await sequelize.query(`CREATE DATABASE ${database} CHARACTER SET utf8 COLLATE utf8_general_ci;`);
      await sequelize.close();
    } catch (err) {
      this.logger.error('unable to create the database', err);
      throw err;
    }
  }
}

export default DB;
export { DBConfig, Models };
