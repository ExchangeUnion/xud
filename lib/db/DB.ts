import fs from 'fs';
import path from 'path';
import assert from 'assert';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';

import Logger from '../Logger';
import { db } from '../types';

type DBConfig = {
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
  dialect: string;
};

type Models = {
  Currency: Sequelize.Model<db.CurrencyInstance, db.CurrencyAttributes>;
  Peer: Sequelize.Model<db.PeerInstance, db.PeerAttributes>;
  Order: Sequelize.Model<db.OrderInstance, db.OrderAttributes>;
  Pair: Sequelize.Model<db.PairInstance, db.PairAttributes>;
};

class DB {
  public sequelize!: Sequelize.Sequelize;
  public models!: Models;
  private logger: Logger = Logger.global;

  constructor(private config: DBConfig) {
    assert(Number.isInteger(config.port) && config.port > 1023 && config.port < 65536, 'port must be an integer between 1024 and 65535');

    this.sequelize = this.createSequelizeInstance(this.config);
    this.models = this.loadModels();
  }

  static isDbDoesNotExistsError(err: Error): boolean {
    return err instanceof Sequelize.ConnectionError && (<any>err).original.code === 'ER_BAD_DB_ERROR';
  }

  public init = async (): Promise<void> => {
    try {
      await this.sequelize.authenticate();
      const { host, port, database, dialect } = this.config;
      this.logger.info(`connected to database. host:${host} port:${port} database:${database} dialect:${dialect}`);
    } catch (err) {
      if (DB.isDbDoesNotExistsError(err)) {
        await this.createDatabase();
      } else {
        this.logger.error('unable to connect to the database', err);
        throw err;
      }
    }
    const { Peer, Currency, Pair, Order } = this.models;
    const options = { logging: this.logger.verbose };

    // sync schemas with the database in phases, according to FKs dependencies
    await Promise.all([
      Peer.sync(options),
      Currency.sync(options),
    ]);
    await Promise.all([
      Pair.sync(options),
    ]);
    await Promise.all([
      Order.sync(options),
    ]);
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
      await this.sequelize.query('truncate table orders', options);
      await this.sequelize.query('truncate table pairs', options);
      await this.sequelize.query('truncate table currencies', options);
      await this.sequelize.query('truncate table peers', options);
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options);
    });
  }

  private createSequelizeInstance = (config: DBConfig|any): Sequelize.Sequelize => {
    return new Sequelize({
      ...config,
      operatorsAliases: false,
      dialectOptions: {
        multipleStatements: true,
      },
    });
  }

  private loadModels(): Models {
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
export { DBConfig };
