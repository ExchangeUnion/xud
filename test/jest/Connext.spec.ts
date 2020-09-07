import ConnextClient from '../../lib/connextclient/ConnextClient';
import { UnitConverter } from '../../lib/utils/UnitConverter';
import Logger from '../../lib/Logger';
import { SwapClientType } from '../../lib/constants/enums';
import { CurrencyInstance } from '../../lib/db/types';
import { PaymentState } from '../../lib/swaps/SwapClient';
import errors from '../../lib/connextclient/errors';

jest.mock('../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>>(<any>Logger);

jest.mock('http', () => {
  return {
    request: jest.fn().mockImplementation((options, cb) => {
      if (options.path === '/deposit') {
        cb({
          statusCode: 404,
        });
      }
      return {
        write: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
      };
    }),
  };
});

const ETH_ASSET_ID = '0x0000000000000000000000000000000000000000';

describe('ConnextClient', () => {
  let connext: ConnextClient;

  beforeEach(() => {
    const config = {
      disable: false,
      host: 'http://tester',
      port: 1337,
      webhookhost: 'http://testerson',
      webhookport: 7331,
    };
    const logger = new mockedLogger();
    logger.trace = jest.fn();
    logger.error = jest.fn();
    logger.debug = jest.fn();
    const currencyInstances = [
      {
        id: 'ETH',
        tokenAddress: ETH_ASSET_ID,
        swapClient: SwapClientType.Connext,
      },
    ] as CurrencyInstance[];
    connext = new ConnextClient({
      config,
      currencyInstances,
      logger,
      unitConverter: new UnitConverter(),
    });
  });

  describe('sendRequest', () => {
    it('deposit fails with 404', async () => {
      expect.assertions(1);
      try {
        await connext['sendRequest']('/deposit', 'POST', {
          assetId: ETH_ASSET_ID,
          amount: BigInt('100000').toString(),
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });
  });

  describe('lookupPayment', () => {
    it('returns PaymentState.Pending', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest
        .fn()
        .mockReturnValue({ status: 'PENDING' });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Pending });
    });

    it('returns PaymentState.Completed with preimage', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest
        .fn()
        .mockReturnValue({ status: 'COMPLETED', preImage: '0x1337' });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Succeeded, preimage: '1337' });
    });

    it('returns PaymentState.Failed when EXPIRED', async () => {
      expect.assertions(3);
      connext['getHashLockStatus'] = jest
        .fn()
        .mockReturnValue({ status: 'EXPIRED' });
      connext['sendRequest'] = jest.fn().mockReturnValue(Promise.resolve());
      const hash = '8f28fb27a164ae992fb4808b11c137d06e8e7d9304043a6b7163323f7cf53920';
      const currency = 'ETH';
      const result = await connext['lookupPayment'](hash, currency);
      expect(result).toEqual({ state: PaymentState.Failed });
      expect(connext['sendRequest']).toHaveBeenCalledTimes(1);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/hashlock-resolve',
        'POST',
        expect.objectContaining({
          assetId: ETH_ASSET_ID,
          preImage: '0x',
          paymentId: '0xb2c0648834d105f3b372c6a05d11b0f19d88a8909f6315c8535e383e59991f8e',
        }),
      );
    });

    it('returns PaymentState.Failed when FAILED', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest
        .fn()
        .mockReturnValue({ status: 'FAILED' });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Failed });
    });

    it('returns PaymentState.Pending when error is unknown', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('unknown error');
        });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Pending });
    });

    it('returns PaymentState.Failed when error is PAYMENT_NOT_FOUND', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest
        .fn()
        .mockImplementation(() => {
          throw errors.PAYMENT_NOT_FOUND;
        });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Failed });
    });
  });
});
