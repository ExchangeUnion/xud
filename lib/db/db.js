const Sequelize = require('sequelize');
const logger = require('winston');
const assert = require('assert');

class DB {
  constructor(options) {
    assert(typeof options.database === 'string', 'database name must be a string');
    assert(typeof options.username === 'string', 'username name must be a string');
    assert(typeof options.host === 'string', 'host name must be a string');
    assert(Number.isInteger(options.port) && options.port > 1023 && options.port < 65536, 'port must be an integer between 1024 and 65535');

    this.sequelize = new Sequelize(options);
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
      logger.info('connected to database');
    } catch (err) {
      logger.error('unable to connect to the database: ', err);
    }

    // sync schemas with the database
    await Promise.all([
      this.Order.sync({ alter: true }),
      this.Peer.sync({ alter: true }),
    ]);
  }
}

module.exports = DB;
