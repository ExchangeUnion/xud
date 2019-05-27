import Pool from '../../lib/p2p/Pool';
import Peer from '../../lib/p2p/Peer';
import Orderbook from '../../lib/orderbook/OrderBook';
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
          findAll: () => { return ['LTC/BTC']; },
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
const mockSendPacket = jest.fn();
const mockAddPair = jest.fn();
jest.mock('../../lib/p2p/Peer', () => {
  return jest.fn().mockImplementation(() => {
    return {
      activePairs: {
        add: mockAddPair,
      },
      sendPacket: mockSendPacket,
    };
  });
});
jest.mock('../../lib/p2p/Pool');
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
    pool = new Pool(config.p2p, config.network, loggers.p2p, db.models);
    swapClientManager = new SwapClientManager(config, loggers, pool);
    swaps = new Swaps(loggers.swaps, db.models, pool, swapClientManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('nosanitychecks enabled adds pairs and requests orders', async () => {
    config.nosanitychecks = true;
    orderbook = new Orderbook(loggers.orderbook, db.models, config.nomatching, pool, swaps, config.nosanitychecks);
    await orderbook.init();
    const pairIds = ['LTC/BTC', 'WETH/BTC'];
    await orderbook['verifyPeerPairs'](peer, pairIds);
    expect(mockAddPair).toHaveBeenCalledTimes(2);
    expect(mockSendPacket).toHaveBeenCalledTimes(1);
  });

});
