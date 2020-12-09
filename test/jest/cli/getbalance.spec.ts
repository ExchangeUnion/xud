import { displayBalances } from '../../../lib/cli/commands/getbalance';

jest.mock('colors/safe', () => {
  return {
    blue: (str: string) => str,
    underline: (str: string) => str,
    bold: (str: string) => str,
  };
});

describe('displayBalances', () => {
  const mockLog = jest.fn();
  console.log = mockLog;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should print a table', () => {
    displayBalances({
      balancesMap: [
        [
          'BTC',
          {
            totalBalance: 500000,
            channelBalance: 400000,
            pendingChannelBalance: 0,
            inactiveChannelBalance: 0,
            walletBalance: 100000,
            unconfirmedWalletBalance: 0,
          },
        ],
      ],
    });

    expect(mockLog.mock.calls).toMatchSnapshot();
  });

  it('should print a table with pending balances', () => {
    displayBalances({
      balancesMap: [
        [
          'BTC',
          {
            totalBalance: 500000,
            channelBalance: 400000,
            pendingChannelBalance: 75000,
            inactiveChannelBalance: 0,
            walletBalance: 100000,
            unconfirmedWalletBalance: 25000,
          },
        ],
      ],
    });
    expect(mockLog.mock.calls).toMatchSnapshot();
  });

  it('should print a table with pending and inactive balances', () => {
    displayBalances({
      balancesMap: [
        [
          'BTC',
          {
            totalBalance: 500000,
            channelBalance: 400000,
            pendingChannelBalance: 75000,
            inactiveChannelBalance: 100000,
            walletBalance: 100000,
            unconfirmedWalletBalance: 25000,
          },
        ],
      ],
    });

    expect(mockLog.mock.calls).toMatchSnapshot();
  });
});
