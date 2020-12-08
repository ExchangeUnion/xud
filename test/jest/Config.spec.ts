import Config from '../../lib/Config';
import { XuNetwork } from '../../lib/constants/enums';

const MAINNET_P2P_PORT = 8885;
const TESTNET_P2P_PORT = 18885;
const SIMNET_P2P_PORT = 28885;
const REGTEST_P2P_PORT = 38885;

const MAINNET_RPC_PORT = 8886;
const TESTNET_RPC_PORT = 18886;
const SIMNET_RPC_PORT = 28886;
const REGTEST_RPC_PORT = 38886;

const MAINNET_HTTP_PORT = 8887;
const TESTNET_HTTP_PORT = 18887;
const SIMNET_HTTP_PORT = 28887;
const REGTEST_HTTP_PORT = 38887;

describe('Config', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it uses correct default ports based on network args', async () => {
    await config.load({ mainnet: true });
    expect(config.network).toEqual(XuNetwork.MainNet);
    expect(config.p2p.port).toEqual(MAINNET_P2P_PORT);
    expect(config.rpc.port).toEqual(MAINNET_RPC_PORT);
    expect(config.http.port).toEqual(MAINNET_HTTP_PORT);

    const testnetConfig = new Config();
    await testnetConfig.load({ testnet: true });
    expect(testnetConfig.network).toEqual(XuNetwork.TestNet);
    expect(testnetConfig.p2p.port).toEqual(TESTNET_P2P_PORT);
    expect(testnetConfig.rpc.port).toEqual(TESTNET_RPC_PORT);
    expect(testnetConfig.http.port).toEqual(TESTNET_HTTP_PORT);

    const simnetConfig = new Config();
    await simnetConfig.load({ simnet: true });
    expect(simnetConfig.network).toEqual(XuNetwork.SimNet);
    expect(simnetConfig.p2p.port).toEqual(SIMNET_P2P_PORT);
    expect(simnetConfig.rpc.port).toEqual(SIMNET_RPC_PORT);
    expect(simnetConfig.http.port).toEqual(SIMNET_HTTP_PORT);

    const regtestConfig = new Config();
    await regtestConfig.load({ regtest: true });
    expect(regtestConfig.network).toEqual(XuNetwork.RegTest);
    expect(regtestConfig.p2p.port).toEqual(REGTEST_P2P_PORT);
    expect(regtestConfig.rpc.port).toEqual(REGTEST_RPC_PORT);
    expect(regtestConfig.http.port).toEqual(REGTEST_HTTP_PORT);
  });

  test('arg network value overrides config values', async () => {
    Config['readConfigProps'] = jest.fn().mockResolvedValue({ network: 'testnet' });
    await config.load({ mainnet: true });
    expect(config.network).toEqual(XuNetwork.MainNet);
    expect(config.p2p.port).toEqual(MAINNET_P2P_PORT);
  });

  test('it uses correct default ports based on configured network', async () => {
    Config['readConfigProps'] = jest.fn().mockResolvedValue({ network: 'testnet' });
    await config.load();
    expect(config.network).toEqual(XuNetwork.TestNet);
    expect(config.p2p.port).toEqual(TESTNET_P2P_PORT);
  });

  test('it uses ports specified by args rather than defaults based on network', async () => {
    await config.load({ testnet: true, p2p: { port: MAINNET_P2P_PORT } });
    expect(config.network).toEqual(XuNetwork.TestNet);
    expect(config.p2p.port).toEqual(MAINNET_P2P_PORT);
  });

  test('it uses ports specified by config file rather than defaults based on network', async () => {
    Config['readConfigProps'] = jest.fn().mockResolvedValue({ p2p: { port: MAINNET_P2P_PORT } });
    await config.load({ testnet: true });
    expect(config.p2p.port).toEqual(MAINNET_P2P_PORT);
    expect(config.network).toEqual(XuNetwork.TestNet);
  });

  test('it throws an error when a property is assigned the wrong type', async () => {
    await expect(config.load({ initdb: 23 })).rejects.toThrow('initdb is type number but should be boolean');
  });

  test('it throws an error when a nested property is assigned the wrong type', async () => {
    await expect(config.load({ p2p: { listen: 'no' } })).rejects.toThrow(
      'p2p.listen is type string but should be boolean',
    );
  });

  test('it throws an error when a port property is assigned an invalid value', async () => {
    await expect(config.load({ p2p: { port: 999999 } })).rejects.toThrow('port must be between 0 and 65535');
  });

  test('it throws an error when a cltvdelta property is assigned a negative value', async () => {
    await expect(config.load({ lnd: { BTC: { cltvdelta: -1 } } })).rejects.toThrow(
      'cltvdelta must be a positive number',
    );
  });

  test('it uses the default value when a prperty is assigned an undefined value', async () => {
    const defaultInitDb = config.initdb;
    await config.load({ initdb: undefined });
    expect(config.initdb).toEqual(defaultInitDb);
  });
});
