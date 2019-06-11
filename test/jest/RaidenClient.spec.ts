import RaidenClient from '../../lib/raidenclient/RaidenClient';
import { RaidenClientConfig, TokenPaymentResponse } from '../../lib/raidenclient/types';
import Logger from '../../lib/Logger';
import { SwapDeal } from '../../lib/swaps/types';
import { getValidDeal } from '../utils';

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
