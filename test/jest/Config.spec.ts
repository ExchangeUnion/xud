import Config from '../../lib/Config';
import { XuNetwork } from '../../lib/constants/enums';

const MAINNET_P2P_PORT = 8885;
const TESTNET_P2P_PORT = 18885;
const SIMNET_P2P_PORT = 28885;
const REGTEST_P2P_PORT = 38885;

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

    const testnetConfig = new Config();
    await testnetConfig.load({ testnet: true });
    expect(testnetConfig.network).toEqual(XuNetwork.TestNet);
    expect(testnetConfig.p2p.port).toEqual(TESTNET_P2P_PORT);

    const simnetConfig = new Config();
    await simnetConfig.load({ simnet: true });
    expect(simnetConfig.network).toEqual(XuNetwork.SimNet);
    expect(simnetConfig.p2p.port).toEqual(SIMNET_P2P_PORT);

    const regtestConfig = new Config();
    await regtestConfig.load({ regtest: true });
    expect(regtestConfig.network).toEqual(XuNetwork.RegTest);
    expect(regtestConfig.p2p.port).toEqual(REGTEST_P2P_PORT);
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
});
