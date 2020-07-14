import Config from '../../lib/Config';
import { SwapClientType, XuNetwork } from '../../lib/constants/enums';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';
import NodeKey from '../../lib/nodekey/NodeKey';
import Orderbook from '../../lib/orderbook/OrderBook';
import { OwnLimitOrder } from '../../lib/orderbook/types';
import Network from '../../lib/p2p/Network';
import Peer from '../../lib/p2p/Peer';
import Pool from '../../lib/p2p/Pool';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Swaps from '../../lib/swaps/Swaps';
import { UnitConverter } from '../../lib/utils/UnitConverter';

jest.mock('../../lib/db/DB', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        Pair: {
          findAll: () => {
            return [
              {
                id: pairId,
                baseCurrency: 'LTC',
                quoteCurrency: 'BTC',
              },
            ];

          },
        },
        Currency: {
          findAll: () => {
            const ltc = { id: 'LTC', swapClient: SwapClientType.Lnd };
            const btc = { id: 'BTC', swapClient: SwapClientType.Lnd };
            return [
              { ...ltc, toJSON: () => ltc },
              { ...btc, toJSON: () => btc },
            ];
          },
        },
      },
    };
  });
});
const advertisedPairs = ['LTC/BTC', 'WETH/BTC'];
const mockActivatePair = jest.fn();
const mockActivateCurrency = jest.fn();
const mockGetIdentifier = jest.fn(() => 'pubkeyoraddress');
const tokenIdentifiers: any = {
  BTC: 'bitcoin-regtest',
  LTC: 'litecoin-regtest',
};
const mockPeerGetTokenIdentifer = jest.fn((currency: string) => tokenIdentifiers[currency]);
jest.mock('../../lib/p2p/Peer', () => {
  return jest.fn().mockImplementation(() => {
    let currencyActive = false;
    return {
      advertisedPairs,
      activatePair: mockActivatePair,
      activateCurrency: (currency: string) => {
        mockActivateCurrency(currency);
        currencyActive = true;
      },
      disabledCurrencies: new Map(),
      isPairActive: () => false,
      isCurrencyActive: () => currencyActive,
      getTokenIdentifier: mockPeerGetTokenIdentifer,
      getIdentifier: mockGetIdentifier,
    };
  });
});
jest.mock('../../lib/p2p/Pool', () => {
  return jest.fn().mockImplementation(() => {
    return {
      updatePairs: jest.fn(),
      on: jest.fn(),
      getNetwork: () => XuNetwork.MainNet,
      getTokenIdentifier: (currency: string) => tokenIdentifiers[currency] as string,
    };
  });
});
jest.mock('../../lib/swaps/Swaps');
jest.mock('../../lib/swaps/SwapClientManager', () => {
  return jest.fn().mockImplementation(() => {
    return {
      canRouteToPeer: jest.fn().mockReturnValue(true),
      isConnected: jest.fn().mockReturnValue(true),
    };
  });
});
jest.mock('../../lib/Logger');
jest.mock('../../lib/nodekey/NodeKey');
const mockedNodeKey = <jest.Mock<NodeKey>><any>NodeKey;

const logger = new Logger({});
logger.trace = jest.fn();
logger.debug = jest.fn();
logger.error = jest.fn();
const loggers = {
  global: logger,
  db: logger,
  rpc: logger,
  p2p: logger,
  orderbook: logger,
  lnd: logger,
  raiden: logger,
  connext: logger,
  swaps: logger,
  http: logger,
  service: logger,
};

const localId = '97945230-8144-11e9-beb7-49ba94e5bd74';
const pairId = 'LTC/BTC';

describe('OrderBook', () => {
  let pool: Pool;
  let orderbook: Orderbook;
  let config: Config;
  let db: DB;
  let swaps: Swaps;
  let peer: Peer;
  let swapClientManager: SwapClientManager;
  let network: Network;
  let unitConverter: UnitConverter;

  beforeEach(async () => {
    config = new Config();
    network = new Network(XuNetwork.TestNet);
    peer = new Peer(loggers.p2p, {
      host: 'localhost',
      port: 9735,
    }, network);
    peer['nodeState'] = {} as any;
    db = new DB(loggers.db, config.dbpath);
    pool = new Pool({
      config: config.p2p,
      xuNetwork: XuNetwork.SimNet,
      logger: loggers.p2p,
      models: db.models,
      version: '1.0.0',
      nodeKey: new mockedNodeKey(),
    });
    pool.broadcastOrder = jest.fn();
    unitConverter = new UnitConverter();
    unitConverter.init();
    swapClientManager = new SwapClientManager(config, loggers, unitConverter);
    swaps = new Swaps(loggers.swaps, db.models, pool, swapClientManager);
    swaps.swapClientManager = swapClientManager;
    orderbook = new Orderbook({
      pool,
      swaps,
      thresholds: config.orderthresholds,
      logger: loggers.orderbook,
      models: db.models,
      nomatching: config.nomatching,
      nosanityswaps: config.nosanityswaps,
      nobalancechecks: true,
    });
    await orderbook.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('nosanityswaps enabled adds pairs and requests orders', async () => {
    orderbook['nosanityswaps'] = true;
    await orderbook['verifyPeerPairs'](peer);
    expect(mockActivateCurrency).toHaveBeenCalledTimes(3);
    expect(mockActivateCurrency).toHaveBeenCalledWith('BTC');
    expect(mockActivateCurrency).toHaveBeenCalledWith('LTC');
    expect(mockActivateCurrency).toHaveBeenCalledWith('WETH');
    expect(mockActivatePair).toHaveBeenCalledTimes(2);
    expect(mockActivatePair).toHaveBeenCalledWith(advertisedPairs[0]);
    expect(mockActivatePair).toHaveBeenCalledWith(advertisedPairs[1]);
  });

  test('isPeerCurrencySupported returns true for a known currency with matching identifiers', async () => {
    expect(orderbook['isPeerCurrencySupported'](peer, 'BTC')).toStrictEqual(true);
    expect(orderbook['isPeerCurrencySupported'](peer, 'LTC')).toStrictEqual(true);
  });

  test('isPeerCurrencySupported returns false for an unknown currency', async () => {
    expect(orderbook['isPeerCurrencySupported'](peer, 'BCH')).toStrictEqual(false);
  });

  test('isPeerCurrencySupported returns false for a known currency with a mismatching identifier', async () => {
    mockPeerGetTokenIdentifer.mockReturnValue('fakecoin-fakenet');
    expect(orderbook['isPeerCurrencySupported'](peer, 'BTC')).toStrictEqual(false);
    expect(orderbook['isPeerCurrencySupported'](peer, 'LTC')).toStrictEqual(false);
  });

  test('isPeerCurrencySupported returns false for a known currency without a swap client identifier for the peer', async () => {
    mockGetIdentifier.mockReturnValue('');
    expect(orderbook['isPeerCurrencySupported'](peer, 'BTC')).toStrictEqual(false);
    expect(orderbook['isPeerCurrencySupported'](peer, 'LTC')).toStrictEqual(false);
  });

  test('placeOrder insufficient outbound balance does throw when balancechecks enabled', async () => {
    orderbook['nobalancechecks'] = false;
    const quantity = 10000;
    const price = 0.01;
    const order: OwnLimitOrder = {
      quantity,
      pairId,
      price,
      localId,
      isBuy: false,
    };
    Swaps['calculateInboundOutboundAmounts'] = () => {
      return {
        inboundCurrency: 'BTC',
        inboundAmount: quantity * price,
        inboundUnits: quantity * price,
        outboundCurrency: 'LTC',
        outboundAmount: quantity,
        outboundUnits: quantity,
      };
    };
    swaps.swapClientManager.get = jest.fn().mockReturnValue({
      totalOutboundAmount: () => 1,
    });
    await expect(orderbook.placeLimitOrder(order))
      .rejects.toMatchSnapshot();
  });

  test('placeLimitOrder adds to order book', async () => {
    const quantity = 10000;
    const order: OwnLimitOrder = {
      quantity,
      pairId,
      localId,
      price: 0.01,
      isBuy: false,
    };
    swaps.swapClientManager.get = jest.fn().mockReturnValue({
      maximumOutboundCapacity: () => quantity,
    });
    await orderbook.placeLimitOrder(order);
    expect(orderbook.getOwnOrderByLocalId(localId)).toHaveProperty('localId', localId);
  });

  test('placeLimitOrder immediateOrCancel does not add to order book', async () => {
    const quantity = 10000;
    const order: OwnLimitOrder = {
      quantity,
      pairId,
      localId,
      price: 0.01,
      isBuy: false,
    };
    swaps.swapClientManager.get = jest.fn().mockReturnValue({
      maximumOutboundCapacity: () => quantity,
    });
    await orderbook.placeLimitOrder(order, true);
    expect(() => orderbook.getOwnOrderByLocalId(localId)).toThrow(`order with local id ${localId} does not exist`);
  });
});
