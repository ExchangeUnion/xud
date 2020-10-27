import { SwapClientType, SwapFailureReason, SwapPhase, ReputationEvent, SwapRole, SwapState } from '../../../lib/constants/enums';
import DB from '../../../lib/db/DB';
import LndClient from '../../../lib/lndclient/LndClient';
import Logger from '../../../lib/Logger';
import { SwapRequestPacket, SwapRequestPacketBody } from '../../../lib/p2p/packets/types';
import Peer from '../../../lib/p2p/Peer';
import Pool from '../../../lib/p2p/Pool';
import SwapClientManager from '../../../lib/swaps/SwapClientManager';
import Swaps, { OrderToAccept } from '../../../lib/swaps/Swaps';
import { SwapDeal } from '../../../lib/swaps/types';
import { getValidDeal } from '../../utils';

const addReputationEvent = jest.fn().mockImplementation(() => {
  return { catch: () => {} };
});

let peer: Peer;

jest.mock('../../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>><any>Logger;
jest.mock('../../../lib/db/DB');
const mockedDB = <jest.Mock<DB>><any>DB;
jest.mock('../../../lib/p2p/Pool', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addReputationEvent,
      on: jest.fn(),
      tryGetPeer: () => peer,
      getNodeAlias: () => peer,
    };
  });
});
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
const getMockedLnd = (cltvDelta: number, minutesPerBlock: number) => {
  const lnd = new mockedLnd();
  // @ts-ignore
  lnd.finalLock = cltvDelta;
  // @ts-ignore
  lnd.type = SwapClientType.Lnd;
  // @ts-ignore
  lnd.minutesPerBlock = minutesPerBlock;
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

describe('Swaps Integration', () => {
  let swaps: Swaps;
  let pool: Pool;
  let logger: Logger;
  let db: DB;
  let swapClientManager: SwapClientManager;
  let lndBtc: LndClient;
  let lndLtc: LndClient;
  let makerCurrency: string;
  let takerCurrency: string;

  beforeEach(() => {
    logger = new mockedLogger();
    logger.debug = jest.fn();
    logger.info = jest.fn();
    logger.error = jest.fn();
    logger.warn = jest.fn();
    logger.trace = jest.fn();
    logger.createSubLogger = () => logger;
    db = new mockedDB();
    pool = new mockedPool();
    swapClientManager = new mockedSwapClientManager();
    swapClientManager.get = jest.fn();
    peer = new mockedPeer();
    peer.sendPacket = jest.fn();
    lndBtc = getMockedLnd(40, 10);
    lndLtc = getMockedLnd(576, 2.5);
    makerCurrency = 'LTC';
    takerCurrency = 'BTC';

    swaps = new Swaps({
      logger,
      pool,
      swapClientManager,
      models: db.models,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('acceptDeal', () => {
    test('it rejects already used hash', async () => {
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

    test('it rejects upon 0 maker to taker routes found', async () => {
      lndBtc.getRoute = jest.fn().mockReturnValue(undefined);
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
      lndBtc.getRoute = jest.fn().mockReturnValue({
        getTotalTimeLock: () => 1543845,
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
      peer.getIdentifier = jest.fn();
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
      lndBtc.getRoute = jest.fn().mockReturnValue({
        getTotalTimeLock: () => 1543845,
      });
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

    test('it accepts a valid deal', async () => {
      const peerLndBtcPubKey = '02d9fb6c41686b7bee95958bde0ada72c249b8fa9928987c93d839225d6883e6c0';
      lndBtc.getRoute = jest.fn().mockReturnValue({
        getTotalTimeLock: () => 1543845,
      });
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

      const orderToAccept = getOrderToAccept();
      const swapRequestBody = getSwapRequestBody();
      const swapRequestPacket = new SwapRequestPacket(swapRequestBody);
      peer.sendPacket = jest.fn();
      const dealAccepted = await swaps.acceptDeal(orderToAccept, swapRequestPacket, peer);
      expect(dealAccepted).toEqual(true);
      expect(lndBtc.getRoute).toHaveBeenCalledWith(
        1000,
        peerLndBtcPubKey,
        takerCurrency,
        swapRequestBody.takerCltvDelta,
      );
      expect(lndLtc.addInvoice).toHaveBeenCalledTimes(1);
      const expectedMakerCltvDelta = 1641;
      expect(lndLtc.addInvoice).toHaveBeenCalledWith({
        rHash: swapRequestBody.rHash,
        units: swapRequestBody.proposedQuantity,
        expiry: expectedMakerCltvDelta,
        currency: makerCurrency,
      });
      expect(peer.sendPacket).toHaveBeenCalledTimes(1);
      // @ts-ignore
      const actualSendSwapAcceptedPacket = peer.sendPacket.mock.calls[0][0];
      expect(actualSendSwapAcceptedPacket.body).toEqual({
        rHash: swapRequestBody.rHash,
        quantity: swapRequestBody.proposedQuantity,
        makerCltvDelta: expectedMakerCltvDelta,
      });

      // clear timeouts waiting for swap to complete
      clearTimeout(swaps['timeouts'].get(swapRequestBody.rHash));
    });
  });

  describe('setDealPhase', () => {
    test('it sets the phase to PreimageResolved', async () => {
      const deal: SwapDeal = getValidDeal(SwapPhase.SendingPayment);

      deal.executeTime = Date.now() - 1;
      const swapPaidCallback = jest.fn();
      swaps.on('swap.paid', swapPaidCallback);

      await swaps['setDealPhase'](deal, SwapPhase.PreimageResolved);

      expect(swapPaidCallback).toHaveBeenCalledTimes(1);
      expect(addReputationEvent).toHaveBeenCalledTimes(0);
      expect(deal.phase).toEqual(SwapPhase.PreimageResolved);
    });

    test('it sets the phase to PreimageResolved but punishes the peer if it is late', async () => {
      const deal: SwapDeal = getValidDeal(SwapPhase.SendingPayment);

      deal.executeTime = Date.now() - Swaps['SWAP_COMPLETE_TIMEOUT'] - Swaps['SWAP_COMPLETE_MAKER_BUFFER'] - 1;
      const swapPaidCallback = jest.fn();
      swaps.on('swap.paid', swapPaidCallback);

      await swaps['setDealPhase'](deal, SwapPhase.PreimageResolved);

      expect(swapPaidCallback).toHaveBeenCalledTimes(1);
      expect(addReputationEvent).toHaveBeenCalledTimes(1);
      expect(addReputationEvent).toHaveBeenCalledWith(deal.takerPubKey, ReputationEvent.SwapDelay);
      expect(deal.phase).toEqual(SwapPhase.PreimageResolved);
    });

    test('it sets the phase to PreimageResolved but bans the peer if it is very late', async () => {
      const deal: SwapDeal = getValidDeal(SwapPhase.SendingPayment);

      deal.executeTime = Date.now() - Swaps['SWAP_COMPLETE_TIMEOUT'] - Swaps['SWAP_ABUSE_TIME_LIMIT'] - 1;
      const swapPaidCallback = jest.fn();
      swaps.on('swap.paid', swapPaidCallback);

      await swaps['setDealPhase'](deal, SwapPhase.PreimageResolved);

      expect(swapPaidCallback).toHaveBeenCalledTimes(1);
      expect(addReputationEvent).toHaveBeenCalledTimes(1);
      expect(addReputationEvent).toHaveBeenCalledWith(deal.takerPubKey, ReputationEvent.SwapAbuse);
      expect(deal.phase).toEqual(SwapPhase.PreimageResolved);
    });
  });

  describe('failDeal', () => {
    test('it fails a deal in SendingPayment phase as taker', async () => {
      const deal: SwapDeal = getValidDeal(SwapPhase.SendingPayment, SwapRole.Taker);

      swapClientManager.get = jest.fn().mockImplementation((currency) => {
        if (currency === deal.takerCurrency) {
          return lndBtc;
        }
        return;
      });

      const swapFailedCallback = jest.fn();
      swaps.on('swap.failed', swapFailedCallback);

      await swaps['failDeal']({
        deal,
        failureReason: SwapFailureReason.UnknownError,
      });

      expect(swapFailedCallback).toHaveBeenCalledTimes(1);
      expect(swapFailedCallback).toHaveBeenCalledWith(deal);
      expect(lndBtc.removeInvoice).toHaveBeenCalledTimes(1);
      expect(lndBtc.removeInvoice).toHaveBeenCalledWith(deal.rHash);
      expect(deal.state).toEqual(SwapState.Error);
    });
  });
});
