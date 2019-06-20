import Logger from '../../lib/Logger';
import DB from '../../lib/db/DB';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Config from '../../lib/Config';
import { SwapClientType } from '../../lib/constants/enums';

jest.mock('../../lib/db/DB', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        Currency: {
          findAll: () => { return [{ id: 'WETH', tokenAddress: '0x1234' }]; },
        },
      },
    };
  });
});
jest.mock('../../lib/Config');
jest.mock('../../lib/Logger');
jest.mock('../../lib/nodekey/NodeKey');
const mockLndPubKey = 1;
const lndInfoMock = jest.fn(() => Promise.resolve());
const onListenerMock = jest.fn();
const closeMock = jest.fn();
jest.mock('../../lib/lndclient/LndClient', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: onListenerMock,
      init: () => Promise.resolve(),
      pubKey: mockLndPubKey,
      type: SwapClientType.Lnd,
      isDisabled: () => false,
      getLndInfo: lndInfoMock,
      close: closeMock,
    };
  });
});
const mockRaidenAddress = 1234567890;
let mockRaidenClientIsDisabled = false;
jest.mock('../../lib/raidenclient/RaidenClient', () => {
  return jest.fn().mockImplementation(() => {
    const tokenAddresses = new Map<string, string>();
    return {
      tokenAddresses,
      on: onListenerMock,
      init: () => Promise.resolve(),
      type: SwapClientType.Raiden,
      address: mockRaidenAddress,
      isDisabled: () => mockRaidenClientIsDisabled,
      close: closeMock,
    };
  });
});

const logger = new Logger({});
const loggers = {
  global: logger,
  db: logger,
  rpc: logger,
  p2p: logger,
  orderbook: logger,
  lnd: logger,
  raiden: logger,
  swaps: logger,
  http: logger,
};

describe('Swaps.SwapClientManager', () => {
  let config: Config;
  let db: DB;
  let swapClientManager: SwapClientManager;

  beforeEach(async () => {
    config = new Config();
    config.lnd = {
      BTC: {
        disable: false,
        certpath: 'tls.cert',
        host: 'localhost',
        port: 10009,
        cltvdelta: 144,
        nomacaroons: true,
        macaroonpath: '',
      },
      LTC: {
        disable: false,
        certpath: 'tls.cert',
        host: 'localhost',
        port: 10009,
        cltvdelta: 144,
        nomacaroons: true,
        macaroonpath: '',
      },
    };
    config.raiden = {
      disable: false,
      host: 'localhost',
      port: 1234,
    };
    db = new DB(loggers.db, config.dbpath);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it initializes lnd-ltc, lnd-btc and raiden', async () => {
    swapClientManager = new SwapClientManager(config, loggers);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(3);
    expect(onListenerMock).toHaveBeenCalledTimes(5);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    expect(swapClientManager.get('LTC')).not.toBeUndefined();
    expect(swapClientManager.get('WETH')).not.toBeUndefined();
    expect(swapClientManager.raidenClient.tokenAddresses.size).toEqual(1);
    expect(swapClientManager.raidenClient.tokenAddresses.get('WETH')).not.toBeUndefined();
    swapClientManager.remove('WETH');
    expect(swapClientManager['swapClients'].size).toEqual(2);
    const lndPubKeysMap = swapClientManager.getLndPubKeysMap();
    expect(lndPubKeysMap.size).toEqual(2);
    expect(lndPubKeysMap.get('BTC')).toEqual(1);
    expect(lndPubKeysMap.get('LTC')).toEqual(1);
    await swapClientManager.getLndClientsInfo();
    expect(lndInfoMock).toHaveBeenCalledTimes(2);
  });

  test('it initializes lnd-ltc and lnd-btc', async () => {
    config.raiden.disable = true;
    mockRaidenClientIsDisabled = true;
    swapClientManager = new SwapClientManager(config, loggers);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(2);
    expect(onListenerMock).toHaveBeenCalledTimes(4);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    expect(swapClientManager.get('LTC')).not.toBeUndefined();
    await swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(2);
  });

  test('it initializes lnd-btc', async () => {
    config.lnd.LTC!.disable = true;
    config.raiden.disable = true;
    mockRaidenClientIsDisabled = true;
    swapClientManager = new SwapClientManager(config, loggers);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(1);
    expect(onListenerMock).toHaveBeenCalledTimes(2);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    await swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  test('it initializes nothing', async () => {
    config.lnd.BTC!.disable = true;
    config.lnd.LTC!.disable = true;
    config.raiden.disable = true;
    swapClientManager = new SwapClientManager(config, loggers);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(0);
    expect(onListenerMock).toHaveBeenCalledTimes(0);
    expect(swapClientManager.get('BTC')).toBeUndefined();
    expect(swapClientManager.get('WETH')).toBeUndefined();
    await swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(0);
  });

  it('closes lnd-btc, lnd-ltc and raiden', async () => {
    config.raiden.disable = false;
    mockRaidenClientIsDisabled = false;
    swapClientManager = new SwapClientManager(config, loggers);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(3);
    await swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(3);
  });

});
