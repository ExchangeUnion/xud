import Logger from '../../lib/Logger';
import DB from '../../lib/db/DB';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Config from '../../lib/Config';
import { SwapClientType } from '../../lib/constants/enums';
import Peer from '../../lib/p2p/Peer';
import { UnitConverter } from '../../lib/utils/UnitConverter';

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
jest.mock('../../lib/Logger', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createSubLogger: () => {},
    };
  });
});
jest.mock('../../lib/nodekey/NodeKey');
const mockLndPubKey = 1;
const lndInfoMock = jest.fn(() => Promise.resolve());
const onListenerMock = jest.fn();
const closeMock = jest.fn();
const mockLndOpenChannel = jest.fn();
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
      openChannel: mockLndOpenChannel,
    };
  });
});
const mockRaidenAddress = 1234567890;
let mockRaidenClientIsDisabled = false;
const mockRaidenOpenChannel = jest.fn();
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
      openChannel: mockRaidenOpenChannel,
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
jest.mock('../../lib/p2p/Peer');
const mockedPeer = <jest.Mock<Peer>><any>Peer;

describe('Swaps.SwapClientManager', () => {
  let config: Config;
  let db: DB;
  let swapClientManager: SwapClientManager;
  let unitConverter: UnitConverter;

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
      cltvdelta: 5760,
    };
    config.debug = {
      raidenDirectChannelChecks: true,
    };
    db = new DB(loggers.db, config.dbpath);
    unitConverter = new UnitConverter();
    unitConverter.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it initializes lnd-ltc, lnd-btc and raiden', async () => {
    swapClientManager = new SwapClientManager(config, loggers, unitConverter);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(3);
    expect(onListenerMock).toHaveBeenCalledTimes(5);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    expect(swapClientManager.get('LTC')).not.toBeUndefined();
    expect(swapClientManager.get('WETH')).not.toBeUndefined();
    swapClientManager.remove('WETH');
    expect(swapClientManager['swapClients'].size).toEqual(2);
    const lndClients = swapClientManager.getLndClientsMap();
    expect(lndClients.size).toEqual(2);
    expect(lndClients.get('BTC')!.pubKey).toEqual(1);
    expect(lndClients.get('LTC')!.pubKey).toEqual(1);
    await swapClientManager.getLndClientsInfo();
    expect(lndInfoMock).toHaveBeenCalledTimes(2);
  });

  test('it initializes lnd-ltc and lnd-btc', async () => {
    config.raiden.disable = true;
    mockRaidenClientIsDisabled = true;
    swapClientManager = new SwapClientManager(config, loggers, unitConverter);
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
    swapClientManager = new SwapClientManager(config, loggers, unitConverter);
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
    swapClientManager = new SwapClientManager(config, loggers, unitConverter);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(0);
    expect(onListenerMock).toHaveBeenCalledTimes(0);
    expect(swapClientManager.get('BTC')).toBeUndefined();
    expect(swapClientManager.get('WETH')).toBeUndefined();
    await swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(0);
  });

  test('closes lnd-btc, lnd-ltc and raiden', async () => {
    config.raiden.disable = false;
    mockRaidenClientIsDisabled = false;
    swapClientManager = new SwapClientManager(config, loggers, unitConverter);
    await swapClientManager.init(db.models);
    expect(swapClientManager['swapClients'].size).toEqual(3);
    await swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(3);
  });

  describe('openChannel', () => {
    let peer: Peer;
    let peerLndPubKey: string;

    beforeEach(() => {
      peer = new mockedPeer();
      peerLndPubKey = '02afaef2634e5c7ca8d682b828a62bd040929b1e4b5030b21e2a0a891cf545b2e1';
      peer.getIdentifier = jest.fn().mockReturnValue(peerLndPubKey);
    });

    test('it fails without swap client', async () => {
      expect.assertions(1);
      const currency = 'BTC';
      const amount = 16000000;
      swapClientManager = new SwapClientManager(config, loggers, unitConverter);
      swapClientManager.get = jest.fn().mockReturnValue(undefined);
      await swapClientManager.init(db.models);
      try {
        await swapClientManager.openChannel({ peer, currency, amount });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it fails without peerSwapClientPubKey', async () => {
      expect.assertions(1);
      const currency = 'BTC';
      const amount = 16000000;
      swapClientManager = new SwapClientManager(config, loggers, unitConverter);
      peer.getIdentifier = jest.fn().mockReturnValue(undefined);
      await swapClientManager.init(db.models);
      try {
        await swapClientManager.openChannel({ peer, currency, amount });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it fails lnd without lndUris', async () => {
      expect.assertions(1);
      const currency = 'BTC';
      const amount = 16000000;
      swapClientManager = new SwapClientManager(config, loggers, unitConverter);
      peer.getLndUris = jest.fn().mockReturnValue(undefined);
      await swapClientManager.init(db.models);
      try {
        await swapClientManager.openChannel({ peer, currency, amount });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it opens a channel using lnd', async () => {
      const currency = 'BTC';
      const amount = 16000000;
      swapClientManager = new SwapClientManager(config, loggers, unitConverter);
      const getClientSpy = jest.spyOn(swapClientManager, 'get');
      const lndListeningUris = [
        '123.456.789.321:9735',
        '192.168.63.155:9777',
      ];
      peer.getLndUris = jest.fn().mockReturnValue(lndListeningUris);
      await swapClientManager.init(db.models);
      await swapClientManager.openChannel({ peer, currency, amount });
      expect(getClientSpy).toHaveBeenCalledWith(currency);
      expect(peer.getIdentifier).toHaveBeenCalledWith(SwapClientType.Lnd, currency);
      expect(mockLndOpenChannel).toHaveBeenCalledTimes(1);
      expect(mockLndOpenChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          units: amount,
          lndUris: lndListeningUris,
          peerIdentifier: peerLndPubKey,
        }),
      );
    });

    test('it opens a channel using raiden', async () => {
      const currency = 'WETH';
      const amount = 5000000;
      const expectedUnits = 50000000000000000;
      const peerRaidenAddress = '0x10D8CCAD85C7dc123090B43aA1f98C00a303BFC5';
      peer.getIdentifier = jest.fn().mockReturnValue(peerRaidenAddress);
      swapClientManager = new SwapClientManager(config, loggers, unitConverter);
      const getClientSpy = jest.spyOn(swapClientManager, 'get');
      peer.getLndUris = jest.fn();
      await swapClientManager.init(db.models);
      await swapClientManager.openChannel({ peer, currency, amount });
      expect(getClientSpy).toHaveBeenCalledWith(currency);
      expect(peer.getIdentifier).toHaveBeenCalledWith(SwapClientType.Raiden, currency);
      expect(peer.getLndUris).toHaveBeenCalledTimes(0);
      expect(mockRaidenOpenChannel).toHaveBeenCalledTimes(1);
      expect(mockRaidenOpenChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          currency,
          units: expectedUnits,
          peerIdentifier: peerRaidenAddress,
        }),
      );
    });

  });

});
