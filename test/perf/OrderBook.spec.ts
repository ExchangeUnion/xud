import Config from '../../lib/Config';
import { SwapClientType } from '../../lib/constants/enums';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';
import NodeKey from '../../lib/nodekey/NodeKey';
import Orderbook from '../../lib/orderbook/OrderBook';
import Pool from '../../lib/p2p/Pool';
import Service from '../../lib/service/Service';
import { ServiceComponents } from '../../lib/service/types';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Swaps from '../../lib/swaps/Swaps';
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
                id: 'LTC/BTC',
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
const mockedDB = <jest.Mock<DB>>(<any>DB);
jest.mock('../../lib/nodekey/NodeKey');
const mockedNodeKey = <jest.Mock<NodeKey>>(<any>NodeKey);
jest.mock('../../lib/swaps/SwapClientManager');
/*jest.mock('../../lib/swaps/SwapClientManager', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addInboundReservedAmount: jest.fn(),
      addOutboundReservedAmount: jest.fn(),
    };
  });
});*/
const mockedSwapClientManager = <jest.Mock<SwapClientManager>>(<any>SwapClientManager);
jest.mock('../../lib/swaps/Swaps');
/*jest.mock('../../lib/swaps/Swaps', () => {
  return jest.fn().mockImplementation(() => {
    return {
      swapClientManager: new mockedSwapClientManager(),
      on: jest.fn(),
    };
  });
});*/
const mockedSwaps = <jest.Mock<Swaps>>(<any>Swaps);
jest.mock('../../lib/p2p/Pool', () => {
  return jest.fn().mockImplementation(() => {
    return {
      updatePairs: jest.fn(),
      broadcastOrder: jest.fn(),
      removeListener: jest.fn(),
      on: jest.fn(),
    };
  });
});
const mockedPool = <jest.Mock<Pool>>(<any>Pool);

jest.mock('../../lib/Logger');
const logger = new Logger({});
logger.trace = jest.fn();
logger.verbose = jest.fn();
logger.debug = jest.fn();
logger.error = jest.fn();
logger.info = jest.fn();

const config = new Config();
const db = new mockedDB();
const unitConverter = getUnitConverter();

const pairId = 'LTC/BTC';

describe('Order Book Performance Tests', () => {
  const orderBook = new Orderbook({
    unitConverter,
    logger,
    pool: new mockedPool(),
    swaps: new mockedSwaps(),
    thresholds: config.orderthresholds,
    models: db.models,
    nomatching: config.nomatching,
    nosanityswaps: config.nosanityswaps,
    nobalancechecks: true,
  });

  beforeAll(async () => {
    await orderBook.init();
    orderBook.removeAllListeners('ownOrder.removed');
    orderBook.removeAllListeners('ownOrder.added');
  });

  const components: ServiceComponents = {
    orderBook,
    logger,
    swapClientManager: new mockedSwapClientManager(),
    pool: new mockedPool(),
    swaps: new mockedSwaps(),
    version: '1.0.0',
    shutdown: jest.fn(),
    nodeKey: new mockedNodeKey(),
  };
  const service = new Service(components);

  const ORDERS_PER_SIDE = 10000;
  test(`adds ${ORDERS_PER_SIDE} buy and ${ORDERS_PER_SIDE} sell orders to the order book`, async () => {
    const promises: Promise<any>[] = [];
    for (let n = 0; n < ORDERS_PER_SIDE; n += 1) {
      promises.push(
        orderBook.placeLimitOrder({
          order: {
            pairId,
            localId: '',
            isBuy: true,
            quantity: Math.floor(Math.random() * 99980001) + 20000, // random from 20000 satoshis to 1 coin
            price: Math.random() / 200 + 0.005, // random from 0.005 to 0.01
          },
        }),
      );
      orderBook.placeLimitOrder({
        order: {
          pairId,
          localId: '',
          isBuy: false,
          quantity: Math.floor(Math.random() * 99980001) + 20000, // random from 20000 satoshis to 1 coin
          price: Math.random() / 200 + 0.01, // random from 0.01 to 0.015
        },
      });
    }
    await Promise.all(promises);
    expect(orderBook['localIdMap'].size).toEqual(ORDERS_PER_SIDE * 2);
  });

  test(`listOrders with ${ORDERS_PER_SIDE * 2} orders`, async () => {
    const orders = await service.listOrders({
      pairId,
      owner: 0,
      includeAliases: false,
      limit: 0,
    });
    expect(orders.get(pairId)!.buyArray.length).toEqual(ORDERS_PER_SIDE);
    expect(orders.get(pairId)!.sellArray.length).toEqual(ORDERS_PER_SIDE);
  });

  test(`orderbook depth chart with ${ORDERS_PER_SIDE * 2} orders`, async () => {
    const orderbook = await service.orderbook({
      pairId,
      precision: 4,
      limit: 0,
    });
    expect(orderbook.size).toEqual(1); // one trading pair
  });
});
