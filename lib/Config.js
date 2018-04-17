const fs = require('fs');
const os = require('os');
const toml = require('toml');
const util = require('./utils/utils');
const enums = require('./constants/enums');


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
    this.p2p = {
      listen: true,
      port: 8885, // X = 88, U = 85 in ASCII
    };
    this.db = {
      host: 'localhost',
      port: 3306,
      username: 'xud',
      password: null,
      database: 'xud',
      dialect: 'mysql',
      pool: { max: 100 },
      operatorsAliases: false,
    };
    this.testDb = {
      ...this.db,
      database: 'xud_test',
    };
    this.rpcPort = 8886;
    this.swapProtocols = {
      [enums.swapProtocols.LND]: {
        disable: false,
        datadir: lndDatadir,
        rpcProtoPath: 'lndrpc.proto',
      },
      [enums.swapProtocols.RAIDEN]: {
        disable: false,
        port: 5001,
      },
    };
  }

  async load() {
    if (!fs.existsSync(this.xuDir)) {
      fs.mkdirSync(this.xuDir);
    } else if (fs.existsSync(`${this.xuDir}xud.conf`)) {
      const configText = fs.readFileSync(`${this.xuDir}xud.conf`);
      try {
        const props = toml.parse(configText);

        // copy parsed json properties from config file to this config object
        util.copyObject(props, this);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column
        }: ${e.message}`);
      }
    }

    if (this.args) {
      // override our config file with command line arguments
      util.copyObject(this.args, this);
      this.args = null;
    }
  }

  get(key) {
    return this.props[key];
  }

  isLndEnabled() {
    return this.swapProtocols[enums.swapProtocols.LND].enable;
  }

  isRaidenEnabled() {
    return this.swapProtocols[enums.swapProtocols.RAIDEN].enable;
  }
}

module.exports = Config;
