import fs from 'fs';
import path from 'path';
import assert from 'assert';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';

import Logger from '../Logger';
import { db } from '../types';

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
  Host: Sequelize.Model<db.HostInstance, db.HostAttributes>;
  BannedHost: Sequelize.Model<db.BannedHostInstance, db.BannedHostAttributes>;
  Currency: Sequelize.Model<db.CurrencyInstance, db.CurrencyAttributes>;
  Pair: Sequelize.Model<db.PairInstance, db.PairAttributes>;
};

class DB {
  public sequelize!: Sequelize.Sequelize;
  public models!: Models;
  private logger: Logger = Logger.db;

  constructor(private config: DBConfig) {
    assert(Number.isInteger(config.port) && config.port > 1023 && config.port < 65536, 'port must be an integer between 1024 and 65535');

    this.sequelize = this.createSequelizeInstance(this.config);
    this.models = this.loadModels();
  }

  private static isDbDoesNotExistError(err: Error): boolean {
    return err instanceof Sequelize.ConnectionError && (<any>err).original.code === 'ER_BAD_DB_ERROR';
  }

  public init = async (): Promise<void> => {
    try {
      await this.sequelize.authenticate();
      const { host, port, database } = this.config;
      this.logger.info(`connected to database. host:${host} port:${port} database:${database}`);
    } catch (err) {
      if (DB.isDbDoesNotExistError(err)) {
        await this.createDatabase();
      } else {
        this.logger.error('unable to connect to the database', err);
        throw err;
      }
    }
    const { Host, BannedHost, Currency, Pair } = this.models;
    const options = { logging: this.logger.verbose };

    // sync schemas with the database in phases, according to FKs dependencies
    await Promise.all([
      Host.sync(options),
      BannedHost.sync(options),
      Currency.sync(options),
    ]);
    await Promise.all([
      Pair.sync(options),
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
      await this.sequelize.query('truncate table pairs', options);
      await this.sequelize.query('truncate table currencies', options);
      await this.sequelize.query('truncate table hosts', options);
      await this.sequelize.query('truncate table bannedHosts', options);
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options);
    });
  }

  private createSequelizeInstance = (config: SequelizeConfig): Sequelize.Sequelize => {
    return new Sequelize({
      ...config,
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
