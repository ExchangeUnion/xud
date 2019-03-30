import os from 'os';
import path from 'path';
import toml from 'toml';
import { deepMerge } from './utils/utils';
import { exists, mkdir, readFile } from './utils/fsUtils';
import { LndClientConfig } from './lndclient/LndClient';
import { RaidenClientConfig } from './raidenclient/RaidenClient';
import { Level } from './Logger';
import { lnNetworks, XUNetwork } from './constants/enums';
import { PoolConfig } from './p2p/types';

class Config {
  public p2p: PoolConfig;
  public xudir: string;
  public loglevel: string;
  public logpath: string;
  public logdateformat: string;
  public network: XUNetwork;
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
    this.network = XUNetwork.SimNet;
    const lnNetwork = lnNetworks[this.network];
    this.dbpath = this.getDefaultDbPath();

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
        lnNetwork === lnNetworks[XUNetwork.TestNet] ? 'testnet4' : this.network, 'admin.macaroon'),
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
      this.updateNetwork(args.mainnet, args.testnet, args.regtest);
      this.updateMacaroonPaths();
      this.updateDefaultPaths(args.xudir);
    }

    const configPath = path.join(this.xudir, 'xud.conf');
    if (!(await exists(this.xudir))) {
      await mkdir(this.xudir);
    } else if (await exists(configPath)) {
      const configText = await readFile(configPath, 'utf8');
      try {
        const props = toml.parse(configText);

        const updateNetwork = (props.mainnet || props.testnet || props.regtest) && (!args || !args.mainnet || args.testnet || args.regtest)
        if (updateNetwork) {
          this.updateNetwork(props.mainnet, props.testnet, props.regtest);
          this.updateMacaroonPaths();
        }

        const updateXuPath = props.xudir && (!args || !args.xudir);
        if (updateXuPath || updateNetwork) {
          this.updateDefaultPaths(props.xudir || this.xudir);
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

  private updateNetwork = (mainnet: boolean, testnet: boolean, regtest: boolean) => {
    const networks: { [val: string]: boolean } = {
      [XUNetwork.MainNet]: mainnet,
      [XUNetwork.TestNet]: testnet,
      [XUNetwork.RegTest]: regtest,
    };

    const selected = Object.keys(networks).filter(key => networks[key]);
    if (selected.length > 1) {
      throw Error('only one alternative network selection is allowed');
    }

    if (selected.length === 0) {
      this.network = XUNetwork.SimNet;
    } else {
      this.network = selected[0] as XUNetwork;
    }
  }

  private updateMacaroonPaths = () => {
    const lnNetwork = lnNetworks[this.network];
    for (const currency in this.lnd) {
      switch (currency) {
        case 'LTC':
          // litecoin uses a specific folder name for testnet
          this.lnd.LTC!.macaroonpath = path.join(this.lnd.LTC!.macaroonpath, '..', '..',
            lnNetwork === XUNetwork.TestNet ? 'testnet4' : lnNetwork, 'admin.macaroon');
          break;
        default:
          // by default we want to update the network folder name to the selected network
          this.lnd[currency]!.macaroonpath = path.join(this.lnd[currency]!.macaroonpath, '..', '..', lnNetwork, 'admin.macaroon');
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
}

export default Config;
