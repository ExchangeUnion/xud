import RaidenClient from '../../lib/raidenclient/RaidenClient';
import { RaidenClientConfig, TokenPaymentResponse } from '../../lib/raidenclient/types';
import Logger from '../../lib/Logger';
import { SwapDeal } from '../../lib/swaps/types';

const getValidTokenPaymentResponse = () => {
  return {
    amount: 100000000000000,
    initiator_address: '0x7ed0299Fa1ADA71D10536B866231D447cDFa48b9',
    secret_hash: '0xb8a0243672b503714822b454405de879e2b8300c7579d60295c35607ffd5613e',
    secret: '0x9f345e3751d8b7f38d34b7a3dd636a9d7a0c2f36d991615e6653501f30c6ec56',
    identifier: 3820989367401102,
    hashalgo: 'SHA256',
    target_address: '0x2B88992DEd5C96aa7Eaa9CFE1AE52350df7dc5DF',
    token_address: '0x4c354C76d5f73A63a90Be776897DC81Fb6238772',
  };
};

const getValidDeal = () => {
  return {
    proposedQuantity: 10000,
    pairId: 'LTC/BTC',
    orderId: '53bc8a30-81f0-11e9-9259-a5617f44d209',
    rHash: '04b6ac45b770ec4abbb9713aebfa57b963a1f6c7a795d9b5757687e0688add80',
    takerCltvDelta: 144,
    takerPubKey: '034c5266591bff232d1647f45bcf6bbc548d3d6f70b2992d28aba0afae067880ac',
    price: 0.1,
    isBuy: true,
    quantity: 10000,
    makerAmount: 10000,
    takerAmount: 1000,
    makerUnits: 10000,
    takerUnits: 1000,
    makerCurrency: 'LTC',
    takerCurrency: 'BTC',
    destination: '034c5266591bff232d1647f45bcf6bbc548d3d6f70b2992d28aba0afae067880ac',
    peerPubKey: '021ea6d67c850a0811b01c78c8117dca044b224601791a4186bf5748f667f73517',
    localId: '53bc8a30-81f0-11e9-9259-a5617f44d209',
    phase: 3,
    state: 0,
    role: 1,
    createTime: 1559120485138,
    makerToTakerRoutes: [{ getTotalTimeLock: () => {} }],
  };
};

jest.mock('../../lib/Logger');
describe('RaidenClient', () => {
  let raiden: RaidenClient;
  let config: RaidenClientConfig;
  let raidenLogger: Logger;

  beforeEach(() => {
    config = {
      disable: false,
      host: '127.0.0.1',
      port: 1234,
    };
    raidenLogger = new Logger({});
    raidenLogger.info = jest.fn();
    raidenLogger.error = jest.fn();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await raiden.close();
  });

  test('sendPayment removes 0x from secret', async () => {
    raiden = new RaidenClient(config, raidenLogger);
    await raiden.init();
    const validTokenPaymentResponse: TokenPaymentResponse = getValidTokenPaymentResponse();
    raiden['tokenPayment'] = jest.fn()
        .mockReturnValue(Promise.resolve(validTokenPaymentResponse));
    raiden.tokenAddresses.get = jest.fn().mockReturnValue(validTokenPaymentResponse.token_address);
    const deal: SwapDeal = getValidDeal();
    await expect(raiden.sendPayment(deal))
      .resolves.toMatchSnapshot();
  });

  test('sendPayment rejects in case of empty secret response', async () => {
    raiden = new RaidenClient(config, raidenLogger);
    await raiden.init();
    const invalidTokenPaymentResponse: TokenPaymentResponse = {
      ...getValidTokenPaymentResponse(),
      secret: '',
    };
    raiden['tokenPayment'] = jest.fn()
        .mockReturnValue(Promise.resolve(invalidTokenPaymentResponse));
    raiden.tokenAddresses.get = jest.fn().mockReturnValue(invalidTokenPaymentResponse.token_address);
    const deal: SwapDeal = getValidDeal();
    await expect(raiden.sendPayment(deal))
      .rejects.toMatchSnapshot();
  });

});
