import Config from '../../lib/Config';
import { SwapClientType } from '../../lib/constants/enums';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';
import { OwnLimitOrder } from '../../lib/orderbook/types';
import { errorCodes } from '../../lib/swaps/errors';
import SwapClient from '../../lib/swaps/SwapClient';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import { UnitConverter } from '../../lib/utils/UnitConverter';
import { getUnitConverter } from '../utils';

jest.mock('../../lib/db/DB', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        Currency: {
          findAll: () => {
            return [{ id: 'WETH', tokenAddress: '0x1234' }];
          },
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
      info: () => {},
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
      isOperational: () => true,
      isMisconfigured: () => false,
      getLndInfo: lndInfoMock,
      close: closeMock,
      openChannel: mockLndOpenChannel,
    };
  });
});
const tokenAddresses = new Map<string, string>();
jest.mock('../../lib/swaps/SwapClient');
const mockedSwapClient = <jest.Mock<SwapClient>>(<any>SwapClient);

const logger = new Logger({});
logger.error = jest.fn();
const loggers = {
  global: logger,
  db: logger,
  rpc: logger,
  p2p: logger,
  orderbook: logger,
  lnd: logger,
  connext: logger,
  swaps: logger,
  http: logger,
  service: logger,
};

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
        nomacaroons: true,
        macaroonpath: '',
        cltvdelta: 40,
      },
      LTC: {
        disable: false,
        certpath: 'tls.cert',
        host: 'localhost',
        port: 10009,
        nomacaroons: true,
        macaroonpath: '',
        cltvdelta: 576,
      },
    };
    config.connext = {
      disable: false,
      host: 'localhost',
      port: 4321,
      webhookhost: 'localhost',
      webhookport: 4422,
    };
    config.strict = true;
    db = new DB(loggers.db, config.dbpath);
    unitConverter = getUnitConverter();
    tokenAddresses.set('WETH', '0x1234');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it initializes lnd-ltc and lnd-btc', async () => {
    swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
    await swapClientManager.init();

    expect(swapClientManager['swapClients'].size).toEqual(2);
    expect(onListenerMock).toHaveBeenCalledTimes(6);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    expect(swapClientManager.get('LTC')).not.toBeUndefined();
    expect(swapClientManager['swapClients'].size).toEqual(2);
    const lndClients = swapClientManager.getLndClientsMap();
    expect(lndClients.size).toEqual(2);
    expect(lndClients.get('BTC')!.pubKey).toEqual(1);
    expect(lndClients.get('LTC')!.pubKey).toEqual(1);
    await swapClientManager.getLndClientsInfo();
    expect(lndInfoMock).toHaveBeenCalledTimes(2);
  });

  test('it initializes lnd-ltc and lnd-btc', async () => {
    swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
    await swapClientManager.init();

    expect(swapClientManager['swapClients'].size).toEqual(2);
    expect(onListenerMock).toHaveBeenCalledTimes(6);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    expect(swapClientManager.get('LTC')).not.toBeUndefined();
    swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(2);
  });

  test('it initializes lnd-btc', async () => {
    config.lnd.LTC!.disable = true;
    swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
    await swapClientManager.init();

    expect(swapClientManager['swapClients'].size).toEqual(1);
    expect(onListenerMock).toHaveBeenCalledTimes(3);
    expect(swapClientManager.get('BTC')).not.toBeUndefined();
    swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  test('it initializes nothing', async () => {
    config.lnd.BTC!.disable = true;
    config.lnd.LTC!.disable = true;
    swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
    await swapClientManager.init();

    expect(swapClientManager['swapClients'].size).toEqual(0);
    expect(onListenerMock).toHaveBeenCalledTimes(0);
    expect(swapClientManager.get('BTC')).toBeUndefined();
    expect(swapClientManager.get('WETH')).toBeUndefined();
    swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(0);
  });

  test('closes lnd-btc and lnd-ltc', async () => {
    swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
    await swapClientManager.init();

    expect(swapClientManager['swapClients'].size).toEqual(2);
    swapClientManager.close();
    expect(closeMock).toHaveBeenCalledTimes(2);
  });

  describe('reserved amounts', () => {
    const currency = 'BTC';
    const amount = 10000;
    const setReservedInboundBtcAmount = jest.fn();

    beforeEach(async () => {
      swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
      await swapClientManager.init();
      swapClientManager.swapClients.get(currency)!.setReservedInboundAmount = setReservedInboundBtcAmount;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('it adds outbound reserved amounts', () => {
      expect(swapClientManager.getOutboundReservedAmount(currency)).toBeUndefined();
      swapClientManager.addOutboundReservedAmount(currency, amount);
      expect(swapClientManager.getOutboundReservedAmount(currency)).toEqual(amount);
      swapClientManager.addOutboundReservedAmount(currency, amount);
      expect(swapClientManager.getOutboundReservedAmount(currency)).toEqual(amount * 2);
    });

    test('it subtracts outbound reserved amounts', () => {
      expect(swapClientManager.getOutboundReservedAmount(currency)).toBeUndefined();
      swapClientManager.addOutboundReservedAmount(currency, amount);
      expect(swapClientManager.getOutboundReservedAmount(currency)).toEqual(amount);
      swapClientManager.subtractOutboundReservedAmount(currency, amount);
      expect(swapClientManager.getOutboundReservedAmount(currency)).toEqual(0);
    });

    test('it adds inbound reserved amounts and sets amount on swap client', () => {
      expect(swapClientManager['inboundReservedAmounts'].get(currency)).toBeUndefined();
      swapClientManager.addInboundReservedAmount(currency, amount);
      expect(swapClientManager['inboundReservedAmounts'].get(currency)).toEqual(amount);
      expect(setReservedInboundBtcAmount).toHaveBeenLastCalledWith(amount, currency);
      swapClientManager.addInboundReservedAmount(currency, amount);
      expect(swapClientManager['inboundReservedAmounts'].get(currency)).toEqual(amount * 2);
      expect(setReservedInboundBtcAmount).toHaveBeenLastCalledWith(amount * 2, currency);
    });

    test('it subtracts inbound reserved amounts', () => {
      expect(swapClientManager['inboundReservedAmounts'].get(currency)).toBeUndefined();
      swapClientManager.addInboundReservedAmount(currency, amount);
      expect(swapClientManager['inboundReservedAmounts'].get(currency)).toEqual(amount);
      expect(setReservedInboundBtcAmount).toHaveBeenLastCalledWith(amount, currency);
      swapClientManager.subtractInboundReservedAmount(currency, amount);
      expect(swapClientManager['inboundReservedAmounts'].get(currency)).toEqual(0);
    });
  });

  describe('openChannel', () => {
    let remoteIdentifier: string;

    beforeEach(async () => {
      remoteIdentifier = '02afaef2634e5c7ca8d682b828a62bd040929b1e4b5030b21e2a0a891cf545b2e1';
      swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
      await swapClientManager.init();
    });

    test('it fails without swap client', async () => {
      expect.assertions(1);
      const currency = 'BTC';
      const amount = 16000000;
      swapClientManager.get = jest.fn().mockReturnValue(undefined);
      try {
        await swapClientManager.openChannel({
          remoteIdentifier,
          currency,
          amount,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it fails without peerSwapClientPubKey', async () => {
      const currency = 'BTC';
      const amount = 16000000;
      try {
        await swapClientManager.openChannel({
          remoteIdentifier,
          currency,
          amount,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it opens a channel using lnd', async () => {
      const currency = 'BTC';
      const amount = 16000000;
      const getClientSpy = jest.spyOn(swapClientManager, 'get');
      const lndListeningUris = ['123.456.789.321:9735', '192.168.63.155:9777'];
      await swapClientManager.openChannel({
        remoteIdentifier,
        currency,
        amount,
        uris: lndListeningUris,
      });
      expect(getClientSpy).toHaveBeenCalledWith(currency);
      expect(mockLndOpenChannel).toHaveBeenCalledTimes(1);
      expect(mockLndOpenChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          remoteIdentifier,
          units: BigInt(amount),
          uris: lndListeningUris,
        }),
      );
    });
  });

  describe('tradingLimits & checkSwapCapacities', () => {
    beforeAll(() => {
      const btcClient = new mockedSwapClient();
      btcClient.isConnected = jest.fn().mockImplementation(() => true);
      btcClient.swapCapacities = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          maxOutboundChannelCapacity: 200000,
          maxInboundChannelCapacity: 150000,
          totalOutboundCapacity: 200000,
          totalInboundCapacity: 150000,
        });
      });
      swapClientManager.swapClients.set('BTC', btcClient);

      const ltcClient = new mockedSwapClient();
      ltcClient.isConnected = jest.fn().mockImplementation(() => true);
      ltcClient.swapCapacities = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          maxOutboundChannelCapacity: 700000,
          maxInboundChannelCapacity: 550000,
          totalOutboundCapacity: 700000,
          totalInboundCapacity: 550000,
        });
      });
      swapClientManager.swapClients.set('LTC', ltcClient);
    });

    test('returns trading limits for a currency', async () => {
      const btcTradingLimits = await swapClientManager.tradingLimits('BTC');

      expect(btcTradingLimits).toBeTruthy();
      expect(btcTradingLimits.maxSell).toEqual(200000);
      expect(btcTradingLimits.maxBuy).toEqual(150000);
    });

    test('throws if outbound swap capacity is insufficient for an order', async () => {
      const order: OwnLimitOrder = {
        price: 0.01,
        pairId: 'LTC/BTC',
        quantity: 800000,
        isBuy: false,
        localId: 'test',
      };

      await expect(swapClientManager.checkSwapCapacities(order)).rejects.toHaveProperty(
        'code',
        errorCodes.INSUFFICIENT_OUTBOUND_CAPACITY,
      );
    });

    test('throws if inbound swap capacity is insufficient for an order', async () => {
      const order: OwnLimitOrder = {
        price: 1,
        pairId: 'LTC/BTC',
        quantity: 300000,
        isBuy: false,
        localId: 'test',
      };

      await expect(swapClientManager.checkSwapCapacities(order)).rejects.toHaveProperty(
        'code',
        errorCodes.INSUFFICIENT_INBOUND_CAPACITY,
      );
    });

    test('throws if outbound swap capacity is insufficient for an order plus reserved amounts', async () => {
      const order: OwnLimitOrder = {
        price: 0.01,
        pairId: 'LTC/BTC',
        quantity: 600000,
        isBuy: false,
        localId: 'test',
      };

      swapClientManager['outboundReservedAmounts'].set('LTC', 200000);

      await expect(swapClientManager.checkSwapCapacities(order)).rejects.toHaveProperty(
        'code',
        errorCodes.INSUFFICIENT_OUTBOUND_CAPACITY,
      );
    });

    test('throws if inbound swap capacity is insufficient for an order plus reserved amounts', async () => {
      const order: OwnLimitOrder = {
        price: 1,
        pairId: 'LTC/BTC',
        quantity: 100000,
        isBuy: false,
        localId: 'test',
      };

      swapClientManager['inboundReservedAmounts'].set('BTC', 200000);

      await expect(swapClientManager.checkSwapCapacities(order)).rejects.toHaveProperty(
        'code',
        errorCodes.INSUFFICIENT_INBOUND_CAPACITY,
      );
    });

    test('returns if swap capacity is sufficient', async () => {
      const order: OwnLimitOrder = {
        price: 0.01,
        pairId: 'LTC/BTC',
        quantity: 600000,
        isBuy: false,
        localId: 'test',
      };

      swapClientManager['outboundReservedAmounts'].set('LTC', 50000);
      swapClientManager['inboundReservedAmounts'].set('BTC', 50000);

      await swapClientManager.checkSwapCapacities(order);
    });

    test('throws when swap client is not found', async () => {
      await expect(swapClientManager.tradingLimits('BBB')).rejects.toHaveProperty(
        'code',
        errorCodes.SWAP_CLIENT_NOT_FOUND,
      );

      const order: OwnLimitOrder = {
        price: 0.01,
        pairId: 'AAA/BBB',
        quantity: 600000,
        isBuy: false,
        localId: 'test',
      };

      await expect(swapClientManager.checkSwapCapacities(order)).rejects.toThrow(
        'cannot convert AAA amount of 600000 to units because decimal places per currency was not found in the database',
      );
    });
  });
});
