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
import { XuNetwork } from '../../lib/constants/enums';

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
            return [
              { id: 'LTC' },
              { id: 'BTC' },
            ];
          },
        },
      },
    };
  });
});
const mockActivatePair = jest.fn();
jest.mock('../../lib/p2p/Peer', () => {
  return jest.fn().mockImplementation(() => {
    return {
      activatePair: mockActivatePair,
    };
  });
});
jest.mock('../../lib/p2p/Pool', () => {
  return jest.fn().mockImplementation(() => {
    return {
      updatePairs: jest.fn(),
      on: jest.fn(),
    };
  });
});
jest.mock('../../lib/Config');
jest.mock('../../lib/swaps/Swaps');
jest.mock('../../lib/swaps/SwapClientManager');
jest.mock('../../lib/Logger');

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

  beforeEach(() => {
    config = new Config();
    network = new Network(XuNetwork.TestNet);
    peer = new Peer(loggers.p2p, {
      host: 'localhost',
      port: 9735,
    }, network);
    db = new DB(loggers.db, config.dbpath);
    pool = new Pool(config.p2p, config.network, loggers.p2p, db.models, '1.0.0');
    swapClientManager = new SwapClientManager(config, loggers, pool);
    swaps = new Swaps(loggers.swaps, db.models, pool, swapClientManager);
    swaps.swapClientManager = swapClientManager;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('nosanitychecks enabled adds pairs and requests orders', async () => {
    config.nosanitychecks = true;
    orderbook = new Orderbook({
      pool,
      swaps,
      logger: loggers.orderbook,
      models: db.models,
      nomatching: config.nomatching,
      nosanitychecks: config.nosanitychecks,
    });
    await orderbook.init();
    const pairIds = ['LTC/BTC', 'WETH/BTC'];
    await orderbook['verifyPeerPairs'](peer, pairIds);
    expect(mockActivatePair).toHaveBeenCalledTimes(2);
  });

  test('placeOrder insufficient outbound balance does throw when nosanitychecks disabled', async () => {
    config.nosanitychecks = false;
    orderbook = new Orderbook({
      pool,
      swaps,
      logger: loggers.orderbook,
      models: db.models,
      nomatching: config.nomatching,
      nosanitychecks: config.nosanitychecks,
    });
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
        outboundCurrency: 'LTC',
        outboundAmount: quantity,
      };
    };
    swaps.swapClientManager.get = jest.fn().mockReturnValue({
      maximumOutboundCapacity: 1,
    });
    await expect(orderbook.placeLimitOrder(order))
      .rejects.toMatchSnapshot();
  });

});
