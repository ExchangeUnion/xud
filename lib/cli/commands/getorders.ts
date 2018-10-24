import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { GetOrdersRequest, GetOrdersResponse, Order, OrderSide } from '../../proto/xudrpc_pb';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

type FormatedTradingPairOrders = {
  pairId: string,
  orders: string[][],
};

const COLUMNS = [19, 19, 12, 19, 19, 12];
const COLUMNS_IN_ORDER_SIDE = COLUMNS.length / 2;
const HEADER = [
  { content: colors.green('Buy'), colSpan: 3 },
  { content: colors.red('Sell'), colSpan: 3 },
];
const SECONDARY_HEADER = [
  colors.green('Quantity'),
  colors.green('Price'),
  colors.green('Own Order'),
  colors.red('Quantity'),
  colors.red('Price'),
  colors.red('Own Order'),
];

const addSide = (orderSide: Order.AsObject[]): string[] => {
  const order = orderSide.pop();
  if (order) {
    const isOwn = order.isOwnOrder ? 'X' : '';
    return [
      order.quantity.toFixed(8),
      order.price.toString(),
      isOwn,
    ].map(i => order.isOwnOrder ? colors.cyan(i) : i);
  } else {
    return Array.from(Array(COLUMNS_IN_ORDER_SIDE)).map(() => '');
  }
};

export const formatOrders = (orders: GetOrdersResponse.AsObject) => {
  const formatedOrders: FormatedTradingPairOrders[] = [];
  orders.ordersMap.forEach((tradingPair) => {
    const buy = tradingPair[1].buyOrdersList;
    const sell = tradingPair[1].sellOrdersList;
    const totalRows = buy.length < sell.length
      ? sell.length : buy.length;
    const tradingPairOrders = Array.from(Array(totalRows))
      .map(() => {
        return addSide(buy).concat(addSide(sell));
      });
    formatedOrders.push({
      pairId: tradingPair[0],
      orders: tradingPairOrders,
    });
  });
  return formatedOrders;
};

const createTable = () => {
  const table = new Table({
    colWidths: COLUMNS,
  }) as HorizontalTable;
  table.push(HEADER);
  table.push(SECONDARY_HEADER);
  return table;
};

const displayOrdersTable = (tradingPair: FormatedTradingPairOrders) => {
  const table = createTable();
  tradingPair.orders.forEach(order => table.push(order));
  console.log(colors.underline(colors.bold(`\nTrading pair: ${tradingPair.pairId}`)));
  console.log(table.toString());
};

const displayTables = (orders: GetOrdersResponse.AsObject) => {
  formatOrders(orders).forEach(displayOrdersTable);
};

export const command = 'getorders [pair_id]';

export const describe = 'get orders from the order book';

export const builder = {
  pair_id: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetOrdersRequest();
  const pairId = argv.pair_id ? argv.pair_id.toUpperCase() : undefined;
  request.setPairId(pairId);
  request.setIncludeOwnOrders(true);
  loadXudClient(argv).getOrders(request, callback(displayTables));
};
