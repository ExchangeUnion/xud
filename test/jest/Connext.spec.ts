import ConnextClient from '../../lib/connextclient/ConnextClient';
import errors from '../../lib/connextclient/errors';
import { SwapClientType } from '../../lib/constants/enums';
import { CurrencyInstance } from '../../lib/db/types';
import Logger from '../../lib/Logger';
import { PaymentState } from '../../lib/swaps/SwapClient';
import { getUnitConverter } from '../utils';
import { EthProvider } from '../../lib/connextclient/ethprovider';
import { of } from 'rxjs';

const MOCK_TX_HASH = '0x5544332211';
jest.mock('../../lib/utils/utils', () => {
  return {
    parseResponseBody: () => {
      return { txhash: MOCK_TX_HASH };
    },
  };
});
jest.mock('../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>>(<any>Logger);

jest.mock('http', () => {
  return {
    request: jest.fn().mockImplementation((options, cb) => {
      if (options.path === '/deposit') {
        cb({ statusCode: 404 });
      }

      let errorCb: any;
      return {
        path: options.path,
        write: jest.fn(),
        end: jest.fn(),
        on: jest.fn().mockImplementation((event, cb) => {
          if (event === 'error') {
            errorCb = cb;
          }
        }),
        destroy: jest.fn().mockImplementation(() => {
          errorCb();
        }),
      };
    }),
  };
});

const ETH_ASSET_ID = '0x0000000000000000000000000000000000000000';
const USDT_ASSET_ID = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const XUC_ASSET_ID = '0x9999999999999999999999999999999999999999';

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
    logger.warn = jest.fn();
    logger.info = jest.fn();
    const currencyInstances = [
      {
        id: 'ETH',
        tokenAddress: ETH_ASSET_ID,
        swapClient: SwapClientType.Connext,
      },
      {
        id: 'USDT',
        tokenAddress: USDT_ASSET_ID,
        swapClient: SwapClientType.Connext,
      },
      {
        id: 'XUC',
        tokenAddress: XUC_ASSET_ID,
        swapClient: SwapClientType.Connext,
      },
    ] as CurrencyInstance[];
    connext = new ConnextClient({
      config,
      currencyInstances,
      logger,
      unitConverter: getUnitConverter(),
      network: 'mainnet',
    });
  });

  describe('withdraw', () => {
    const MOCK_ETH_FREE_BALANCE_ON_CHAIN = 10n ** 18n; // 1 ETH
    const MOCK_USDT_FREE_BALANCE_ON_CHAIN = 10000n * 10n ** 6n; // 10000 USDT
    const DESTINATION_ADDRESS = '0x12345';
    const onChainTransfer = jest.fn(() => of(Promise.resolve({ hash: MOCK_TX_HASH })));

    beforeEach(() => {
      connext['getBalance'] = jest.fn().mockImplementation((currency: string) => {
        switch (currency) {
          case 'ETH':
            return { freeBalanceOnChain: MOCK_ETH_FREE_BALANCE_ON_CHAIN };
          case 'USDT':
            return { freeBalanceOnChain: MOCK_USDT_FREE_BALANCE_ON_CHAIN };
          default:
            return { freeBalanceOnChain: 0 };
        }
      });
      connext['ethProvider'] = ({
        onChainTransfer,
      } as unknown) as EthProvider;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('fails with custom fee', async () => {
      expect.assertions(1);
      try {
        await connext.withdraw({
          currency: 'ETH',
          destination: DESTINATION_ADDRESS,
          amount: 123,
          fee: 1,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    it('fails to withdraw all ETH', async () => {
      expect.assertions(1);
      try {
        await connext.withdraw({
          currency: 'ETH',
          destination: DESTINATION_ADDRESS,
          all: true,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    it('fails when amount bigger than wallet balance', async () => {
      expect.assertions(1);
      try {
        await connext.withdraw({
          currency: 'ETH',
          destination: DESTINATION_ADDRESS,
          amount: 2 * 10 ** 8,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    it('withdraws all USDT', async () => {
      expect.assertions(3);
      const txhash = await connext.withdraw({
        currency: 'USDT',
        destination: DESTINATION_ADDRESS,
        all: true,
      });
      expect(onChainTransfer).toHaveBeenCalledTimes(1);
      expect(onChainTransfer).toHaveBeenCalledWith(USDT_ASSET_ID, DESTINATION_ADDRESS, MOCK_USDT_FREE_BALANCE_ON_CHAIN);
      expect(txhash).toEqual(MOCK_TX_HASH);
    });

    it('withdraws 5000 USDT amount', async () => {
      expect.assertions(3);
      const txhash = await connext.withdraw({
        currency: 'USDT',
        destination: DESTINATION_ADDRESS,
        amount: 5000 * 10 ** 8,
      });
      expect(onChainTransfer).toHaveBeenCalledTimes(1);
      expect(onChainTransfer).toHaveBeenCalledWith(USDT_ASSET_ID, DESTINATION_ADDRESS, '5000000000');
      expect(txhash).toEqual(MOCK_TX_HASH);
    });

    it('withdraws 0.000001 ETH amount', async () => {
      expect.assertions(3);
      const txhash = await connext.withdraw({
        currency: 'ETH',
        destination: DESTINATION_ADDRESS,
        amount: 1 * 10 ** 2,
      });
      expect(onChainTransfer).toHaveBeenCalledTimes(1);
      expect(onChainTransfer).toHaveBeenCalledWith(ETH_ASSET_ID, DESTINATION_ADDRESS, '1000000000000');
      expect(txhash).toEqual(MOCK_TX_HASH);
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
      connext['getHashLockStatus'] = jest.fn().mockReturnValue({
        transferState: { expiry: '10001' },
        transferResolver: {},
      });
      connext['getHeight'] = jest.fn().mockReturnValue(10000);
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Pending });
    });

    it('returns PaymentState.Completed with preimage', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest.fn().mockReturnValue({
        transferState: { expiry: '10001' },
        transferResolver: { preImage: '0x1337' },
      });
      connext['getHeight'] = jest.fn().mockReturnValue(10000);
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({
        state: PaymentState.Succeeded,
        preimage: '1337',
      });
    });

    it('returns PaymentState.Failed when preimage is hash zero', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest.fn().mockReturnValue({
        transferState: { expiry: '10001' },
        transferResolver: { preImage: '0x0000000000000000000000000000000000000000000000000000000000000000' },
      });
      connext['getHeight'] = jest.fn().mockReturnValue(10000);
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Failed });
    });

    it('returns PaymentState.Failed when EXPIRED', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest.fn().mockReturnValue({
        transferState: { expiry: '10001' },
        transferResolver: {},
      });
      connext['getHeight'] = jest.fn().mockReturnValue(10001);
      connext['sendRequest'] = jest.fn().mockReturnValue(Promise.resolve());
      const hash = '8f28fb27a164ae992fb4808b11c137d06e8e7d9304043a6b7163323f7cf53920';
      const currency = 'ETH';
      const result = await connext['lookupPayment'](hash, currency);
      expect(result).toEqual({ state: PaymentState.Failed });
    });

    it('returns PaymentState.Pending when error is unknown', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest.fn().mockImplementation(() => {
        throw new Error('unknown error');
      });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Pending });
    });

    it('returns PaymentState.Failed when error is NOT_FOUND', async () => {
      expect.assertions(1);
      connext['getHashLockStatus'] = jest.fn().mockImplementation(() => {
        throw errors.NOT_FOUND;
      });
      const result = await connext['lookupPayment']('0x12345', 'ETH');
      expect(result).toEqual({ state: PaymentState.Failed });
    });
  });

  describe('setReservedInboundAmount', () => {
    const amount = 50000000;
    const currency = 'ETH';

    beforeEach(() => {
      connext['sendRequest'] = jest.fn().mockResolvedValue(undefined);
    });

    it('requests collateral plus 3% buffer when we have none', async () => {
      connext['inboundAmounts'].set('ETH', 0);
      connext.setReservedInboundAmount(amount, currency);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/request-collateral',
        'POST',
        expect.objectContaining({
          assetId: ETH_ASSET_ID,
          amount: (amount * 1.03 * 10 ** 10).toLocaleString('fullwide', {
            useGrouping: false,
          }),
        }),
      );
    });

    it('requests collateral plus 3% buffer when we have some collateral already', async () => {
      connext['inboundAmounts'].set('ETH', amount * 0.5);
      connext.setReservedInboundAmount(amount, currency);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/request-collateral',
        'POST',
        expect.objectContaining({
          assetId: ETH_ASSET_ID,
          amount: (amount * 1.03 * 10 ** 10).toLocaleString('fullwide', {
            useGrouping: false,
          }),
        }),
      );
    });

    it('does not request collateral when we have more than enough to cover the reserved inbound amount', async () => {
      connext['inboundAmounts'].set('ETH', amount * 2);
      connext.setReservedInboundAmount(amount, currency);
      expect(connext['sendRequest']).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkInboundCapacity', () => {
    const quantity = 20000000;
    const smallQuantity = 100;
    beforeEach(() => {
      connext['sendRequest'] = jest.fn().mockResolvedValue(undefined);
      connext['inboundAmounts'].set('ETH', 0);
    });

    it('requests collateral plus 5% buffer when there is none', async () => {
      expect(() => connext.checkInboundCapacity(quantity, 'ETH')).toThrowError(
        'channel collateralization in progress, please try again in ~1 minute',
      );

      expect(connext['sendRequest']).toHaveBeenCalledTimes(1);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/request-collateral',
        'POST',
        expect.objectContaining({
          assetId: ETH_ASSET_ID,
          amount: (quantity * 1.05 * 10 ** 10).toLocaleString('fullwide', {
            useGrouping: false,
          }),
        }),
      );
    });

    it('does not request collateral when there is a pending request', async () => {
      connext['requestCollateralPromises'].set('ETH', Promise.resolve());
      expect(() => connext.checkInboundCapacity(quantity, 'ETH')).toThrowError(
        'channel collateralization in progress, please try again in ~1 minute',
      );

      expect(connext['sendRequest']).toHaveBeenCalledTimes(0);
    });

    it('requests the full collateral amount even when there is some existing collateral', async () => {
      const partialCollateral = 5000;
      connext['inboundAmounts'].set('ETH', partialCollateral);

      expect(() => connext.checkInboundCapacity(quantity, 'ETH')).toThrowError(
        'channel collateralization in progress, please try again in ~1 minute',
      );

      expect(connext['sendRequest']).toHaveBeenCalledTimes(1);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/request-collateral',
        'POST',
        expect.objectContaining({
          assetId: ETH_ASSET_ID,
          amount: (quantity * 1.05 * 10 ** 10).toLocaleString('fullwide', {
            useGrouping: false,
          }),
        }),
      );
    });

    it('requests the hardcoded minimum if the collateral shortage is below it', async () => {
      const minCollateralRequestUnits = ConnextClient['MIN_COLLATERAL_REQUEST_SIZES']['ETH']! * 10 ** 10;

      expect(() => connext.checkInboundCapacity(smallQuantity, 'ETH')).toThrowError(
        'channel collateralization in progress, please try again in ~1 minute',
      );

      expect(connext['sendRequest']).toHaveBeenCalledTimes(1);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/request-collateral',
        'POST',
        expect.objectContaining({
          assetId: ETH_ASSET_ID,
          amount: minCollateralRequestUnits.toLocaleString('fullwide', {
            useGrouping: false,
          }),
        }),
      );
    });

    it('requests collateral plus 5% buffer for a small shortage when there is no hardcoded minimum for the currency', async () => {
      expect(() => connext.checkInboundCapacity(smallQuantity, 'XUC')).toThrowError(
        'channel collateralization in progress, please try again in ~1 minute',
      );

      expect(connext['sendRequest']).toHaveBeenCalledTimes(1);
      expect(connext['sendRequest']).toHaveBeenCalledWith(
        '/request-collateral',
        'POST',
        expect.objectContaining({
          assetId: XUC_ASSET_ID,
          amount: (smallQuantity * 1.05 * 10 ** 10).toLocaleString('fullwide', {
            useGrouping: false,
          }),
        }),
      );
    });

    it('does not request collateral or throw when there is sufficient collateral', async () => {
      connext['inboundAmounts'].set('ETH', quantity);
      connext.checkInboundCapacity(quantity, 'ETH');

      expect(connext['sendRequest']).toHaveBeenCalledTimes(0);
    });
  });

  describe('disconnect', () => {
    it('aborts pending requests, except critical ones', async () => {
      expect(connext['pendingRequests'].size).toEqual(0);

      connext['sendRequest'](connext['criticalRequestPaths'][0], '', {});
      connext['sendRequest']('/path1', '', {});
      connext['sendRequest']('/path1', '', {});
      connext['sendRequest']('/path2', '', {});
      connext['sendRequest'](connext['criticalRequestPaths'][1], '', {});
      expect(connext['pendingRequests'].size).toEqual(5);

      connext['disconnect']();
      expect(connext['pendingRequests'].size).toEqual(2);
    });
  });
});
