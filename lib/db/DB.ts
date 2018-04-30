import fs from 'fs';
import path from 'path';
import assert from 'assert';
import Sequelize from 'sequelize';

import Logger from '../Logger';

class DB {
  models: any;
  logger: any;
  sequelize: Sequelize;

  constructor(options) {
    assert(typeof options.database === 'string', 'database name must be a string');
    assert(typeof options.username === 'string', 'username name must be a string');
    assert(typeof options.host === 'string', 'host name must be a string');
    assert(Number.isInteger(options.port) && options.port > 1023 && options.port < 65536, 'port must be an integer between 1024 and 65535');

    this.logger = Logger.global;
    this.sequelize = new Sequelize({
      ...options,
      operatorsAliases: false,
      dialectOptions: {
        multipleStatements: true,
      },
    });
    this.importModels();
  }

  importModels() {
    this.models = {};
    const modelsFolder = path.join(__dirname, 'models');
    fs.readdirSync(modelsFolder)
      .filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
      .forEach((file) => {
        const model = this.sequelize.import(path.join(modelsFolder, file));
        this.models[model.name] = model;
      });

    Object.keys(this.models).forEach((modelName) => {
      const model = this.models[modelName];
      if (model.defineAssociations) {
        model.defineAssociations(this.models);
      }
    });
  }

  async init() {
    try {
      await this.sequelize.authenticate();
      const { host, port, database } = this.sequelize.config;
      const { dialectName } = this.sequelize.connectionManager;
      this.logger.info(`connected to database. host:${host} port:${port} database:${database} dialect:${dialectName}`);
    } catch (err) {
      this.logger.error('unable to connect to the database', err);
      throw err;
    }
    const {
      Peer, Currency, Pair, Order,
    } = this.models;

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

  getModels() {
    return this.models;
  }

  close() {
    return this.sequelize.close();
  }

  dropTables() {
    return this.sequelize.drop();
  }

  async truncate() {
    await this.sequelize.transaction(async (t) => {
      const options = { raw: true, transaction: t };
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, options);
      await this.sequelize.query('truncate table orders', null, options);
      await this.sequelize.query('truncate table pairs', null, options);
      await this.sequelize.query('truncate table currencies', null, options);
      await this.sequelize.query('truncate table peers', null, options);
      await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, options);
    });
  }
}

export default DB;
