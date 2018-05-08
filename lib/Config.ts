import fs from 'fs';
import os from 'os';
import toml from 'toml';
import utils from './utils/utils';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { DBConfig } from './db/DB';

class Config {
  args?: object;
  xuDir: string;
  p2p: any;
  db: DBConfig;
  testDb: any;
  rpc: any;
  api: any;
  lnd: LndClientConfig;
  raiden: RaidenClientConfig;

  constructor(args) {
    this.args = args || undefined;
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
      port: 32768,
      username: 'xud',
      password: 'xud',
      database: 'xud',
      dialect: 'mysql',
    };
    this.testDb = {
      ...this.db,
      database: 'xud_test',
    };
    this.rpc = {
      port: 8886,
    };
    this.api = {
      listen: false,
      port: 8887,
    };
    this.lnd = {
      disable: false,
      datadir: lndDatadir,
      host: 'localhost',
      port: 10009,
      rpcprotopath: 'lndrpc.proto',
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
    };
  }

  async load() {
    if (!fs.existsSync(this.xuDir)) {
      fs.mkdirSync(this.xuDir);
    } else if (fs.existsSync(`${this.xuDir}xud.conf`)) {
      const configText: any = fs.readFileSync(`${this.xuDir}xud.conf`);
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
      this.args = undefined;
    }
  }
}

export default Config;
