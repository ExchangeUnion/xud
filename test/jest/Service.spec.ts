import Service, { ServiceComponents } from '../../lib/service/Service';
import Orderbook from '../../lib/orderbook/OrderBook';
import Swaps from '../../lib/swaps/Swaps';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Pool from '../../lib/p2p/Pool';
import Peer from '../../lib/p2p/Peer';
import SwapClient from '../../lib/swaps/SwapClient';
import { Owner } from '../../lib/constants/enums';

jest.mock('../../lib/orderbook/OrderBook');
const mockedOrderbook = <jest.Mock<Orderbook>><any>Orderbook;
jest.mock('../../lib/swaps/Swaps');
const mockedSwaps = <jest.Mock<Swaps>><any>Swaps;
jest.mock('../../lib/swaps/SwapClientManager');
const mockedSwapClientManager = <jest.Mock<SwapClientManager>><any>SwapClientManager;
jest.mock('../../lib/swaps/SwapClient');
const mockedSwapClient = <jest.Mock<SwapClient>><any>SwapClient;
jest.mock('../../lib/p2p/Pool');
const mockedPool = <jest.Mock<Pool>><any>Pool;
jest.mock('../../lib/p2p/Peer');
const mockedPeer = <jest.Mock<Peer>><any>Peer;

const getArgs = () => {
  return {
    nodeIdentifier: '02f8895eb03c37b2665415be4d83b20228acc0abc55ebf6728565141c66cfc164a',
    amount: 16000000,
    currency: 'BTC',
  };
};
describe('Service', () => {
  let service: Service;
  let components: ServiceComponents;
  let peer: Peer;

  beforeEach(() => {
    components = {
      orderBook: new mockedOrderbook(),
      swapClientManager: new mockedSwapClientManager(),
      pool: new mockedPool(),
      swaps: new mockedSwaps(),
      version: '1.0.0',
      shutdown: jest.fn(),
    };
    peer = new mockedPeer();
    components.pool.getPeer = jest.fn().mockReturnValue(peer);
    components.swapClientManager.openChannel = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('openChannel', () => {
    test('gets peer from pool for swapClientManager', async () => {
      service = new Service(components);
      const args = getArgs();
      await service.openChannel(args);
      expect(components.pool.getPeer)
        .toHaveBeenCalledWith(args.nodeIdentifier);
      expect(components.swapClientManager.openChannel)
        .toHaveBeenCalledWith({
          peer,
          amount: args.amount,
          currency: args.currency,
        });
    });

    test('throws when peer not found', async () => {
      expect.assertions(1);
      service = new Service(components);
      const args = getArgs();
      components.pool.getPeer = jest.fn().mockImplementation(() => {
        throw new Error('peer not found');
      });
      try {
        await service.openChannel(args);
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('throws when failure from swapClientManager', async () => {
      expect.assertions(1);
      service = new Service(components);
      const args = getArgs();
      components.swapClientManager.openChannel = jest.fn().mockImplementation(() => {
        throw new Error('swapClientManager openChannel failure');
      });
      try {
        await service.openChannel(args);
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });
  });

  describe('getBalance', () => {
    const setup = () => {
      service = new Service(components);
      components.swapClientManager.swapClients = new Map();
      components.swapClientManager.get = jest.fn().mockImplementation((arg) => {
        return components.swapClientManager.swapClients.get(arg);
      });

      const btcClient = new mockedSwapClient();
      btcClient.isConnected = jest.fn().mockImplementation(() => true);
      btcClient.channelBalance = jest.fn().mockImplementation(() => {
        return Promise.resolve({ balance: 70000, inactiveBalance: 18817, pendingOpenBalance: 190191 });
      });
      btcClient.walletBalance = jest.fn().mockImplementation(() => {
        return Promise.resolve({ totalBalance: 10000, confirmedBalance: 10000, unconfirmedBalance: 0 });
      });
      components.swapClientManager.swapClients.set('BTC', btcClient);

      const ltcClient = new mockedSwapClient();
      ltcClient.isConnected = jest.fn().mockImplementation(() => true);
      ltcClient.channelBalance = jest.fn().mockImplementation(() => {
        return Promise.resolve({ balance: 0, inactiveBalance: 12345, pendingOpenBalance: 0 });
      });
      ltcClient.walletBalance = jest.fn().mockImplementation(() => {
        return Promise.resolve({ totalBalance: 2000, confirmedBalance: 1500, unconfirmedBalance: 500 });
      });
      components.swapClientManager.swapClients.set('LTC', ltcClient);

      const bchClient = new mockedSwapClient();
      bchClient.isConnected = jest.fn().mockImplementation(() => false);
      components.swapClientManager.swapClients.set('BCH', bchClient);
    };

    test('returns balance for all connected clients when currency is not specified', async () => {
      setup();
      const result = await service.getBalance({ currency: '' });
      expect(result.size).toEqual(2);

      const btcBalance = result.get('BTC')!;
      expect(btcBalance).toBeTruthy();
      expect(btcBalance.channelBalance).toEqual(70000);
      expect(btcBalance.pendingChannelBalance).toEqual(190191);
      expect(btcBalance.inactiveChannelBalance).toEqual(18817);
      expect(btcBalance.walletBalance).toEqual(10000);
      expect(btcBalance.unconfirmedWalletBalance).toEqual(0);
      expect(btcBalance.totalBalance).toEqual(289008);

      const ltcBalance = result.get('LTC')!;
      expect(ltcBalance).toBeTruthy();
      expect(ltcBalance.channelBalance).toEqual(0);
      expect(ltcBalance.pendingChannelBalance).toEqual(0);
      expect(ltcBalance.inactiveChannelBalance).toEqual(12345);
      expect(ltcBalance.walletBalance).toEqual(1500);
      expect(ltcBalance.unconfirmedWalletBalance).toEqual(500);
      expect(ltcBalance.totalBalance).toEqual(14345);
    });

    test('returns balance for specified currency', async () => {
      setup();
      const result = await service.getBalance({ currency: 'BTC' });
      expect(result.size).toEqual(1);

      const btcBalance = result.get('BTC')!;
      expect(btcBalance).toBeTruthy();
      expect(btcBalance.channelBalance).toEqual(70000);
      expect(btcBalance.pendingChannelBalance).toEqual(190191);
      expect(btcBalance.inactiveChannelBalance).toEqual(18817);
      expect(btcBalance.walletBalance).toEqual(10000);
      expect(btcBalance.unconfirmedWalletBalance).toEqual(0);
      expect(btcBalance.totalBalance).toEqual(289008);
    });

    test('throws in case of invalid currency', async () => {
      setup();
      await expect(service.getBalance({ currency: 'A' })).rejects.toMatchSnapshot();
    });

    test('throws when swap client is not found', async () => {
      setup();
      await expect(service.getBalance({ currency: 'BBB' })).rejects.toMatchSnapshot();
    });
  });

  describe('tradingLimits', () => {
    const setup = () => {
      service = new Service(components);
      components.swapClientManager.swapClients = new Map();
      components.swapClientManager.get = jest.fn().mockImplementation((arg) => {
        return components.swapClientManager.swapClients.get(arg);
      });

      const btcClient = new mockedSwapClient();
      btcClient.isConnected = jest.fn().mockImplementation(() => true);
      btcClient.tradingLimits = jest.fn().mockImplementation(() => {
        return Promise.resolve({ maxSell: 2000, maxBuy: 1500 });
      });
      components.swapClientManager.swapClients.set('BTC', btcClient);

      const ltcClient = new mockedSwapClient();
      ltcClient.isConnected = jest.fn().mockImplementation(() => true);
      ltcClient.tradingLimits = jest.fn().mockImplementation(() => {
        return Promise.resolve({ maxSell: 7000, maxBuy: 5500 });
      });
      components.swapClientManager.swapClients.set('LTC', ltcClient);

      const bchClient = new mockedSwapClient();
      bchClient.isConnected = jest.fn().mockImplementation(() => false);
      components.swapClientManager.swapClients.set('BCH', bchClient);
    };

    test('returns trading limits for all connected clients when currency is not specified', async () => {
      setup();
      const result = await service.tradingLimits({ currency: '' });
      expect(result.size).toEqual(2);

      const btcTradingLimits = result.get('BTC')!;
      expect(btcTradingLimits).toBeTruthy();
      expect(btcTradingLimits.maxSell).toEqual(2000);
      expect(btcTradingLimits.maxBuy).toEqual(1500);

      const ltcTradingLimits = result.get('LTC')!;
      expect(ltcTradingLimits).toBeTruthy();
      expect(ltcTradingLimits.maxSell).toEqual(7000);
      expect(ltcTradingLimits.maxBuy).toEqual(5500);
    });

    test('returns trading limits for specified currency', async () => {
      setup();
      const result = await service.tradingLimits({ currency: 'BTC' });
      expect(result.size).toEqual(1);

      const btcTradingLimits = result.get('BTC')!;
      expect(btcTradingLimits).toBeTruthy();
      expect(btcTradingLimits.maxSell).toEqual(2000);
      expect(btcTradingLimits.maxBuy).toEqual(1500);
    });

    test('throws in case of invalid currency', async () => {
      setup();
      await expect(service.tradingLimits({ currency: 'A' })).rejects.toMatchSnapshot();
    });

    test('throws when swap client is not found', async () => {
      setup();
      await expect(service.tradingLimits({ currency: 'BBB' })).rejects.toMatchSnapshot();
    });
  });

  describe('listOrders', () => {
    const pairIds = ['BTC/LTC', 'WETH/BTC'];

    const setup = (peersOrders: any, ownOrders: any) => {
      Object.defineProperty(components.orderBook, 'pairIds', { value: pairIds });
      components.orderBook.getPeersOrders = jest.fn().mockImplementation(() => peersOrders);
      components.orderBook.getOwnOrders = jest.fn().mockImplementation(() => ownOrders);
      service = new Service(components);
    };

    const createOrder = (price: number, createdAt: number) => {
      return {
        price,
        createdAt,
      };
    };

    test('returns no orders if nothing is listed in the orderbook', () => {
      const peersOrders = { buyArray: [], sellArray: [] };
      const ownOrders = { buyArray: [], sellArray: [] };
      setup(peersOrders, ownOrders);

      const result = service.listOrders({ pairId: '', owner: Owner.Both, limit: 0 });
      expect(result.size).toEqual(pairIds.length);
      expect(result.get(pairIds[0])!.buyArray.length).toEqual(0);
      expect(result.get(pairIds[0])!.sellArray.length).toEqual(0);
      expect(result.get(pairIds[1])!.buyArray.length).toEqual(0);
      expect(result.get(pairIds[1])!.sellArray.length).toEqual(0);
    });

    test('returns both own and peer orders for all trading pairs', () => {
      const peersOrders = { buyArray: [createOrder(1, 123)], sellArray: [createOrder(3, 222), createOrder(1, 999)] };
      const ownOrders = { buyArray: [createOrder(1, 999)], sellArray: [createOrder(2, 123)] };
      setup(peersOrders, ownOrders);

      const result = service.listOrders({ pairId: '', owner: Owner.Both, limit: 0 });
      expect(result.size).toEqual(pairIds.length);
      expect(result.get(pairIds[0])!.buyArray.length).toEqual(2);
      expect(result.get(pairIds[0])!.sellArray.length).toEqual(3);
      expect(result.get(pairIds[1])!.buyArray.length).toEqual(2);
      expect(result.get(pairIds[1])!.sellArray.length).toEqual(3);
    });

    test('returns both own and peer orders for the specified trading pair', () => {
      const peersOrders = { buyArray: [createOrder(1, 123)], sellArray: [createOrder(3, 222), createOrder(1, 999)] };
      const ownOrders = { buyArray: [createOrder(1, 999)], sellArray: [createOrder(2, 123)] };
      setup(peersOrders, ownOrders);

      const result = service.listOrders({ pairId: pairIds[0], owner: Owner.Both, limit: 0 });
      expect(result.size).toEqual(1);
      expect(result.get(pairIds[0])!.buyArray.length).toEqual(2);
      expect(result.get(pairIds[0])!.sellArray.length).toEqual(3);
    });

    test('returns only peer orders', () => {
      const peersOrders = { buyArray: [createOrder(1, 123)], sellArray: [createOrder(3, 222), createOrder(1, 999)] };
      const ownOrders = { buyArray: [createOrder(1, 999), createOrder(1, 123)], sellArray: [createOrder(2, 123)] };
      setup(peersOrders, ownOrders);

      const result = service.listOrders({ pairId: pairIds[0], owner: Owner.Peer, limit: 0 });
      expect(result.size).toEqual(1);
      expect(result.get(pairIds[0])!.buyArray.length).toEqual(1);
      expect(result.get(pairIds[0])!.sellArray.length).toEqual(2);
    });

    test('returns only own orders', () => {
      const peersOrders = { buyArray: [createOrder(1, 123)], sellArray: [createOrder(3, 222), createOrder(1, 999)] };
      const ownOrders = { buyArray: [createOrder(1, 999), createOrder(1, 123)], sellArray: [createOrder(2, 123)] };
      setup(peersOrders, ownOrders);

      const result = service.listOrders({ pairId: pairIds[0], owner: Owner.Own, limit: 0 });
      expect(result.size).toEqual(1);
      expect(result.get(pairIds[0])!.buyArray.length).toEqual(2);
      expect(result.get(pairIds[0])!.sellArray.length).toEqual(1);
    });

    test('returns limited amount of orders', () => {
      const peersOrders = { buyArray: [createOrder(1, 111)], sellArray: [createOrder(4, 222), createOrder(5, 999)] };
      const ownOrders = { buyArray: [createOrder(3, 999), createOrder(2, 123)], sellArray: [createOrder(6, 123)] };
      setup(peersOrders, ownOrders);

      const result = service.listOrders({ pairId: pairIds[0], owner: Owner.Both, limit: 2 });
      expect(result.size).toEqual(1);
      expect(result.get(pairIds[0])!.buyArray.length).toEqual(2);
      expect(result.get(pairIds[0])!.buyArray.some(val => val.price === 1)).toBeTruthy();
      expect(result.get(pairIds[0])!.sellArray.length).toEqual(2);
      expect(result.get(pairIds[0])!.sellArray.some(val => val.price === 6)).toBeTruthy();
    });

  });
});
