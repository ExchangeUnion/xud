import LndClient from '../../lib/lndclient/LndClient';
import { LndClientConfig } from '../../lib/lndclient/types';
import Logger from '../../lib/Logger';
import { getValidDeal } from '../utils';

const getSendPaymentSyncResponse = () => {
  return {
    getPaymentError: () => {},
    getPaymentPreimage_asB64: () =>
      'IDAKXrx4dayn0H/gCxN12jPK2/LchwPZop4zICw43jg=',
  };
};

const getSendPaymentSyncErrorResponse = () => {
  return {
    getPaymentError: () => 'error!',
  };
};

jest.mock('../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>><any>Logger;
describe('LndClient', () => {
  let lnd: LndClient;
  let config: LndClientConfig;
  let currency: string;
  let logger: Logger;

  beforeEach(() => {
    config = {
      disable: false,
      certpath: '/cert/path',
      macaroonpath: '/macaroon/path',
      host: '127.0.0.1',
      port: 4321,
      cltvdelta: 144,
      nomacaroons: true,
    };
    currency = 'BTC';
    logger = new mockedLogger();
    logger.error = jest.fn();
    logger.info = jest.fn();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await lnd.close();
  });

  test('sendPayment maker success', async () => {
    lnd = new LndClient(config, currency, logger);
    lnd['sendPaymentSync'] = jest.fn()
        .mockReturnValue(Promise.resolve(getSendPaymentSyncResponse()));
    const deal = getValidDeal();
    const buildSendRequestSpy = jest.spyOn(lnd as any, 'buildSendRequest');
    await expect(lnd.sendPayment(deal))
      .resolves.toMatchSnapshot();
    expect(buildSendRequestSpy).toHaveBeenCalledWith({
      amount: deal.takerAmount,
      destination: deal.takerPubKey,
      cltvDelta: deal.takerCltvDelta,
      rHash: deal.rHash,
    });
  });

  test('sendPayment taker success', async () => {
    lnd = new LndClient(config, currency, logger);
    lnd['sendPaymentSync'] = jest.fn()
        .mockReturnValue(Promise.resolve(getSendPaymentSyncResponse()));
    const deal = {
      ...getValidDeal(),
      role: 0, // taker
    };
    const buildSendRequestSpy = jest.spyOn(lnd as any, 'buildSendRequest');
    await expect(lnd.sendPayment(deal))
      .resolves.toMatchSnapshot();
    expect(buildSendRequestSpy).toHaveBeenCalledWith({
      amount: deal.makerAmount,
      destination: deal.destination,
      cltvDelta: deal.makerCltvDelta,
      rHash: deal.rHash,
    });
  });

  test('sendPayment error', async () => {
    lnd = new LndClient(config, currency, logger);
    lnd['sendPaymentSync'] = jest.fn()
        .mockReturnValue(Promise.resolve(getSendPaymentSyncErrorResponse()));
    await expect(lnd.sendPayment(getValidDeal()))
      .rejects.toMatchSnapshot();
  });

  test('sendSmallestAmount success', async () => {
    lnd = new LndClient(config, currency, logger);
    lnd['sendPaymentSync'] = jest.fn()
        .mockReturnValue(Promise.resolve(getSendPaymentSyncResponse()));
    const buildSendRequestSpy = jest.spyOn(lnd as any, 'buildSendRequest');
    const rHash = '04b6ac45b770ec4abbb9713aebfa57b963a1f6c7a795d9b5757687e0688add80';
    const destination = '034c5266591bff232d1647f45bcf6bbc548d3d6f70b2992d28aba0afae067880ac';
    await expect(lnd.sendSmallestAmount(rHash, destination))
      .resolves.toMatchSnapshot();
    expect(buildSendRequestSpy).toHaveBeenCalledWith({
      destination,
      rHash,
      cltvDelta: lnd.cltvDelta,
      amount: 1,
    });
  });

});
