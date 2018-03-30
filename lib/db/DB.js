const Sequelize = require('sequelize');
const assert = require('assert');
const Logger = require('../Logger');
const enums = require('../constants/enums');

const { DataTypes } = Sequelize;

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
    // P2P

    this.Peer = this.sequelize.define('peer', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nodeKey: { type: DataTypes.STRING, unique: true },
      ipv4: DataTypes.STRING(15),
      port: DataTypes.SMALLINT,
    });

    // DOB

    this.Currency = this.sequelize.define('currency', {
      id: { type: DataTypes.STRING, primaryKey: true },
    });

    //

    this.Pair = this.sequelize.define('pair', {
      id: { type: DataTypes.STRING, primaryKey: true },
      baseCurrency: { type: DataTypes.STRING, allowNull: false },
      quoteCurrency: { type: DataTypes.STRING, allowNull: false },
      swapProtocol: {
        type: DataTypes.ENUM, values: Object.values(enums.swapProtocols), allowNull: true,
      },
    });

    this.Pair.belongsTo(this.Currency, {
      foreignKey: 'baseCurrency',
    });
    this.Pair.belongsTo(this.Currency, {
      foreignKey: 'quoteCurrency',
    });
    const derivePairId = (pair) => {
      pair.id = `${pair.baseCurrency}/${pair.quoteCurrency}`; // eslint-disable-line no-param-reassign
    };
    this.Pair.beforeBulkCreate(pairs => pairs.forEach(pair => derivePairId(pair)));
    this.Pair.beforeCreate(pair => derivePairId(pair));

    //

    this.Order = this.sequelize.define('order', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      pairId: { type: DataTypes.STRING, allowNull: false },
      peerId: { type: DataTypes.INTEGER, allowNull: true },
      quantity: DataTypes.DECIMAL(14, 8),
      price: DataTypes.DECIMAL(14, 8),
    });
    this.Order.belongsTo(this.Pair, {
      foreignKey: 'pairId',
    });
    this.Order.belongsTo(this.Peer, {
      foreignKey: 'peerId',
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
      this.Peer.sync(options),
      this.Currency.sync(options),
    ]);

    await Promise.all([
      this.Pair.sync(options),
      this.Order.sync(options),
    ]);
  }

  close() {
    return this.sequelize.close();
  }

  dropTables() {
    return this.sequelize.drop();
  }
}

module.exports = DB;
