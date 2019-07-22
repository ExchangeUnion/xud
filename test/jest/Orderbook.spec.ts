import Pool from '../../lib/p2p/Pool';
import Peer from '../../lib/p2p/Peer';
import Orderbook from '../../lib/orderbook/OrderBook';
import { OwnOrder } from '../../lib/orderbook/types';
import Logger from '../../lib/Logger';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import Swaps from '../../lib/swaps/Swaps';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Network from '../../lib/p2p/Network';
import { XuNetwork, SwapClientType } from '../../lib/constants/enums';
import NodeKey from '../../lib/nodekey/NodeKey';
import { UnitConverter } from '../../lib/utils/UnitConverter';

jest.mock('../../lib/db/DB', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        Pair: {
          findAll: () => {
            return [
              {
                id: 'LTC/BTC',
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
const mockGetIdentifier = jest.fn(() => 'pubkeyoraddress');
const tokenIdentifiers: any = {
  BTC: 'bitcoin-regtest',
  LTC: 'litecoin-regtest',
};
const mockPeerGetTokenIdentifer = jest.fn((currency: string) => tokenIdentifiers[currency]);
jest.mock('../../lib/p2p/Peer', () => {
  return jest.fn().mockImplementation(() => {
    return {
      advertisedPairs,
      activatePair: mockActivatePair,
      disabledCurrencies: new Map(),
      isPairActive: () => false,
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
      getTokenIdentifier: (currency: string) => tokenIdentifiers[currency] as string,
    };
  });
});
jest.mock('../../lib/swaps/Swaps');
jest.mock('../../lib/swaps/SwapClientManager');
jest.mock('../../lib/Logger');
jest.mock('../../lib/nodekey/NodeKey');
const mockedNodeKey = <jest.Mock<NodeKey>><any>NodeKey;

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
      xuNetwork: config.network,
      logger: loggers.p2p,
      models: db.models,
      version: '1.0.0',
      nodeKey: new mockedNodeKey(),
    });
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
      nobalancechecks: config.nobalancechecks,
    });
    await orderbook.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('nosanityswaps enabled adds pairs and requests orders', async () => {
    orderbook['nosanityswaps'] = true;
    await orderbook['verifyPeerPairs'](peer);
    expect(mockActivatePair).toHaveBeenCalledTimes(2);
    expect(mockActivatePair).toHaveBeenCalledWith(advertisedPairs[0], expect.any(Number), expect.anything());
    expect(mockActivatePair).toHaveBeenCalledWith(advertisedPairs[1], expect.any(Number), expect.anything());
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

  test('placeOrder insufficient outbound balance does throw when balancechecks disabled', async () => {
    orderbook['nobalancechecks'] = false;
    await orderbook.init();
    const quantity = 500000000000;
    const order: OwnOrder = {
      quantity,
      initialQuantity: quantity,
      pairId: 'LTC/BTC',
      price: 0.1,
      isBuy: false,
      localId: '97945230-8144-11e9-beb7-49ba94e5bd74',
      hold: 0,
      id: '97945230-8144-11e9-beb7-49ba94e5bd74',
      createdAt: 1559046721235,
    };
    Swaps['calculateInboundOutboundAmounts'] = () => {
      return {
        inboundCurrency: 'BTC',
        inboundAmount: 50000000000,
        inboundUnits: 50000000000,
        outboundCurrency: 'LTC',
        outboundAmount: quantity,
        outboundUnits: quantity,
      };
    };
    swaps.swapClientManager.get = jest.fn().mockReturnValue({
      maximumOutboundCapacity: () => 1,
    });
    await expect(orderbook.placeLimitOrder(order))
      .rejects.toMatchSnapshot();
  });
});
