import Swaps, { OrderToAccept } from '../../../lib/swaps/Swaps';
import Pool from '../../../lib/p2p/Pool';
import Peer from '../../../lib/p2p/Peer';
import Logger from '../../../lib/Logger';
import DB from '../../../lib/db/DB';
import SwapClientManager from '../../../lib/swaps/SwapClientManager';
import { SwapRequestPacket, SwapRequestPacketBody } from '../../../lib/p2p/packets/types';
import { SwapFailureReason, SwapClientType } from '../../../lib/constants/enums';
import LndClient from '../../../lib/lndclient/LndClient';

jest.mock('../../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>><any>Logger;
jest.mock('../../../lib/db/DB');
const mockedDB = <jest.Mock<DB>><any>DB;
jest.mock('../../../lib/p2p/Pool');
const mockedPool = <jest.Mock<Pool>><any>Pool;
jest.mock('../../../lib/swaps/SwapClientManager');
const mockedSwapClientManager = <jest.Mock<SwapClientManager>><any>SwapClientManager;
jest.mock('../../../lib/p2p/Peer');
const mockedPeer = <jest.Mock<Peer>><any>Peer;
jest.mock('../../../lib/lndclient/LndClient');
const mockedLnd = <jest.Mock<LndClient>><any>LndClient;
jest.mock('../../../lib/swaps/SwapRepository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      saveSwapDeal: jest.fn(),
    };
  });
});
const getMockedLnd = (cltvDelta: number) => {
  const lnd = new mockedLnd();
  // @ts-ignore
  lnd.cltvDelta = cltvDelta;
  // @ts-ignore
  lnd.type = SwapClientType.Lnd;
  lnd.isConnected = jest.fn().mockReturnValue(true);
  const removeInvoice = jest.fn().mockImplementation(() => {
    return { catch: () => {} };
  });
  lnd.removeInvoice = removeInvoice;
  lnd.addInvoice = jest.fn();
  return lnd;
};
const getOrderToAccept = (): OrderToAccept => {
  return {
    quantity: 10000,
    localId: '0d719480-8f6f-11e9-8ac2-8964e204f887',
    price: 0.1,
    isBuy: true,
  };
};
const getSwapRequestBody = (): SwapRequestPacketBody => {
  return {
    takerCltvDelta: 144,
    rHash: 'a107be9e62d2df05894e36cff748b5cd6bb972756eace4ce56a54ba2db9421e6',
    orderId: '513b8cb0-8f7a-11e9-b20f-95f93042fabc',
    pairId: 'LTC/BTC',
    proposedQuantity: 10000,
  };
};
describe('Swaps', () => {
  let swaps: Swaps;
  let pool: Pool;
  let logger: Logger;
  let db: DB;
  let swapClientManager: SwapClientManager;
  let peer: Peer;
  let lndBtc: LndClient;
  let lndLtc: LndClient;
  let makerCurrency: string;
  let takerCurrency: string;

  beforeEach(() => {
    logger = new mockedLogger();
    logger.debug = jest.fn();
    logger.error = jest.fn();
    db = new mockedDB();
    pool = new mockedPool();
    swapClientManager = new mockedSwapClientManager();
    swapClientManager.get = jest.fn();
    peer = new mockedPeer();
    peer.sendPacket = jest.fn();
    lndBtc = getMockedLnd(144);
    lndLtc = getMockedLnd(576);
    makerCurrency = 'LTC';
    takerCurrency = 'BTC';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('acceptDeal', () => {

    test('it rejects already used hash', async () => {
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      swaps['usedHashes'].add(swapRequestBody.rHash);
      swaps['sendErrorToPeer'] = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledTimes(1);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(expect.objectContaining({
        failureReason: SwapFailureReason.PaymentHashReuse,
      }));
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects without taker currency swap client', async () => {
      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === makerCurrency) {
          return new mockedLnd();
        }
        return;
      });
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      swaps['sendErrorToPeer'] = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledTimes(1);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(expect.objectContaining({
        failureReason: SwapFailureReason.SwapClientNotSetup,
      }));
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects without maker currency swap client', async () => {
      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === takerCurrency) {
          return lndBtc;
        }
        return;
      });
      pool.addReputationEvent = jest.fn();
      peer.getIdentifier = jest.fn();
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      swaps['sendErrorToPeer'] = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledTimes(1);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(expect.objectContaining({
        failureReason: SwapFailureReason.SwapClientNotSetup,
      }));
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects upon 0 makerToTakerRoutes found', async () => {
      lndBtc.getRoutes = jest.fn().mockReturnValue([]);
      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === takerCurrency) {
          return lndBtc;
        }
        if (currency === makerCurrency) {
          return lndLtc;
        }
        return;
      });
      pool.addReputationEvent = jest.fn();
      peer.getIdentifier = jest.fn();
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      swaps['sendErrorToPeer'] = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledTimes(1);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(expect.objectContaining({
        failureReason: SwapFailureReason.NoRouteFound,
      }));
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects upon failed getHeight request', async () => {
      lndBtc.getRoutes = jest.fn().mockReturnValue([
        { getTotalTimeLock: () => 1543845 },
      ]);
      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === takerCurrency) {
          return lndBtc;
        }
        if (currency === makerCurrency) {
          return lndLtc;
        }
        return;
      });
      pool.addReputationEvent = jest.fn();
      peer.getIdentifier = jest.fn();
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      swaps['sendErrorToPeer'] = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledTimes(1);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(expect.objectContaining({
        failureReason: SwapFailureReason.UnexpectedClientError,
      }));
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects upon failed addInvoice request', async () => {
      lndLtc.addInvoice = jest.fn().mockImplementation(() => {
        throw new Error('addInvoice failure');
      });
      lndBtc.getRoutes = jest.fn().mockReturnValue([
        { getTotalTimeLock: () => 1543845 },
      ]);
      lndBtc.getHeight = jest.fn().mockReturnValue(1543701);
      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === takerCurrency) {
          return lndBtc;
        }
        if (currency === makerCurrency) {
          return lndLtc;
        }
        return;
      });
      pool.addReputationEvent = jest.fn();
      peer.getIdentifier = jest.fn();
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      swaps['sendErrorToPeer'] = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledTimes(1);
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(expect.objectContaining({
        failureReason: SwapFailureReason.UnexpectedClientError,
      }));
      expect(dealAccepted).toEqual(false);
    });

    test('it accepts deal', async () => {
      const peerLndBtcPubKey = '02d9fb6c41686b7bee95958bde0ada72c249b8fa9928987c93d839225d6883e6c0';
      lndBtc.getRoutes = jest.fn().mockReturnValue([
        { getTotalTimeLock: () => 1543845 },
      ]);
      lndBtc.getHeight = jest.fn().mockReturnValue(1543701);
      Object.defineProperty(lndBtc, 'minutesPerBlock', {
        get: () => { return 10; },
      });
      Object.defineProperty(lndLtc, 'minutesPerBlock', {
        get: () => { return 2.5; },
      });
      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === takerCurrency) {
          return lndBtc;
        }
        if (currency === makerCurrency) {
          return lndLtc;
        }
        return;
      });
      pool.addReputationEvent = jest.fn();
      peer.getIdentifier = jest.fn().mockImplementation((clientType, currency) => {
        if (clientType === SwapClientType.Lnd && currency === takerCurrency) {
          return peerLndBtcPubKey;
        }
        throw new Error(`mock peer.getIdentifier does not support ${currency}`);
      });
      swaps = new Swaps(logger, db.models, pool, swapClientManager);
      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      peer.sendPacket = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(dealAccepted).toEqual(true);
      expect(lndBtc.getRoutes).toHaveBeenCalledWith(
        1000,
        peerLndBtcPubKey,
        takerCurrency,
        swapRequestBody.takerCltvDelta,
      );
      expect(lndLtc.addInvoice).toHaveBeenCalledTimes(1);
      const expectedMakerCltvDelta = 1152;
      expect(lndLtc.addInvoice).toHaveBeenCalledWith(
        swapRequestBody.rHash,
        swapRequestBody.proposedQuantity,
        expectedMakerCltvDelta,
      );
      expect(peer.sendPacket).toHaveBeenCalledTimes(1);
      // @ts-ignore
      const actualSendSwapAcceptedPacket = peer.sendPacket.mock.calls[0][0];
      expect(actualSendSwapAcceptedPacket.body).toEqual({
        rHash: swapRequestBody.rHash,
        quantity: swapRequestBody.proposedQuantity,
        makerCltvDelta: expectedMakerCltvDelta,
      });
    });

  });

});
