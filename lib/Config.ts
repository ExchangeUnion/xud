import fs from 'fs';
import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge, isPlainObject } from './utils/utils';
import { PoolConfig } from './p2p/Pool';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { Level } from './Logger';
import { Network } from './types/enums';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public loglevel: string;
  public logpath: string;
  public network: Network;
  public rpc: { disable: boolean, host: string, port: number };
  public lndbtc: LndClientConfig;
  public lndltc: LndClientConfig;
  public raiden: RaidenClientConfig;
  public webproxy: { port: number, disable: boolean };
  public instanceid = 0;
  /** Whether to intialize a new database with default values. */
  public initdb: boolean;
  /** The file path for the database, or ':memory:' if the database should be kept in memory. */
  public dbpath: string;

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
    this.initdb = true;
    this.dbpath = this.getDefaultDbPath();
    this.loglevel = this.getDefaultLogLevel();
    this.logpath = this.getDefaultLogPath();
    this.network = Network.TestNet;

    this.p2p = {
      listen: true,
      port: 8885, // X = 88, U = 85 in ASCII
      addresses: [],
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
      cltvdelta: 144,
    };
    this.lndltc = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'admin.macaroon'),
      host: 'localhost',
      port: 10010,
      cltvdelta: 576,
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
    };
  }

  public load(args?: { [argName: string]: any }): Config {
    if (args && args.xudir) {
      this.updateDefaultPaths(args.xudir);
    }
    const configPath = path.join(this.xudir, 'xud.conf');
    if (!fs.existsSync(this.xudir)) {
      fs.mkdirSync(this.xudir);
    } else if (fs.existsSync(configPath)) {
      const configText = fs.readFileSync(configPath, 'utf8');
      try {
        const props = toml.parse(configText);

        if (props.xudir && (!args || !args.xudir)) {
          this.updateDefaultPaths(props.xudir);
        }

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

    if (!Object.values(Level).includes(this.loglevel)) {
      this.loglevel = this.getDefaultLogLevel();
    }

    this.createLogDir(this.logpath);

    return this;
  }

  private createLogDir = (logPath: string) => {
    const dir = path.dirname(logPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  /**
   * Updates the default values for all fields derived from the xu directory when a custom
   * xu directory is specified by the config file or command line arguments.
   */
  private updateDefaultPaths = (xudir: string) => {
    // if we have a custom xu directory, update the default values for all fields that are
    // derived from the xu directory.
    this.xudir = xudir;
    this.logpath = this.getDefaultLogPath();
    this.dbpath = this.getDefaultDbPath();
  }

  private getDefaultDbPath = () => {
    return path.join(this.xudir, 'xud.db');
  }

  private getDefaultLogPath = (): string => {
    return path.resolve(this.xudir, 'logs', 'xud.log');
  }

  private getDefaultLogLevel = (): string => {
    return process.env.NODE_ENV === 'production' ? Level.Info : Level.Debug;
  }
}

export default Config;
