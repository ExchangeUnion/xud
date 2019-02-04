import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon, { SinonSandbox }  from 'sinon';
import Pool from '../../lib/p2p/Pool';
import Peer from '../../lib/p2p/Peer';
import Swaps from '../../lib/swaps/Swaps';
import LndClient from '../../lib/lndclient/LndClient';
import Logger, { Level } from '../../lib/Logger';
import DB from '../../lib/db/DB';
import { waitForSpy } from '../utils';

chai.use(chaiAsPromised);

const validMakerOrder = () => {
  return {
    price: 0.008,
    quantity: 0.01,
    initialQuantity: 0.01,
    pairId: 'LTC/BTC',
    isBuy: false,
    peerPubKey: '029706a877a39d9f22e1ecd1042b058bd5798b9fd79fcf8c8ced8c1f13a4aff055',
    id: 'b76158b1-e34c-11e8-92c2-9fa16c9aa9d1',
    createdAt: 1541677927103,
  };
};

const validTakerOrder = () => {
  return {
    pairId: 'LTC/BTC',
    price: 0.008,
    quantity: 0.01,
    initialQuantity: 0.01,
    hold: 0,
    isBuy: true,
    localId: 'bd1d6500-e34c-11e8-bedb-9ffbf8c8cc23',
    id: 'bd1d6501-e34c-11e8-bedb-9ffbf8c8cc23',
    createdAt: 1541677936464,
  };
};

const validSwapSuccess = () => {
  return {
    orderId: '760d5291-e43e-11e8-bd56-e5c08173fa7d',
    localId: '76c61b40-e43e-11e8-a3b5-853f31e7d8e6',
    pairId: 'LTC/BTC',
    quantity: 0.00001,
    amountReceived: 1000,
    amountSent: 8,
    currencyReceived: 'LTC',
    currencySent: 'BTC',
    rHash: 'd94c22a73d2741ed5cdcf3714f9ab3c8664793b03a54c74a08877726007d67c2',
    peerPubKey: '020c9a0fb8dac5b91756fb21509aefc4e95b585510c4de6e6311f18348a4723cdd',
    role: 0,
  };
};

const validSwapDeal = () => {
  return {
    takerCltvDelta: 144,
    rHash: '29bcb9097a6afe26826100919917c9044062cba1d4f6ac694029f6b8af2041c7',
    orderId: '20998481-e689-11e8-95ee-e3e71c57fbb3',
    pairId: 'LTC/BTC',
    proposedQuantity: 0.00001,
    takerCurrency: 'BTC',
    makerCurrency: 'LTC',
    takerAmount: 8,
    makerAmount: 1000,
    peerPubKey: '030130758847ada485520016a075833b8638c7e5a56889cb4b76e10c0f61f3520c',
    localId: '20b63440-e689-11e8-aa83-51505ebd3ca7',
    price: 0.008,
    isBuy: true,
    phase: 3,
    state: 1,
    rPreimage: 'eab3fe55ce502b702bca13cbb9f1e4239502911d4c8823b73708c4a4433ed87a',
    role: 0,
    createTime: 1542033726862,
    makerCltvDelta: 1152,
    quantity: 0.00001,
    executeTime: 1542033726871,
    errorMessage: 'UnknownPaymentHash',
  };
};

describe('Swaps.Integration', () => {
  const loggers = Logger.createLoggers(Level.Warn);
  let db: DB;
  let pool: Pool;
  let swaps: Swaps;
  let lndBtcClient: LndClient;
  let lndLtcClient: LndClient;
  let peer: Peer;
  let sandbox: SinonSandbox;
  let queryRoutesResponse;

  before(async () => {
    db = new DB(loggers.db);
    await db.init();
  });

  after(async () => {
    await db.close();
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // peer
    peer = sandbox.createStubInstance(Peer) as any;
    peer.sendPacket = () => {};
    peer.getLndPubKey = () => '1234567890';
    // pool
    pool = sandbox.createStubInstance(Pool) as any;
    pool.getPeer = () => peer;
    // queryRoutes response
    queryRoutesResponse = () => {
      return Promise.resolve({
        getRoutesList: () => [1],
      } as any);
    };
    // lnd btc
    lndBtcClient = sandbox.createStubInstance(LndClient) as any;
    lndBtcClient.queryRoutes = queryRoutesResponse;
    lndBtcClient.isConnected = () => true;
    // lnd ltc
    lndLtcClient = sandbox.createStubInstance(LndClient) as any;
    lndLtcClient.isConnected = () => true;
    lndLtcClient.queryRoutes = queryRoutesResponse;
    swaps = new Swaps(loggers.swaps, db.models, pool, lndBtcClient, lndLtcClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('executeSwap', () => {

    it('will resolve valid maker and taker order upon swap paid', async () => {
      const swapListenersAdded = sandbox.spy(swaps, 'on');
      const addDealSpy = sandbox.spy(swaps, 'addDeal');
      const swapListenersRemoved = sandbox.spy(swaps, 'removeListener');
      const swapSuccess = validSwapSuccess();
      expect(swaps.executeSwap(validMakerOrder(), validTakerOrder()))
        .to.eventually.equal(swapSuccess);
      await waitForSpy(swapListenersAdded);
      expect(addDealSpy.calledOnce).to.equal(true);
      swapSuccess.rHash = addDealSpy.args[0][0].rHash;
      swaps.emit('swap.paid', swapSuccess);
      await waitForSpy(swapListenersRemoved, 'calledTwice');
    });

    it('will reject valid maker and taker order upon swap failed', async () => {
      const swapListenersAdded = sandbox.spy(swaps, 'on');
      const addDealSpy = sandbox.spy(swaps, 'addDeal');
      const swapListenersRemoved = sandbox.spy(swaps, 'removeListener');
      const swapDeal = validSwapDeal();
      expect(swaps.executeSwap(validMakerOrder(), validTakerOrder()))
        .to.eventually.be.rejected;
      await waitForSpy(swapListenersAdded);
      expect(addDealSpy.calledOnce).to.equal(true);
      swapDeal.rHash = addDealSpy.args[0][0].rHash;
      swaps.emit('swap.failed', swapDeal);
      await waitForSpy(swapListenersRemoved, 'calledTwice');
    });

    it('will reject orders with invalid pair', async () => {
      const INVALID_PAIR_ID = 'ABC/BTC';
      const invalidMakerOrder = {
        ...validMakerOrder(),
        pairId: INVALID_PAIR_ID,
      };
      expect(swaps.executeSwap(invalidMakerOrder, validTakerOrder()))
        .to.eventually.be.rejectedWith('pairId does not match or pair is not supported');
      const invalidTakerOrder = {
        ...validTakerOrder(),
        pairId: INVALID_PAIR_ID,
      };
      expect(swaps.executeSwap(validMakerOrder(), invalidTakerOrder))
        .to.eventually.be.rejectedWith('pairId does not match or pair is not supported');
    });

    it('will reject if unable to retrieve routes', async () => {
      const noRoutesFound = () => {
        return Promise.resolve({
          getRoutesList: () => [],
        } as any);
      };
      lndBtcClient.queryRoutes = noRoutesFound;
      lndLtcClient.queryRoutes = noRoutesFound;
      expect(swaps.executeSwap(validMakerOrder(), validTakerOrder()))
        .to.eventually.be.rejectedWith('Can not swap. unable to find route to destination');
      const EXPECTED_ERROR_MSG = 'UNKNOWN';
      const rejectsWithUnknownError = () => {
        return Promise.reject(EXPECTED_ERROR_MSG);
      };
      lndBtcClient.queryRoutes = rejectsWithUnknownError;
      lndLtcClient.queryRoutes = rejectsWithUnknownError;
      expect(swaps.executeSwap(validMakerOrder(), validTakerOrder()))
        .to.eventually.be.rejectedWith(EXPECTED_ERROR_MSG);
    });

  });

  describe.skip('acceptDeal', () => {

    it('should reject unsupported currency', async () => {
      expect(true).to.equal(false);
    });

    it('should reject already used hash', async () => {
      expect(true).to.equal(false);
    });

  });

});
