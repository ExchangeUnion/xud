import fs from 'fs';
import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge } from './utils/utils';
import { PoolConfig } from './p2p/Pool';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { DBConfig } from './db/DB';
import { Arguments } from 'yargs';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public db: DBConfig;
  public testDb: DBConfig;
  public rpc: { host: string, port: number };
  public lnd: LndClientConfig;
  public raiden: RaidenClientConfig;
  public webproxy: { port: number, disable: boolean };

  constructor(private args?: Arguments) {
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
    this.p2p = {
      listen: true,
      port: 8885, // X = 88, U = 85 in ASCII
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
      host: 'localhost',
      port: 8886,
    };
    this.webproxy = {
      disable: true,
      port: 8080,
    };
    this.lnd = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'admin.macaroon'),
      host: 'localhost',
      port: 10009,
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
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
        throw new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
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
