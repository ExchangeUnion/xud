import Service, { ServiceComponents } from '../../lib/service/Service';
import Orderbook from '../../lib/orderbook/OrderBook';
import Swaps from '../../lib/swaps/Swaps';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import Pool from '../../lib/p2p/Pool';
import Peer from '../../lib/p2p/Peer';

jest.mock('../../lib/orderbook/OrderBook');
const mockedOrderbook = <jest.Mock<Orderbook>><any>Orderbook;
jest.mock('../../lib/swaps/Swaps');
const mockedSwaps = <jest.Mock<Swaps>><any>Swaps;
jest.mock('../../lib/swaps/SwapClientManager');
const mockedSwapClientManager = <jest.Mock<SwapClientManager>><any>SwapClientManager;
jest.mock('../../lib/p2p/Pool');
const mockedPool = <jest.Mock<Pool>><any>Pool;
jest.mock('../../lib/p2p/Peer');
const mockedPeer = <jest.Mock<Peer>><any>Peer;

const getArgs = () => {
  return {
    nodePubKey: '02f8895eb03c37b2665415be4d83b20228acc0abc55ebf6728565141c66cfc164a',
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
        .toHaveBeenCalledWith(args.nodePubKey);
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

});
