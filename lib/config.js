const fs = require('fs');
const toml = require('toml');

class Config {
  constructor() {
    if (process.env.APPDATA) {
      // windows
      const homeDir = process.env.LOCALAPPDATA;
      this.xuDir = `${homeDir}/Xunion/`;
      this.lndDir = `${homeDir}/Lnd/`; // default lnd directory location
    } else {
      // linux
      const homeDir = process.env.HOME;
      this.xuDir = `${homeDir}/.xunion/`;
      this.lndDir = `${homeDir}/.lnd/`; // default lnd directory location
    }
    // TODO initialize default configuration
  }

  async load() {
    const configText = fs.readFileSync(`${this.xuDir}xunion.conf`);
    try {
      const props = toml.parse(configText);

      // copy parsed json properties from config file to this config object
      const propsKeys = Object.keys(props);
      for (let n = 0; n < propsKeys.length; n += 1) {
        const key = propsKeys[n];
        this[key] = props[key];
      }
    } catch (e) {
      throw new Error(`Parsing error on line ${e.line}, column ${e.column
      }: ${e.message}`);
    }
  }

  get(key) {
    return this.props[key];
  }
}

module.exports = Config;
