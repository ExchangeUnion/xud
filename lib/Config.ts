import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge } from './utils/utils';
import { exists, mkdir, readFile } from './utils/fsUtils';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { Level } from './Logger';
import { XuNetwork } from './constants/enums';
import { PoolConfig } from './p2p/types';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public loglevel: string;
  public logpath: string;
  public logdateformat: string;
  public network: XuNetwork;
  public rpc: { disable: boolean, host: string, port: number };
  public lnd: { [currency: string]: LndClientConfig | undefined } = {};
  public raiden: RaidenClientConfig;
  public webproxy: { port: number, disable: boolean };
  public instanceid = 0;
  /** Whether to intialize a new database with default values. */
  public initdb: boolean;
  /** The file path for the database, or ':memory:' if the database should be kept in memory. */
  public dbpath: string;
  /** Whether matching will be disabled */
  public nomatching: boolean;
  /**
   * Whether to disable sanity checks that verify that the orders can possibly be swapped
   * before adding them to the order book, can be enabled for testing & debugging purposes.
   */
  public nosanitychecks: boolean;

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
    this.nomatching = false;
    this.loglevel = this.getDefaultLogLevel();
    this.logpath = this.getDefaultLogPath();
    this.logdateformat = 'DD/MM/YYYY HH:mm:ss.SSS';
    this.network = this.getDefaultNetwork();
    this.dbpath = this.getDefaultDbPath();
    this.nosanitychecks = false;

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
    this.lnd.BTC = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'data', 'chain', 'bitcoin', this.network, 'admin.macaroon'),
      host: 'localhost',
      port: 10009,
      cltvdelta: 144,
      nomacaroons: false,
    };
    this.lnd.LTC = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'data', 'chain', 'litecoin',
        this.network === XuNetwork.TestNet ? 'testnet4' : this.network, 'admin.macaroon'),
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
        this.xudir = args.xudir;
        this.logpath = this.getDefaultLogPath();
      }
      this.network = this.getNetwork(args);
      this.dbpath = this.getDefaultDbPath();
      this.updateMacaroonPaths();
    }

    const configPath = path.join(this.xudir, 'xud.conf');
    if (!(await exists(this.xudir))) {
      await mkdir(this.xudir);
    } else if (await exists(configPath)) {
      const configText = await readFile(configPath, 'utf8');
      let props;
      try {
        props = toml.parse(configText);
      } catch (e) {
        throw new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`);
      }

      if (props.xudir && (!args || !args.xudir)) {
        this.xudir = props.xudir;
        this.logpath = this.getDefaultLogPath();
        this.dbpath = this.getDefaultDbPath();
      }

      if (props.network && this.network === this.getDefaultNetwork()) {
        if (![XuNetwork.MainNet, XuNetwork.TestNet, XuNetwork.SimNet, XuNetwork.RegTest].includes(props.network)) {
          throw new Error(`Invalid network config: ${props.network}`);
        }
        this.network = props.network;
        this.logpath = this.getDefaultLogPath();
        this.dbpath = this.getDefaultDbPath();
        this.updateMacaroonPaths();
      }

      // merge parsed json properties from config file to the default config
      deepMerge(this, props);
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

  private getNetwork = (args: { [argName: string]: any }) => {
    const networks: { [val: string]: boolean } = {
      [XuNetwork.MainNet]: args.mainnet,
      [XuNetwork.TestNet]: args.testnet,
      [XuNetwork.SimNet]: args.simnet,
      [XuNetwork.RegTest]: args.regtest,
    };

    const selected = Object.keys(networks).filter(key => networks[key]);
    if (selected.length > 1) {
      throw Error('only one network selection is allowed');
    }

    if (selected.length === 0) {
      return XuNetwork.SimNet;
    } else {
      return selected[0] as XuNetwork;
    }
  }

  private updateMacaroonPaths = () => {
    for (const currency in this.lnd) {
      switch (currency) {
        case 'LTC':
          // litecoin uses a specific folder name for testnet
          this.lnd.LTC!.macaroonpath = path.join(this.lnd.LTC!.macaroonpath, '..', '..',
            this.network === XuNetwork.TestNet ? 'testnet4' : this.network, 'admin.macaroon');
          break;
        default:
          // by default we want to update the network folder name to the selected network
          this.lnd[currency]!.macaroonpath = path.join(this.lnd[currency]!.macaroonpath, '..', '..', this.network, 'admin.macaroon');
          break;
      }
    }
  }

  private getDefaultDbPath = () => {
    return path.join(this.xudir, `xud-${this.network}.db`);
  }

  private getDefaultLogPath = (): string => {
    return path.resolve(this.xudir, 'logs', 'xud.log');
  }

  private getDefaultLogLevel = (): string => {
    return process.env.NODE_ENV === 'production' ? Level.Info : Level.Debug;
  }

  public getDefaultNetwork = (): XuNetwork => {
    return XuNetwork.SimNet;
  }
}

export default Config;
