import { displayTables } from '../../../lib/cli/commands/orderbook';

jest.mock('colors/safe', () => {
  return {
    green: (str: string) => str,
    red: (str: string) => str,
    bold: (str: string) => str,
    underline: (str: string) => str,
  };
});

const ltcBtcOrderBook = {
  buyBucketsList: [
    {
      price: 0.0099,
      quantity: 11071587640,
    },
    {
      price: 0.0098,
      quantity: 9117367602,
    },
    {
      price: 0.0097,
      quantity: 10614167904,
    },
    {
      price: 0.0096,
      quantity: 10266496213,
    },
    {
      price: 0.0095,
      quantity: 10398061003,
    },
    {
      price: 0.0094,
      quantity: 11980194419,
    },
    {
      price: 0.0093,
      quantity: 8204432528,
    },
    {
      price: 0.0092,
      quantity: 10357335925,
    },
    {
      price: 0.0091,
      quantity: 9471010321,
    },
    {
      price: 0.009,
      quantity: 8570250137,
    },
  ],
  sellBucketsList: [
    {
      price: 0.0101,
      quantity: 9797360538,
    },
    {
      price: 0.0102,
      quantity: 10006815933,
    },
    {
      price: 0.0103,
      quantity: 10292596794,
    },
    {
      price: 0.0104,
      quantity: 10770572898,
    },
    {
      price: 0.0105,
      quantity: 9506165727,
    },
    {
      price: 0.0106,
      quantity: 8786526193,
    },
    {
      price: 0.0107,
      quantity: 8987718204,
    },
    {
      price: 0.0108,
      quantity: 11081500717,
    },
    {
      price: 0.0109,
      quantity: 10279896939,
    },
    {
      price: 0.011,
      quantity: 9761906414,
    },
  ],
};

const orderbook: any = {
  bucketsMap: [['LTC/BTC', ltcBtcOrderBook]],
};

describe('orderbook', () => {
  const mockLog = jest.fn();
  console.log = mockLog;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should print the orderbook', () => {
    displayTables(orderbook);
    expect(mockLog.mock.calls).toMatchSnapshot();
  });
});
