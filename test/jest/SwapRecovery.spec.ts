import { SwapClientType, SwapFailureReason, SwapPhase, SwapRole, SwapState } from '../../lib/constants/enums';
import LndClient from '../../lib/lndclient/LndClient';
import Logger from '../../lib/Logger';
import Peer from '../../lib/p2p/Peer';
import { PaymentState } from '../../lib/swaps/SwapClient';
import SwapClientManager from '../../lib/swaps/SwapClientManager';
import SwapRecovery from '../../lib/swaps/SwapRecovery';

jest.mock('../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>><any>Logger;
jest.mock('../../lib/swaps/SwapClientManager');
const mockedSwapClientManager = <jest.Mock<SwapClientManager>><any>SwapClientManager;
jest.mock('../../lib/p2p/Peer');
const mockedPeer = <jest.Mock<Peer>><any>Peer;
jest.mock('../../lib/lndclient/LndClient');
const mockedLnd = <jest.Mock<LndClient>><any>LndClient;
const getMockedLnd = (lockBuffer: number) => {
  const lnd = new mockedLnd();
  // @ts-ignore
  lnd.lockBuffer = lockBuffer;
  // @ts-ignore
  lnd.type = SwapClientType.Lnd;
  lnd.isConnected = jest.fn().mockReturnValue(true);
  lnd.removeInvoice = jest.fn();
  lnd.settleInvoice = jest.fn();
  return lnd;
};

const save = jest.fn();
const takerCurrency = 'LTC';
const makerCurrency = 'BTC';
const swapDealInstance = {
  save,
  takerCurrency,
  makerCurrency,
  state: SwapState.Active,
  role: SwapRole.Maker,
  peerPubKey: '02a9a503beb4f291c77cbea972c0fe2410f3bb0d62178896dcfae958edc8541b3c',
  orderId: '4e6926b0-c25a-11e9-ac60-17a7cbc02f5c',
  localId: '4e6926b0-c25a-11e9-ac60-17a7cbc02f5c',
  proposedQuantity: 1000,
  takerAmount: 100000,
  makerAmount: 1000,
  takerCltvDelta: 576,
  rHash: '5ff06a3cbe98713b9015843119da243ecac8097dcb5bd5a6923ac8eed340ddc9',
  createTime: 1566820828545,
};

describe('SwapRecovery', () => {
  let swapRecovery: SwapRecovery;
  let logger: Logger;
  let swapClientManager: SwapClientManager;
  let peer: Peer;
  let lndBtc: LndClient;
  let lndLtc: LndClient;

  beforeEach(() => {
    logger = new mockedLogger();
    logger.debug = jest.fn();
    logger.error = jest.fn();
    logger.info = jest.fn();
    swapClientManager = new mockedSwapClientManager();
    swapClientManager.get = jest.fn().mockImplementation((currency) => {
      if (currency === 'BTC') {
        return lndBtc;
      }
      if (currency === 'LTC') {
        return lndLtc;
      }
      return;
    });
    peer = new mockedPeer();
    peer.sendPacket = jest.fn();
    lndBtc = getMockedLnd(144);
    lndLtc = getMockedLnd(576);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it fails a deal', async () => {
    const deal: any = { ...swapDealInstance };
    swapRecovery = new SwapRecovery(swapClientManager, logger);
    swapRecovery.pendingSwaps.delete = jest.fn();

    await swapRecovery['failDeal'](deal, lndBtc);
    expect(deal.state).toEqual(SwapState.Error);
    expect(deal.failureReason).toEqual(SwapFailureReason.Crash);
    expect(swapRecovery.pendingSwaps.delete).toHaveBeenCalledTimes(1);
    expect(swapRecovery.pendingSwaps.delete).toHaveBeenCalledWith(deal);
    expect(save).toHaveBeenCalledTimes(1);
  });

  test('it fails a swap that was accepted but not started payments', async () => {
    const deal: any = { ...swapDealInstance };
    deal.phase = SwapPhase.SwapAccepted;
    swapRecovery = new SwapRecovery(swapClientManager, logger);
    swapRecovery['failDeal'] = jest.fn();

    await swapRecovery.recoverDeal(deal);
    expect(swapRecovery['failDeal']).toHaveBeenCalledTimes(1);
    expect(swapRecovery['failDeal']).toHaveBeenCalledWith(deal, lndBtc);
  });

  test('it fails a swap where we were sending payment as taker', async () => {
    const deal: any = { ...swapDealInstance };
    deal.role = SwapRole.Taker;
    deal.phase = SwapPhase.SendingPayment;
    swapRecovery = new SwapRecovery(swapClientManager, logger);
    swapRecovery['failDeal'] = jest.fn();

    await swapRecovery.recoverDeal(deal);
    expect(swapRecovery['failDeal']).toHaveBeenCalledTimes(1);
    expect(swapRecovery['failDeal']).toHaveBeenCalledWith(deal, lndLtc);
  });

  test('it completes a swap where we received payment', async () => {
    const deal: any = { ...swapDealInstance };
    deal.phase = SwapPhase.PaymentReceived;
    swapRecovery = new SwapRecovery(swapClientManager, logger);

    await swapRecovery.recoverDeal(deal);
    expect(deal.state).toEqual(SwapState.Recovered);
    expect(save).toHaveBeenCalledTimes(1);
  });

  test('it completes a successful payment when we were sending payment as maker', async () => {
    const deal: any = { ...swapDealInstance };
    deal.phase = SwapPhase.SendingPayment;
    swapRecovery = new SwapRecovery(swapClientManager, logger);
    const preimage = 'preimage';
    lndLtc.lookupPayment = jest.fn().mockReturnValue({ preimage, state: PaymentState.Succeeded });

    await swapRecovery.recoverDeal(deal);
    expect(lndLtc.lookupPayment).toHaveBeenCalledTimes(1);
    expect(lndLtc.lookupPayment).toHaveBeenCalledWith(deal.rHash);
    expect(lndBtc.settleInvoice).toHaveBeenCalledTimes(1);
    expect(lndBtc.settleInvoice).toHaveBeenCalledWith(deal.rHash, preimage);
    expect(deal.state).toEqual(SwapState.Recovered);
    expect(save).toHaveBeenCalledTimes(1);
  });

  test('it fails a failed payment when we were sending payment as maker', async () => {
    const deal: any = { ...swapDealInstance };
    deal.phase = SwapPhase.SendingPayment;
    swapRecovery = new SwapRecovery(swapClientManager, logger);
    lndLtc.lookupPayment = jest.fn().mockReturnValue({ state: PaymentState.Failed });

    swapRecovery['failDeal'] = jest.fn();

    await swapRecovery.recoverDeal(deal);
    expect(lndLtc.lookupPayment).toHaveBeenCalledTimes(1);
    expect(lndLtc.lookupPayment).toHaveBeenCalledWith(deal.rHash);
    expect(swapRecovery['failDeal']).toHaveBeenCalledTimes(1);
    expect(swapRecovery['failDeal']).toHaveBeenCalledWith(deal, lndBtc);
  });

  test('it tracks a pending payment when we were sending payment as maker', async () => {
    const deal: any = { ...swapDealInstance };
    deal.phase = SwapPhase.SendingPayment;
    swapRecovery = new SwapRecovery(swapClientManager, logger);
    lndLtc.lookupPayment = jest.fn().mockReturnValue({ state: PaymentState.Pending });

    await swapRecovery.recoverDeal(deal);
    expect(lndLtc.lookupPayment).toHaveBeenCalledTimes(1);
    expect(lndLtc.lookupPayment).toHaveBeenCalledWith(deal.rHash);
    expect(swapRecovery.pendingSwaps).toContain(deal);
  });

});
