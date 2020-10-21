import { displayLimits } from '../../../lib/cli/commands/tradinglimits';

jest.mock('colors/safe', () => {
  return {
    blue: (str: string) => str,
    underline: (str: string) => str,
    bold: (str: string) => str,
  };
});

describe('displayLimits', () => {
  const mockLog = jest.fn();
  console.log = mockLog;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should print a table', () => {
    displayLimits({
      limitsMap: [['BTC', {
        maxBuy: 12345,
        maxSell: 67890,
        reservedInbound: 25000,
        reservedOutbound: 75000,
      }]],
    });

    expect(mockLog.mock.calls).toMatchSnapshot();
  });
});
