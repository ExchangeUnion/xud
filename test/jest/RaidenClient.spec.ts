import RaidenClient from '../../lib/raidenclient/RaidenClient';
import { RaidenClientConfig, TokenPaymentResponse } from '../../lib/raidenclient/types';
import Logger from '../../lib/Logger';
import { SwapDeal } from '../../lib/swaps/types';
import { UnitConverter } from '../../lib/utils/UnitConverter';
import { CurrencyInstance } from '../../lib/db/types';

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

const channelBalance1 = 250000000000000000;
const channelBalance2 = 50000000000000000;
const channelBalanceTokenAddress = '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8';
const getChannelsResponse = [
  {
    token_network_identifier: '0xE5637F0103794C7e05469A9964E4563089a5E6f2',
    channel_identifier: 1,
    partner_address: '0x61C808D82A3Ac53231750daDc13c777b59310bD9',
    token_address: channelBalanceTokenAddress,
    balance: channelBalance1,
    total_deposit: 350000000000000000,
    state: 'opened',
    settle_timeout: 100,
    reveal_timeout: 30,
  },
  {
    token_network_identifier: '0xE5637F0103794C7e05469A9964E4563089a5E6f2',
    channel_identifier: 2,
    partner_address: '0x2A4722462bb06511b036F00C7EbF938B2377F446',
    token_address: channelBalanceTokenAddress,
    balance: channelBalance2,
    total_deposit: 350000000000000000,
    state: 'opened',
    settle_timeout: 100,
    reveal_timeout: 30,
  },
  {
    token_network_identifier: '0xE5637F0103794C7e05469A9964E4563089a5E6f2',
    channel_identifier: 3,
    partner_address: '0x3b1c3C1568C848b3C12c88e2aF5E5CAa0b62071A',
    token_address: channelBalanceTokenAddress,
    balance: 1000000,
    total_deposit: 35000000,
    state: 'closed',
    settle_timeout: 100,
    reveal_timeout: 30,
  },
];

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

const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const currencyInstances = [
  { id: 'WETH', tokenAddress: wethTokenAddress },
];

jest.mock('../../lib/Logger');
describe('RaidenClient', () => {
  let raiden: RaidenClient;
  let config: RaidenClientConfig;
  let raidenLogger: Logger;
  let unitConverter: UnitConverter;

  beforeEach(() => {
    config = {
      disable: false,
      host: '127.0.0.1',
      port: 1234,
    };
    raidenLogger = new Logger({});
    raidenLogger.info = jest.fn();
    raidenLogger.error = jest.fn();
    unitConverter = new UnitConverter();
    unitConverter.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await raiden.close();
  });

  describe('sendPayment', () => {
    test('it removes 0x from secret', async () => {
      raiden = new RaidenClient({ unitConverter, config, directChannelChecks: true, logger: raidenLogger });
      await raiden.init(currencyInstances as CurrencyInstance[]);
      const validTokenPaymentResponse: TokenPaymentResponse = getValidTokenPaymentResponse();
      raiden['tokenPayment'] = jest.fn()
          .mockReturnValue(Promise.resolve(validTokenPaymentResponse));
      raiden.tokenAddresses.get = jest.fn().mockReturnValue(validTokenPaymentResponse.token_address);
      const deal: SwapDeal = getValidDeal();
      await expect(raiden.sendPayment(deal))
        .resolves.toMatchSnapshot();
    });

    test('it rejects in case of empty secret response', async () => {
      raiden = new RaidenClient({ unitConverter, config, directChannelChecks: true, logger: raidenLogger });
      await raiden.init(currencyInstances as CurrencyInstance[]);
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

  describe('openChannel', () => {
    let peerRaidenAddress: string;
    let units: number;
    let currency: string;

    beforeEach(() => {
      peerRaidenAddress = '0x10D8CCAD85C7dc123090B43aA1f98C00a303BFC5';
      units = 5000000;
      currency = 'WETH';
    });

    test('it fails when tokenAddress for currency not found', async () => {
      expect.assertions(1);
      raiden = new RaidenClient({ unitConverter, config, directChannelChecks: true, logger: raidenLogger });
      await raiden.init([] as CurrencyInstance[]);
      try {
        await raiden.openChannel({
          units,
          currency,
          peerIdentifier: peerRaidenAddress,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it throws when openChannel fails', async () => {
      expect.assertions(1);
      raiden = new RaidenClient({ unitConverter, config, directChannelChecks: true, logger: raidenLogger });
      const peerRaidenAddress = '0x10D8CCAD85C7dc123090B43aA1f98C00a303BFC5';
      const currency = 'WETH';
      const mockTokenAddresses = new Map<string, string>();
      mockTokenAddresses.set('WETH', wethTokenAddress);
      raiden.tokenAddresses = mockTokenAddresses;
      raiden['openChannelRequest'] = jest.fn().mockImplementation(() => {
        throw new Error('openChannelRequest error');
      });
      await raiden.init(currencyInstances as CurrencyInstance[]);
      try {
        await raiden.openChannel({
          units,
          currency,
          peerIdentifier: peerRaidenAddress,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    test('it opens a channel', async () => {
      expect.assertions(2);
      raiden = new RaidenClient({ unitConverter, config, directChannelChecks: true, logger: raidenLogger });
      const peerRaidenAddress = '0x10D8CCAD85C7dc123090B43aA1f98C00a303BFC5';
      const currency = 'WETH';
      const mockTokenAddresses = new Map<string, string>();
      mockTokenAddresses.set('WETH', wethTokenAddress);
      raiden.tokenAddresses = mockTokenAddresses;
      raiden['openChannelRequest'] = jest.fn().mockReturnValue(Promise.resolve());
      await raiden.init(currencyInstances as CurrencyInstance[]);
      await raiden.openChannel({
        units,
        currency,
        peerIdentifier: peerRaidenAddress,
      });
      expect(raiden['openChannelRequest']).toHaveBeenCalledTimes(1);
      expect(raiden['openChannelRequest']).toHaveBeenCalledWith({
        partner_address: peerRaidenAddress,
        token_address: wethTokenAddress,
        total_deposit: units,
        settle_timeout: 500,
      });
    });
  });

  test('channelBalance calculates the total balance of open channels for a currency', async () => {
    raiden = new RaidenClient({ unitConverter, config, directChannelChecks: true, logger: raidenLogger });
    await raiden.init(currencyInstances as CurrencyInstance[]);
    raiden.tokenAddresses.get = jest.fn().mockReturnValue(channelBalanceTokenAddress);
    raiden['getChannels'] = jest.fn()
        .mockReturnValue(Promise.resolve(getChannelsResponse));
    await expect(raiden.channelBalance('WETH')).resolves.toHaveProperty('balance', 30000000);
  });
});
