import { Arguments } from 'yargs';
import { callback, loadXudClient  } from '../command';
import { ListOrdersRequest, ListOrdersResponse, Order } from '../../proto/xudrpc_pb';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { satsToCoinsStr } from '../utils';

type FormattedOrderbook = {
  pairId: string,
  rows: string[][],
};

type Bucket = {
  price: number,
  quantity: number;
};

type OrderbookJson = {
  pairId: string,
  sell: Bucket[],
  buy: Bucket[],
};

const COLUMNS = [19, 19, 19, 19];
const COLUMNS_IN_ORDER_SIDE = COLUMNS.length / 2;
const HEADER = [
  { content: colors.green('Buy'), colSpan: 2 },
  { content: colors.red('Sell'), colSpan: 2 },
];
const SECONDARY_HEADER = [
  colors.green('Quantity'),
  colors.green('Price'),
  colors.red('Price'),
  colors.red('Quantity'),
];

const addSide = (buckets: Bucket[], isBuy = false): string[] => {
  const bucket = buckets.pop();
  if (bucket) {
    if (isBuy) {
      return [
        satsToCoinsStr(bucket.quantity),
        bucket.price.toString(),
      ];
    } else {
      return [
        bucket.price.toString(),
        satsToCoinsStr(bucket.quantity),
      ];
    }
  } else {
    return Array.from(Array(COLUMNS_IN_ORDER_SIDE)).map(() => '');
  }
};

export const createOrderbook = (orders: ListOrdersResponse.AsObject, precision: number) => {
  const formattedOrderbooks: FormattedOrderbook[] = [];
  orders.ordersMap.forEach((tradingPair) => {
    const buy = createOrderbookSide(tradingPair[1].buyOrdersList, precision);
    const sell = createOrderbookSide(tradingPair[1].sellOrdersList, precision);
    const totalRows = buy.length < sell.length
      ? sell.length : buy.length;
    const orderbookRows = Array.from(Array(totalRows))
      .map(() => {
        return addSide(buy, true).concat(addSide(sell));
      });
    formattedOrderbooks.push({
      pairId: tradingPair[0],
      rows: orderbookRows,
    });
  });
  return formattedOrderbooks;
};

const createTable = () => {
  const table = new Table({
    colWidths: COLUMNS,
  }) as HorizontalTable;
  table.push(HEADER);
  table.push(SECONDARY_HEADER);
  return table;
};

const displayOrderbook = (orderbook: FormattedOrderbook) => {
  const table = createTable();
  orderbook.rows.forEach(row => table.push(row));
  console.log(colors.underline(colors.bold(`\nTrading pair: ${orderbook.pairId}`)));
  console.log(table.toString());
};

const displayTables = (orders: ListOrdersResponse.AsObject, argv: Arguments) => {
  createOrderbook(orders, argv.precision).forEach(displayOrderbook);
};

const getPriceBuckets = (orders: Order.AsObject[], count = 8): number[] => {
  const uniquePrices = [
    ...new Set(
      orders.map(order => order.price),
    ),
  ];
  return uniquePrices.splice(0, count);
};

const getQuantityForBuckets = (
  orders: Order.AsObject[],
  priceBuckets: number[],
  filledBuckets: Bucket[] = [],
): Bucket[] => {
  // go through all the available price buckets
  const price = priceBuckets.shift();
  if (!price) {
    // stop recursion when we're out of buckets to fill
    return filledBuckets;
  }
  let filteredOrders = orders;
  // filter to specific bucket when the next one exists
  if (priceBuckets.length !== 0) {
    filteredOrders = orders
      .filter(order => order.price === price);
  }
  // calculate quantity of the bucket
  const quantity = filteredOrders
    .reduce((total, order) => {
      return total + order.quantity;
    }, 0);
  filledBuckets.push({ price, quantity });
  // filter orders for the next cycle
  const restOfOrders = orders.filter(order => order.price !== price);
  return getQuantityForBuckets(restOfOrders, priceBuckets, filledBuckets);
};

export const createOrderbookSide = (orders: Order.AsObject[], precision = 5) => {
  // round prices down to the desired precision
  orders.forEach((order) => {
    order.price = parseFloat(order.price.toFixed(precision));
  });
  // get price buckets in which to divide orders to
  const priceBuckets = getPriceBuckets(orders);
  // divide prices into buckets
  return getQuantityForBuckets(orders, priceBuckets);
};

export const command = 'orderbook [pair_id] [precision]';

export const describe = 'display the order book, with orders aggregated per price point';

export const builder = {
  pair_id: {
    describe: 'trading pair for which to retrieve the order book',
    type: 'string',
  },
  precision: {
    describe: 'the number of digits following the decimal point',
    type: 'number',
    default: 5,
  },
};

const displayJson = (orders: ListOrdersResponse.AsObject, argv: Arguments) => {
  const jsonOrderbooks: OrderbookJson[] = [];
  const quantityInSatoshisPerCoin = (bucket: Bucket) => {
    bucket.quantity = parseFloat(
      satsToCoinsStr(bucket.quantity),
    );
  };
  orders.ordersMap.forEach((tradingPair) => {
    const buy = createOrderbookSide(tradingPair[1].buyOrdersList, argv.precision);
    buy.forEach(quantityInSatoshisPerCoin);
    const sell = createOrderbookSide(tradingPair[1].sellOrdersList, argv.precision);
    sell.forEach(quantityInSatoshisPerCoin);
    jsonOrderbooks.push({
      sell,
      buy,
      pairId: tradingPair[0],
    });
  });
  console.log(JSON.stringify(jsonOrderbooks, undefined, 2));
};

export const handler = (argv: Arguments) => {
  const request = new ListOrdersRequest();
  const pairId = argv.pair_id ? argv.pair_id.toUpperCase() : undefined;
  request.setPairId(pairId);
  request.setIncludeOwnOrders(true);
  loadXudClient(argv).listOrders(request, callback(argv, displayTables, displayJson));
};
