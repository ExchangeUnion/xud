import fs from 'fs';
import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge } from './utils/utils';
import { PoolConfig } from './p2p/Pool';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { DBConfig } from './db/DB';
import { OrderBookConfig } from './orderbook/OrderBook';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public db: DBConfig;
  public testDb: DBConfig;
  public rpc: any;
  public lnd: LndClientConfig;
  public raiden: RaidenClientConfig;
  public orderbook: OrderBookConfig;
  public webproxy: any;

  constructor(private args?: object) {
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
      password: undefined,
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
    this.webproxy = {
      disable: true,
      port: 8887,
    };
    this.lnd = {
      disable: false,
      datadir: lndDatadir,
      certpath: path.join(lndDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDatadir, 'admin.macaroon'),
      host: 'localhost',
      port: 10009,
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
    };
    this.orderbook = {
      internalmatching: true,
    };
  }

  public async load() {
    if (!fs.existsSync(this.xudir)) {
      fs.mkdirSync(this.xudir);
    } else if (fs.existsSync(`${this.xudir}xud.conf`)) {
      const configText = fs.readFileSync(`${this.xudir}xud.conf`, 'utf8');
      try {
        const props = toml.parse(configText);

        // merge parsed json properties from config file to this config object
        deepMerge(this, props);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column
        }: ${e.message}`);
      }
    }

    if (this.args) {
      // override our config file with command line arguments
      deepMerge(this, this.args);
      this.args = undefined;
    }
  }
}

export default Config;
