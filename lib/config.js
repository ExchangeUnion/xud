const fs = require('fs');
const toml = require('toml');

function copyObject(source, dest) {
  const sourceKeys = Object.keys(source);
  for (let n = 0; n < sourceKeys.length; n += 1) {
    const key = sourceKeys[n];
    if (typeof dest[key] !== 'object' || Array.isArray(dest[key])) {
      copyObject(source[key], dest[key]);
    } else {
      dest[key] = source[key]; // eslint-disable-line no-param-reassign
    }
  }
}

class Config {
  constructor() {
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
        copyObject(props, this);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column
        }: ${e.message}`);
      }
    }
  }

  get(key) {
    return this.props[key];
  }
}

module.exports = Config;
