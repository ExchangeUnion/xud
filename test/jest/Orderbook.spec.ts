import Config from '../../lib/Config';
import { SwapClientType, XuNetwork } from '../../lib/constants/enums';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';
import NodeKey from '../../lib/nodekey/NodeKey';
import Orderbook from '../../lib/orderbook/OrderBook';
import { OwnLimitOrder, OwnMarketOrder } from '../../lib/orderbook/types';
import Network from '../../lib/p2p/Network';
import Peer from '../../lib/p2p/Peer';
import Pool from '../../lib/p2p/Pool';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Swaps from '../../lib/swaps/Swaps';
import { UnitConverter } from '../../lib/utils/UnitConverter';
import { getUnitConverter } from '../utils';

jest.mock('../../lib/db/DB', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        Order: { create: jest.fn() },
        Trade: { create: jest.fn() },
        Pair: {
          findAll: () => {
            return [
              {
                id: pairId,
                baseCurrency: 'LTC',
                quoteCurrency: 'BTC',
              },
              {
                id: 'BTC/USDT',
                baseCurrency: 'BTC',
                quoteCurrency: 'USDT',
              },
            ];
          },
        },
        Currency: {
          findAll: () => {
            const ltc = { id: 'LTC', swapClient: SwapClientType.Lnd };
            const btc = { id: 'BTC', swapClient: SwapClientType.Lnd };
            const usdt = { id: 'USDT', swapClient: SwapClientType.Connext };
            return [
              { ...ltc, toJSON: () => ltc },
              { ...btc, toJSON: () => btc },
              { ...usdt, toJSON: () => usdt },
            ];
          },
        },
      },
    };
  });
});
const advertisedPairs = ['LTC/BTC', 'ETH/BTC'];
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
      removeListener: jest.fn(),
      getNetwork: () => XuNetwork.MainNet,
      getTokenIdentifier: (currency: string) => tokenIdentifiers[currency] as string,
      broadcastOrderInvalidation: jest.fn(),
    };
  });
});
jest.mock('../../lib/swaps/Swaps');
jest.mock('../../lib/swaps/SwapClientManager', () => {
  return jest.fn().mockImplementation(() => {
    return {
      canRouteToPeer: jest.fn().mockReturnValue(true),
      isConnected: jest.fn().mockReturnValue(true),
      checkSwapCapacities: jest.fn(),
      get: jest.fn().mockReturnValue({
        maximumOutboundCapacity: () => Number.MAX_SAFE_INTEGER,
      }),
    };
  });
});
jest.mock('../../lib/Logger');
jest.mock('../../lib/nodekey/NodeKey');
const mockedNodeKey = <jest.Mock<NodeKey>>(<any>NodeKey);

const logger = new Logger({});
logger.trace = jest.fn();
logger.verbose = jest.fn();
logger.debug = jest.fn();
logger.error = jest.fn();
logger.info = jest.fn();
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
    peer = new Peer(
      loggers.p2p,
      {
        host: 'localhost',
        port: 9735,
      },
      network,
    );
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
    unitConverter = getUnitConverter();
    swapClientManager = new SwapClientManager(config, loggers, unitConverter, db.models);
    swaps = new Swaps({
      pool,
      unitConverter,
      swapClientManager,
      logger: loggers.swaps,
      models: db.models,
    });
    swapClientManager.addInboundReservedAmount = jest.fn();
    swapClientManager.subtractInboundReservedAmount = jest.fn();
    swapClientManager.addOutboundReservedAmount = jest.fn();
    swapClientManager.subtractOutboundReservedAmount = jest.fn();
    swaps.swapClientManager = swapClientManager;
    orderbook = new Orderbook({
      pool,
      swaps,
      unitConverter,
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
    expect(mockActivateCurrency).toHaveBeenCalledTimes(2);
    expect(mockActivateCurrency).toHaveBeenCalledWith('BTC');
    expect(mockActivateCurrency).toHaveBeenCalledWith('LTC');
    expect(mockActivatePair).toHaveBeenCalledTimes(1);
    expect(mockActivatePair).toHaveBeenCalledWith(advertisedPairs[0]);
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

  describe('placeOrder', () => {
    test('market order checks swap clients for insufficient inbound balance using best quoted price', async () => {
      const quantity = 20000000;
      const price = 4000;
      const usdtPairId = 'BTC/USDT';
      const isBuy = false;
      // add order to match with market order
      await orderbook.placeLimitOrder({
        order: {
          quantity,
          price,
          pairId: usdtPairId,
          localId: 'matchingorder',
          isBuy: true,
        },
      });

      orderbook['nobalancechecks'] = false;
      const order: OwnMarketOrder = {
        quantity,
        localId,
        isBuy,
        pairId: usdtPairId,
      };
      swaps.swapClientManager.checkSwapCapacities = jest.fn();

      await orderbook.placeMarketOrder({ order });

      expect(swaps.swapClientManager.checkSwapCapacities).toHaveBeenCalledWith(
        expect.objectContaining({ ...order, price }),
      );
    });

    test('placeLimitOrder adds to order book', async () => {
      const quantity = 10000;
      const price = 0.01;
      const order: OwnLimitOrder = {
        quantity,
        pairId,
        localId,
        price,
        isBuy: false,
      };

      await orderbook.placeLimitOrder({ order });
      expect(orderbook.getOwnOrderByLocalId(localId)).toHaveProperty('localId', localId);
      expect(swaps.swapClientManager.addInboundReservedAmount).toHaveBeenCalledWith('BTC', quantity * price);
      expect(swaps.swapClientManager.addOutboundReservedAmount).toHaveBeenCalledWith('LTC', quantity);
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
      await orderbook.placeLimitOrder({
        order,
        immediateOrCancel: true,
      });
      expect(() => orderbook.getOwnOrderByLocalId(localId)).toThrow(`order with local id ${localId} does not exist`);
    });

    test('placeLimitOrder with replaceOrderId replaces an order ', async () => {
      pool.broadcastOrderInvalidation = jest.fn();
      pool.broadcastOrder = jest.fn();
      const oldQuantity = 10000;
      const oldPrice = 0.01;
      const newQuantity = 20000;
      const newPrice = 0.02;
      const order: OwnLimitOrder = {
        pairId,
        localId,
        quantity: oldQuantity,
        price: oldPrice,
        isBuy: false,
      };

      const oldOrder = await orderbook.placeLimitOrder({ order });
      expect(orderbook.getOwnOrders(pairId).sellArray.length).toEqual(1);
      expect(orderbook.getOwnOrders(pairId).sellArray[0].quantity).toEqual(oldQuantity);
      expect(orderbook.getOwnOrders(pairId).sellArray[0].price).toEqual(oldPrice);
      expect(orderbook.getOwnOrders(pairId).sellArray[0].localId).toEqual(localId);

      const newOrder = await orderbook.placeLimitOrder({
        order: {
          ...order,
          price: newPrice,
          quantity: newQuantity,
        },
        replaceOrderId: localId,
      });

      expect(orderbook.getOwnOrders(pairId).sellArray.length).toEqual(1);
      expect(orderbook.getOwnOrders(pairId).sellArray[0].quantity).toEqual(newQuantity);
      expect(orderbook.getOwnOrders(pairId).sellArray[0].price).toEqual(newPrice);
      expect(orderbook.getOwnOrders(pairId).sellArray[0].localId).toEqual(localId);

      expect(pool.broadcastOrderInvalidation).toHaveBeenCalledTimes(0);
      expect(pool.broadcastOrder).toHaveBeenCalledTimes(2);
      expect(pool.broadcastOrder).toHaveBeenCalledWith({
        id: newOrder.remainingOrder!.id,
        isBuy: false,
        pairId: 'LTC/BTC',
        price: 0.02,
        quantity: 20000,
        replaceOrderId: oldOrder.remainingOrder!.id,
      });
    });
  });

  test('removeOwnOrder removes entire order if dust would have remained', async (done) => {
    const quantity = 10000;
    const order: OwnLimitOrder = {
      quantity,
      pairId,
      localId,
      price: 0.01,
      isBuy: false,
    };
    const { remainingOrder } = await orderbook.placeLimitOrder({ order });
    expect(remainingOrder!.quantity).toEqual(quantity);

    orderbook.on('ownOrder.removed', (orderPortion) => {
      expect(orderPortion.quantity).toEqual(quantity);
      expect(orderPortion.id).toEqual(remainingOrder!.id);
      expect(orderPortion.pairId).toEqual(pairId);
      done();
    });

    const removedOrder = orderbook['removeOwnOrder']({
      pairId,
      orderId: remainingOrder!.id,
      quantityToRemove: quantity - 1,
    });
    expect(removedOrder.quantity).toEqual(quantity);
  });
});
