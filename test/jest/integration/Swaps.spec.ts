import {
  ReputationEvent,
  SwapClientType,
  SwapFailureReason,
  SwapPhase,
  SwapRole,
  SwapState,
} from '../../../lib/constants/enums';
import DB from '../../../lib/db/DB';
import LndClient from '../../../lib/lndclient/LndClient';
import Logger from '../../../lib/Logger';
import { SwapRequestPacket, SwapRequestPacketBody } from '../../../lib/p2p/packets/types';
import Peer from '../../../lib/p2p/Peer';
import Pool from '../../../lib/p2p/Pool';
import SwapClientManager from '../../../lib/swaps/SwapClientManager';
import Swaps, { OrderToAccept } from '../../../lib/swaps/Swaps';
import { SwapDeal } from '../../../lib/swaps/types';
import { getUnitConverter, getValidDeal } from '../../utils';

const addReputationEvent = jest.fn().mockImplementation(() => {
  return { catch: () => {} };
});

let peer: Peer;

jest.mock('../../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>>(<any>Logger);
jest.mock('../../../lib/db/DB');
const mockedDB = <jest.Mock<DB>>(<any>DB);
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
const mockedPool = <jest.Mock<Pool>>(<any>Pool);
jest.mock('../../../lib/swaps/SwapClientManager');
const mockedSwapClientManager = <jest.Mock<SwapClientManager>>(<any>SwapClientManager);
jest.mock('../../../lib/p2p/Peer');
const mockedPeer = <jest.Mock<Peer>>(<any>Peer);
jest.mock('../../../lib/lndclient/LndClient');
const mockedLnd = <jest.Mock<LndClient>>(<any>LndClient);
jest.mock('../../../lib/swaps/SwapRepository', () => {
  return jest.fn().mockImplementation(() => {
    return { saveSwapDeal: jest.fn() };
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
  const unitConverter = getUnitConverter();

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
      unitConverter,
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
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(
        expect.objectContaining({ failureReason: SwapFailureReason.PaymentHashReuse }),
      );
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
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(
        expect.objectContaining({ failureReason: SwapFailureReason.SwapClientNotSetup }),
      );
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
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(
        expect.objectContaining({ failureReason: SwapFailureReason.SwapClientNotSetup }),
      );
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
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(
        expect.objectContaining({ failureReason: SwapFailureReason.NoRouteFound }),
      );
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects upon failed getHeight request', async () => {
      lndBtc.getRoute = jest.fn().mockReturnValue({ getTotalTimeLock: () => 1543845 });
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
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(
        expect.objectContaining({ failureReason: SwapFailureReason.UnexpectedClientError }),
      );
      expect(dealAccepted).toEqual(false);
    });

    test('it rejects upon failed addInvoice request', async () => {
      lndLtc.addInvoice = jest.fn().mockImplementation(() => {
        throw new Error('addInvoice failure');
      });
      lndBtc.getRoute = jest.fn().mockReturnValue({ getTotalTimeLock: () => 1543845 });
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
      expect(swaps['sendErrorToPeer']).toHaveBeenCalledWith(
        expect.objectContaining({ failureReason: SwapFailureReason.UnexpectedClientError }),
      );
      expect(dealAccepted).toEqual(false);
    });

    test('it accepts a valid deal', async () => {
      const peerLndBtcPubKey = '02d9fb6c41686b7bee95958bde0ada72c249b8fa9928987c93d839225d6883e6c0';
      lndBtc.getRoute = jest.fn().mockReturnValue({ getTotalTimeLock: () => 1543845 });
      lndBtc.getHeight = jest.fn().mockReturnValue(1543701);
      Object.defineProperty(lndBtc, 'minutesPerBlock', {
        get: () => {
          return 10;
        },
      });
      Object.defineProperty(lndLtc, 'minutesPerBlock', {
        get: () => {
          return 2.5;
        },
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
        1000n,
        peerLndBtcPubKey,
        takerCurrency,
        swapRequestBody.takerCltvDelta,
      );
      expect(lndLtc.addInvoice).toHaveBeenCalledTimes(1);
      const expectedMakerCltvDelta = 1641;
      expect(lndLtc.addInvoice).toHaveBeenCalledWith({
        rHash: swapRequestBody.rHash,
        units: BigInt(swapRequestBody.proposedQuantity),
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

  describe('calculateMakerTakerAmounts', () => {
    const quantity = 1000000;
    const price = 0.005;
    const takerCltvDelta = 144;
    const orderId = 'f8a85c66-7e73-43cd-9ac4-176ff4cc28a8';
    const rHash = '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2';
    const pairId = 'LTC/BTC';
    const peerPubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
    /** A swap deal for a buy order. */
    const buyDeal: SwapDeal = {
      quantity,
      price,
      takerCltvDelta,
      orderId,
      rHash,
      pairId,
      peerPubKey,
      role: SwapRole.Maker,
      phase: SwapPhase.SwapCreated,
      state: SwapState.Active,
      localId: '1',
      proposedQuantity: quantity,
      isBuy: true,
      makerCurrency: 'LTC',
      takerCurrency: 'BTC',
      makerAmount: quantity,
      takerAmount: quantity * price,
      makerUnits: BigInt(quantity),
      takerUnits: BigInt(quantity * price),
      createTime: 1540716251106,
    };

    const buyDealEth = {
      ...buyDeal,
      pairId: 'ETH/BTC',
      makerCurrency: 'ETH',
      takerCurrency: 'BTC',
      makerAmount: quantity,
      takerAmount: quantity * price,
      makerUnits: 10n ** 10n * BigInt(quantity),
      takerUnits: BigInt(quantity * price),
    };

    /** A swap deal for a sell order, mirrored from the buy deal for convenience. */
    const sellDeal = {
      ...buyDeal,
      isBuy: false,
      takerCurrency: buyDeal.makerCurrency,
      makerCurrency: buyDeal.takerCurrency,
      takerAmount: buyDeal.makerAmount,
      makerAmount: buyDeal.takerAmount,
      takerUnits: buyDeal.makerUnits,
      makerUnits: buyDeal.takerUnits,
    };

    it('should calculate swap amounts and currencies for a buy order', () => {
      const { makerCurrency, makerAmount, takerCurrency, takerAmount, makerUnits, takerUnits } = swaps[
        'calculateMakerTakerAmounts'
      ](buyDeal.quantity!, buyDeal.price, buyDeal.isBuy, buyDeal.pairId);
      expect(makerAmount).toEqual(buyDeal.makerAmount);
      expect(takerAmount).toEqual(buyDeal.takerAmount);
      expect(makerUnits).toEqual(buyDeal.makerUnits);
      expect(takerUnits).toEqual(buyDeal.takerUnits);
      expect(makerCurrency).toEqual(buyDeal.makerCurrency);
      expect(takerCurrency).toEqual(buyDeal.takerCurrency);
    });

    it('should calculate swap amounts and currencies for a sell order', () => {
      const { makerCurrency, makerAmount, takerCurrency, takerAmount, makerUnits, takerUnits } = swaps[
        'calculateMakerTakerAmounts'
      ](sellDeal.quantity!, sellDeal.price, sellDeal.isBuy, sellDeal.pairId);
      expect(makerAmount).toEqual(sellDeal.makerAmount);
      expect(takerAmount).toEqual(sellDeal.takerAmount);
      expect(makerUnits).toEqual(sellDeal.makerUnits);
      expect(takerUnits).toEqual(sellDeal.takerUnits);
      expect(makerCurrency).toEqual(sellDeal.makerCurrency);
      expect(takerCurrency).toEqual(sellDeal.takerCurrency);
    });

    it('should calculate swap amounts and currencies for an ETH buy order', () => {
      const { makerCurrency, makerAmount, takerCurrency, takerAmount } = swaps['calculateMakerTakerAmounts'](
        buyDealEth.quantity!,
        buyDealEth.price,
        buyDealEth.isBuy,
        buyDealEth.pairId,
      );
      expect(makerAmount).toEqual(buyDealEth.makerAmount);
      expect(takerAmount).toEqual(buyDealEth.takerAmount);
      expect(makerCurrency).toEqual(buyDealEth.makerCurrency);
      expect(takerCurrency).toEqual(buyDealEth.takerCurrency);
    });
  });
});
