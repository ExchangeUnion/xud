const Sequelize = require('sequelize');
const Logger = require('../Logger');
const assert = require('assert');

class DB {
  constructor(options) {
    assert(typeof options.database === 'string', 'database name must be a string');
    assert(typeof options.username === 'string', 'username name must be a string');
    assert(typeof options.host === 'string', 'host name must be a string');
    assert(Number.isInteger(options.port) && options.port > 1023 && options.port < 65536, 'port must be an integer between 1024 and 65535');

    this.sequelize = new Sequelize(options);
    this.define();

    this.logger = Logger.global;
  }

  define() {
    this.Order = this.sequelize.define('order', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      peerId: Sequelize.INTEGER,
      invoice: Sequelize.STRING,
      quantity: Sequelize.DECIMAL(14, 8),
      price: Sequelize.DECIMAL(9, 8),
    });

    this.Peer = this.sequelize.define('peer', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nodeKey: { type: Sequelize.STRING, unique: true },
      ipv4: Sequelize.STRING(15),
      port: Sequelize.SMALLINT,
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

    // sync schemas with the database
    const options = { logging: this.logger.info };
    await Promise.all([
      this.Order.sync(options),
      this.Peer.sync(options),
    ]);
  }
}

module.exports = DB;
