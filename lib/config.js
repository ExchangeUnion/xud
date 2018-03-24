const fs = require('fs');
const toml = require('toml');
const util = require('./utils/util');


class Config {
  constructor(args) {
    this.args = args || null;
    if (process.env.APPDATA) {
      // windows
      const homeDir = process.env.LOCALAPPDATA;
      this.xuDir = `${homeDir}/XUnion/`;
      this.lndDir = `${homeDir}/Lnd/`; // default lnd directory location
    } else {
      // linux
      const homeDir = process.env.HOME;
      this.xuDir = `${homeDir}/.xunion/`;
      this.lndDir = `${homeDir}/.lnd/`; // default lnd directory location
    }

    // default configuration
    this.p2p = {
      listen: true,
      peerPort: 8885, // X = 88, U = 85 in ASCII
    };
    this.db = {
      host: 'localhost',
      port: 3306,
      username: 'xunion',
      password: null,
      database: 'xunion',
      dialect: 'mysql',
      pool: { max: 100 },
    };
    this.rpcPort = 8886;
  }

  async load() {
    if (!fs.existsSync(this.xuDir)) {
      fs.mkdirSync(this.xuDir);
    } else if (fs.existsSync(`${this.xuDir}xunion.conf`)) {
      const configText = fs.readFileSync(`${this.xuDir}xunion.conf`);
      try {
        const props = toml.parse(configText);

        // copy parsed json properties from config file to this config object
        util.copyObject(props, this);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column
        }: ${e.message}`);
      }
      if (this.args) {
        // override our config file with command line arguments
        util.copyObject(this.args, this);
        this.args = null;
      }
    }
  }

  get(key) {
    return this.props[key];
  }
}

module.exports = Config;
