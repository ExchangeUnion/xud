import fs from 'fs';
import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge } from './utils/utils';
import { PoolConfig } from './p2p/Pool';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { DBConfig } from './db/DB';
import { Level } from './Logger';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public logLevel: string;
  public db: DBConfig;
  public testDb: DBConfig;
  public rpc: { disable: boolean, host: string, port: number };
  public lndbtc: LndClientConfig;
  public lndltc: LndClientConfig;
  public raiden: RaidenClientConfig;
  public webproxy: { port: number, disable: boolean };
  public instanceId = 0;
  public initDb: boolean;

  constructor() {
    const platform = os.platform();
    let lndDefaultDatadir;
    switch (platform) {
      case 'win32': { // windows
        const homeDir = process.env.LOCALAPPDATA;
        this.xudir = `${homeDir}/Xud/`;
        lndDefaultDatadir = `${homeDir}/Lnd/`;
        break;
      }
      case 'darwin': { // mac
        const homeDir = process.env.HOME;
        this.xudir = `${homeDir}/.xud/`;
        lndDefaultDatadir = `${homeDir}/Library/Application Support/Lnd/`;
        break;
      }
      default: { // linux
        const homeDir = process.env.HOME;
        this.xudir = `${homeDir}/.xud/`;
        lndDefaultDatadir = `${homeDir}/.lnd/`;
        break;
      }
    }

    // default configuration
    this.initDb = true;
    this.logLevel = this.getDefaultLogLevel();
    this.p2p = {
      listen: true,
      port: 8885, // X = 88, U = 85 in ASCII
      addresses: [],
    };
    this.db = {
      host: 'localhost',
      port: 3306,
      username: 'xud',
      database: 'xud',
    };
    this.testDb = {
      ...this.db,
      database: 'xud_test',
    };
    this.rpc = {
      disable: false,
      host: 'localhost',
      port: 8886,
    };
    this.webproxy = {
      disable: true,
      port: 8080,
    };
    this.lndbtc = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'admin.macaroon'),
      host: 'localhost',
      port: 10009,
    };
    this.lndltc = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'admin.macaroon'),
      host: 'localhost',
      port: 10010,
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
    };
  }

  public load(args?: { [argName: string]: any }): Config {
    if (args && args['xudir']) {
      this.xudir = args['xudir'];
    }

    const configPath = path.join(this.xudir, 'xud.conf');
    if (!fs.existsSync(this.xudir)) {
      fs.mkdirSync(this.xudir);
    } else if (fs.existsSync(configPath)) {
      const configText = fs.readFileSync(configPath, 'utf8');
      try {
        const props = toml.parse(configText);

        // merge parsed json properties from config file to the default config
        deepMerge(this, props);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
      }
    }

    if (args) {
      // override our config file with command line arguments
      deepMerge(this, args);
    }

    if (!Object.values(Level).includes(this.logLevel)) {
      this.logLevel = this.getDefaultLogLevel();
    }

    return this;
  }

  private getDefaultLogLevel = (): string => {
    return process.env.NODE_ENV === 'production' ? Level.INFO : Level.DEBUG;
  }
}

export default Config;
