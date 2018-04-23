const fs = require('fs');
const os = require('os');
const toml = require('toml');
const utils = require('./utils/utils');

class Config {
  constructor(args) {
    this.args = args || null;
    const platform = os.platform();
    let lndDatadir;
    switch (platform) {
      case 'win32': { // windows
        const homeDir = process.env.LOCALAPPDATA;
        this.xuDir = `${homeDir}/Xud/`;
        lndDatadir = `${homeDir}/Lnd/`; // default lnd directory location
        break;
      }
      case 'darwin': { // mac
        const homeDir = process.env.HOME;
        this.xuDir = `${homeDir}/.xud/`;
        lndDatadir = `${homeDir}/Library/Application Support/Lnd/`;
        break;
      }
      default: { // linux
        const homeDir = process.env.HOME;
        this.xuDir = `${homeDir}/.xud/`;
        lndDatadir = `${homeDir}/.lnd/`;
        break;
      }
    }

    // default configuration
    let dbhost = 'localhost';
    let dbport = 3306;
    let dbuser = 'xud';
    let dbname = 'xud';
    let dbpass = null;
    if (process.env.DB_HOST !== '') {
      dbhost = process.env.DB_HOST;
    }
    if (process.env.DB_PORT !== null) {
      dbport = parseInt(process.env.DB_PORT, 10);
    }
    if (process.env.DB_USER !== '') {
      dbuser = process.env.DB_USER;
    }
    if (process.env.DB_NAME !== '') {
      dbname = process.env.DB_NAME;
    }
    if (process.env.DB_PASSWORD !== null) {
      dbpass = process.env.DB_PASSWORD;
    }
    this.p2p = {
      listen: true,
      port: 8885, // X = 88, U = 85 in ASCII
    };
    this.db = {
      host: dbhost,
      port: dbport,
      username: dbuser,
      password: dbpass,
      database: dbname,
      dialect: 'mysql',
      operatorsAliases: false,
    };
    this.testDb = {
      ...this.db,
      database: 'xud_test',
    };
    this.rpcPort = 8886;
    this.lnd = {
      disable: false,
      datadir: lndDatadir,
      rpcprotopath: 'lndrpc.proto',
    };
    this.raiden = {
      disable: false,
      port: 5001,
    };
  }

  async load() {
    if (!fs.existsSync(this.xuDir)) {
      fs.mkdirSync(this.xuDir);
    } else if (fs.existsSync(`${this.xuDir}xud.conf`)) {
      const configText = fs.readFileSync(`${this.xuDir}xud.conf`);
      try {
        const props = toml.parse(configText);

        // merge parsed json properties from config file to this config object
        utils.deepMerge(this, props);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column
        }: ${e.message}`);
      }
    }

    if (this.args) {
      // override our config file with command line arguments
      utils.deepMerge(this, this.args);
      this.args = null;
    }
  }

  get(key) {
    return this.props[key];
  }
}

module.exports = Config;
