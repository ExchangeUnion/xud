import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge } from './utils/utils';
import { exists, mkdir, readFile } from './utils/fsUtils';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { Level } from './Logger';
import { Network } from './constants/enums';
import { PoolConfig } from './p2p/types';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public loglevel: string;
  public logpath: string;
  public logdateformat: string;
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
  /** Whether matching will be disabled */
  public nomatching: boolean;

  constructor() {
    const platform = os.platform();
    let lndDefaultDatadir;
    switch (platform) {
      case 'win32': { // windows
        const homeDir = process.env.LOCALAPPDATA!;
        this.xudir = path.join(homeDir, 'Xud');
        lndDefaultDatadir = path.join(homeDir, 'Lnd');
        break;
      }
      case 'darwin': { // mac
        const homeDir = process.env.HOME!;
        this.xudir = path.join(homeDir, '.xud');
        lndDefaultDatadir = path.join(homeDir, 'Library', 'Application Support', 'Lnd');
        break;
      }
      default: { // linux
        const homeDir = process.env.HOME!;
        this.xudir = path.join(homeDir, '.xud');
        lndDefaultDatadir = path.join(homeDir, '.lnd');
        break;
      }
    }

    // default configuration
    this.initdb = true;
    this.dbpath = this.getDefaultDbPath();
    this.nomatching = false;
    this.loglevel = this.getDefaultLogLevel();
    this.logpath = this.getDefaultLogPath();
    this.logdateformat = 'DD/MM/YYYY HH:mm:ss.SSS';
    this.network = Network.TestNet;

    this.p2p = {
      listen: true,
      discover: true,
      discoverminutes: 60 * 12, // 12 hours
      detectexternalip: false,
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
      macaroonpath: path.join(lndDefaultDatadir, 'data', 'chain', 'bitcoin', this.network, 'admin.macaroon'),
      host: 'localhost',
      port: 10009,
      cltvdelta: 144,
      nomacaroons: false,
    };
    this.lndltc = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'data', 'chain', 'litecoin',
        this.network === Network.TestNet ? 'testnet4' : this.network, 'admin.macaroon'),
      host: 'localhost',
      port: 10010,
      cltvdelta: 576,
      nomacaroons: false,
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
    };
  }

  public load = async (args?: { [argName: string]: any }): Promise<Config> => {
    if (args) {
      if (args.xudir) {
        this.updateDefaultPaths(args.xudir);
      }
      if (args.network) {
        this.updateMacaroonPaths(args.network);
      }
    }
    const configPath = path.join(this.xudir, 'xud.conf');
    if (!(await exists(this.xudir))) {
      await mkdir(this.xudir);
    } else if (await exists(configPath)) {
      const configText = await readFile(configPath, 'utf8');
      try {
        const props = toml.parse(configText);

        if (props.xudir && (!args || !args.xudir)) {
          this.updateDefaultPaths(props.xudir);
        }

        if (props.network !== undefined && (!args || !args.network)) {
          // first check that network is a valid value
          if (typeof props.network !== 'string' || !Object.values(Network).includes(props.network)) {
            // delete the invalid network value
            delete props.network;
          } else {
            this.updateMacaroonPaths(props.network);
          }
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

    await this.createLogDir(this.logpath);

    return this;
  }

  private createLogDir = async (logPath: string) => {
    const dir = path.dirname(logPath);

    if (!(await exists(dir))) {
      await mkdir(dir);
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

  private updateMacaroonPaths = (network: string) => {
    this.network = network as Network;
    this.lndbtc.macaroonpath = path.join(this.lndbtc.macaroonpath, '..', '..', this.network, 'admin.macaroon');
    this.lndltc.macaroonpath = path.join(this.lndltc.macaroonpath, '..', '..',
      this.network === Network.TestNet ? 'testnet4' : this.network, 'admin.macaroon');
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
