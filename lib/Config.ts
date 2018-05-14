import fs from 'fs';
import os from 'os';
import path from 'path';
import toml from 'toml';
import utils from './utils/utils';
import { PoolConfig } from './p2p/Pool';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { DBConfig } from './db/DB';

class Config {
  args?: object;
  p2p: PoolConfig;
  xudir: string;
  db: DBConfig;
  testDb: any;
  rpc: any;
  lnd: LndClientConfig;
  raiden: RaidenClientConfig;

  constructor(args) {
    this.args = args || undefined;
    const platform = os.platform();
    let lndDatadir;
    switch (platform) {
      case 'win32': { // windows
        const homeDir = process.env.LOCALAPPDATA;
        this.xudir = `${homeDir}/Xud/`;
        lndDatadir = `${homeDir}/Lnd/`; // default lnd directory location
        break;
      }
      case 'darwin': { // mac
        const homeDir = process.env.HOME;
        this.xudir = `${homeDir}/.xud/`;
        lndDatadir = `${homeDir}/Library/Application Support/Lnd/`;
        break;
      }
      default: { // linux
        const homeDir = process.env.HOME;
        this.xudir = `${homeDir}/.xud/`;
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
    this.lnd = {
      disable: false,
      datadir: lndDatadir,
      certificate: path.join(lndDatadir, 'tls.cert'),
      host: '127.0.0.1:10009',
      macaroon: path.join(lndDatadir, 'admin.macaroon'),
      rpcprotopath: 'lndrpc.proto',
    };
    this.raiden = {
      disable: false,
      port: 5001,
    };
  }

  async load() {
    if (!fs.existsSync(this.xudir)) {
      fs.mkdirSync(this.xudir);
    } else if (fs.existsSync(`${this.xudir}xud.conf`)) {
      const configText: any = fs.readFileSync(`${this.xudir}xud.conf`);
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
