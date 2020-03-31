import assert from 'assert';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import toml from 'toml';
import { XuNetwork } from './constants/enums';
import { LndClientConfig } from './lndclient/types';
import { Level } from './Logger';
import { OrderBookThresholds } from './orderbook/types';
import { PoolConfig } from './p2p/types';
import { RaidenClientConfig } from './raidenclient/types';
import { deepMerge } from './utils/utils';

const propAssertions = {
  port: (val: number) => assert(val >= 0 && val <= 65535, 'port must be between 0 and 65535'),
  cltvdelta: (val: number) => assert(val > 0, 'cltvdelta must be a positive number'),
  discoverminutes: (val: number) => assert(val > 0, 'discoverminutes must be a positive number'),
  minQuantity: (val: number) => assert(val >= 0, 'minQuantity must be 0 or a positive number'),
};

function validateConfig(propVal: any, defaultVal: any, propKey?: string, prefix?: string) {
  const actualType = typeof propVal;
  const expectedType = typeof defaultVal;
  if (actualType === 'undefined') {
    return; // this is an unspecified property that will use the default value
  }
  if (expectedType === 'undefined') {
    return; // this is a superfluous property that we ignore for now
  }
  assert.equal(actualType, expectedType, `${prefix || ''}${propKey} is type ${actualType} but should be ${expectedType}`);

  if (actualType === 'object') {
    // if this is an object, we recurse
    for (const nestedPropKey in propVal) {
      const nestedPrefix = propKey ? `${prefix || ''}${propKey}.` : undefined;
      validateConfig(propVal[nestedPropKey], defaultVal[nestedPropKey], nestedPropKey, nestedPrefix);
    }
  } else {
    if (propKey && propKey in propAssertions) {
      // shortcoming in typescript 3.6.4 `in` keyword type guard requires manual cast to any below
      (propAssertions as any)[propKey](propVal);
    }
  }
}

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public loglevel: string;
  public logpath: string;
  public logdateformat: string;
  public network: XuNetwork;
  public rpc: { disable: boolean, host: string, port: number };
  public http: { host: string, port: number };
  public lnd: { [currency: string]: LndClientConfig | undefined } = {};
  public raiden: RaidenClientConfig;
  public orderthresholds: OrderBookThresholds;
  public webproxy: { port: number, disable: boolean };
  public debug: { raidenDirectChannelChecks: boolean };
  public instanceid = 0;
  /** Whether to intialize a new database with default values. */
  public initdb = true;
  /** The file path for the database, or ':memory:' if the database should be kept in memory. */
  public dbpath: string;
  /** Whether matching will be disabled */
  public nomatching = false;
  /** Whether a password should not be used to encrypt the xud key and underlying wallets. */
  public noencrypt = true; // TODO: enable encryption by default
  /** Whether to use the maximum network channel sizes as trading limits. */
  public maxlimits = false;
  /**
   * Whether to disable sanity swaps that verify that the orders can possibly be swapped
   * before adding trading pairs as active.
   */
  public nosanityswaps = true;
  /**
   * Whether to disable balance checks that verify that the orders can possibly be swapped
   * before adding them to the order book.
   */
  public nobalancechecks = false;

  constructor() {
    const platform = os.platform();
    let lndDefaultDatadir: string;
    let raidenDefaultKeystorePath: string;
    switch (platform) {
      case 'win32': { // windows
        const homeDir = process.env.LOCALAPPDATA!;
        this.xudir = path.join(homeDir, 'Xud');
        lndDefaultDatadir = path.join(homeDir, 'Lnd');
        raidenDefaultKeystorePath = path.join(homeDir, 'Ethereum');
        break;
      }
      case 'darwin': { // mac
        const homeDir = process.env.HOME!;
        this.xudir = path.join(homeDir, '.xud');
        lndDefaultDatadir = path.join(homeDir, 'Library', 'Application Support', 'Lnd');
        raidenDefaultKeystorePath = path.join(homeDir, 'Library', 'Ethereum');
        break;
      }
      default: { // linux
        const homeDir = process.env.HOME!;
        this.xudir = path.join(homeDir, '.xud');
        lndDefaultDatadir = path.join(homeDir, '.lnd');
        raidenDefaultKeystorePath = path.join(homeDir, '.ethereum');
        break;
      }
    }

    // default configuration
    this.loglevel = this.getDefaultLogLevel();
    this.logpath = this.getDefaultLogPath();
    this.logdateformat = 'DD/MM/YYYY HH:mm:ss.SSS';
    this.network = XuNetwork.SimNet;
    this.dbpath = this.getDefaultDbPath();

    this.p2p = {
      listen: true,
      discover: true,
      tor: false,
      torport: 0, // 0 = disabled
      discoverminutes: 60 * 12, // 12 hours
      detectexternalip: false,
      port: this.getDefaultP2pPort(),
      addresses: [],
    };
    this.rpc = {
      disable: false,
      host: 'localhost',
      port: this.getDefaultRpcPort(),
    };
    this.http = {
      host: 'localhost',
      port: this.getDefaultHttpPort(),
    };
    this.webproxy = {
      disable: true,
      port: 8080,
    };
    this.debug = {
      raidenDirectChannelChecks: true,
    };
    // TODO: add dynamic max/min price limits
    this.orderthresholds = {
      minQuantity: 0, // 0 = disabled
    };
    this.lnd.BTC = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'data', 'chain', 'bitcoin', this.network, 'admin.macaroon'),
      host: 'localhost',
      port: 10009,
      nomacaroons: false,
      cltvdelta: 40,
    };
    this.lnd.LTC = {
      disable: false,
      certpath: path.join(lndDefaultDatadir, 'tls.cert'),
      macaroonpath: path.join(lndDefaultDatadir, 'data', 'chain', 'litecoin', this.network, 'admin.macaroon'),
      host: 'localhost',
      port: 10010,
      nomacaroons: false,
      cltvdelta: 576,
    };
    this.raiden = {
      disable: false,
      host: 'localhost',
      port: 5001,
      keystorepath: raidenDefaultKeystorePath,
    };
  }

  private static readConfigProps = async (configPath: string) => {
    let configText: string | undefined;
    try {
      configText = await fs.readFile(configPath, 'utf8');
    } catch (err) {}

    let configProps: any;
    if (configText) {
      try {
        configProps = toml.parse(configText);
      } catch (e) {
        throw new Error(`Error parsing config file at ${configPath} on line ${e.line}, column ${e.column}: ${e.message}`);
      }
    }
    return configProps;
  }

  /**
   * Loads the xud configuration from an optional file and any command line arguments.
   * @returns a promise that resolves to `true` if a config file was found and loaded, otherwise `false`
   */
  public load = async (args?: { [argName: string]: any }): Promise<boolean> => {
    if (args) {
      if (args.xudir) {
        this.xudir = args.xudir;
      }
      const argNetwork = this.getNetwork(args);
      if (argNetwork) {
        this.network = argNetwork;
        args.network = argNetwork;
      }
    }

    await this.mkDirIfNotExist(this.xudir);

    const configPath = path.join(this.xudir, 'xud.conf');
    const configProps = await Config.readConfigProps(configPath);

    if (configProps) {
      validateConfig(configProps, this);

      // set the network and xudir props up front because they influence default config values
      if (configProps.network && (!args || !args.network)) {
        this.network = configProps.network;
        if (![XuNetwork.MainNet, XuNetwork.TestNet, XuNetwork.SimNet, XuNetwork.RegTest].includes(configProps.network)) {
          throw new Error(`Invalid network config: ${configProps.network}`);
        }
      }

      if (configProps.xudir && (!args || !args.xudir)) {
        this.xudir = configProps.xudir;
      }

      if (configProps.thresholds) {
        this.orderthresholds = {
          ...this.orderthresholds,
          ...configProps.thresholds,
        };
      }
    }

    // update defaults based on the xudir and network from the args or config file
    this.logpath = this.getDefaultLogPath();
    this.dbpath = this.getDefaultDbPath();
    this.p2p.port = this.getDefaultP2pPort();
    this.rpc.port = this.getDefaultRpcPort();
    this.http.port = this.getDefaultHttpPort();
    this.setDefaultMacaroonPaths();

    if (configProps) {
      // merge parsed json properties from config file to the default config
      deepMerge(this, configProps);
    }

    if (args) {
      validateConfig(args, this);

      // override our config file with command line arguments
      deepMerge(this, args);
    }

    if (!Object.values(<any>Level).includes(this.loglevel)) {
      this.loglevel = this.getDefaultLogLevel();
    }

    const logDir = path.dirname(this.logpath);
    await this.mkDirIfNotExist(logDir);

    return !!configProps;
  }

  /**
   * Creates a directory if it does not exist, otherwise does nothing.
   */
  private mkDirIfNotExist = async (dirPath: string) => {
    try {
      await fs.mkdir(dirPath);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        // ignore the error if the directory already exists, otherwise throw
        throw err;
      }
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
      return undefined;
    } else {
      return selected[0] as XuNetwork;
    }
  }

  private setDefaultMacaroonPaths = () => {
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

  private getDefaultP2pPort = () => {
    switch (this.network) {
      case XuNetwork.MainNet:
        return 8885;  // X = 88, U = 85 in ASCII
      case XuNetwork.TestNet:
        return 18885;
      case XuNetwork.SimNet:
        return 28885;
      case XuNetwork.RegTest:
        return 38885;
      default:
        throw new Error('unrecognized network');
    }
  }

  private getDefaultRpcPort = () => {
    switch (this.network) {
      case XuNetwork.MainNet:
        return 8886;
      case XuNetwork.TestNet:
        return 18886;
      case XuNetwork.SimNet:
        return 28886;
      case XuNetwork.RegTest:
        return 38886;
      default:
        throw new Error('unrecognized network');
    }
  }

  private getDefaultHttpPort = () => {
    switch (this.network) {
      case XuNetwork.MainNet:
        return 8887;
      case XuNetwork.TestNet:
        return 18887;
      case XuNetwork.SimNet:
        return 28887;
      case XuNetwork.RegTest:
        return 38887;
      default:
        throw new Error('unrecognized network');
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
}

export default Config;
