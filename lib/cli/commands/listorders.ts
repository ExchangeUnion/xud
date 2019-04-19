import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { ListOrdersRequest, ListOrdersResponse, Order, OrderSide } from '../../proto/xudrpc_pb';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { SATOSHIS_PER_COIN } from '../utils';

type FormattedTradingPairOrders = {
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
      (order.quantity / SATOSHIS_PER_COIN).toFixed(8),
      order.price.toString(),
      isOwn,
    ].map(i => order.isOwnOrder ? colors.cyan(i) : i);
  } else {
    return Array.from(Array(COLUMNS_IN_ORDER_SIDE)).map(() => '');
  }
};

export const formatOrders = (orders: ListOrdersResponse.AsObject) => {
  const formattedOrders: FormattedTradingPairOrders[] = [];
  orders.ordersMap.forEach((tradingPair) => {
    const buy = tradingPair[1].buyOrdersList;
    const sell = tradingPair[1].sellOrdersList;
    const totalRows = buy.length < sell.length
      ? sell.length : buy.length;
    const tradingPairOrders = Array.from(Array(totalRows))
      .map(() => {
        return addSide(buy).concat(addSide(sell));
      });
    formattedOrders.push({
      pairId: tradingPair[0],
      orders: tradingPairOrders,
    });
  });
  return formattedOrders;
};

const createTable = () => {
  const table = new Table({
    colWidths: COLUMNS,
  }) as HorizontalTable;
  table.push(HEADER);
  table.push(SECONDARY_HEADER);
  return table;
};

const displayOrdersTable = (tradingPair: FormattedTradingPairOrders) => {
  const table = createTable();
  tradingPair.orders.forEach(order => table.push(order));
  console.log(colors.underline(colors.bold(`\nTrading pair: ${tradingPair.pairId}`)));
  console.log(table.toString());
};

const displayTables = (orders: ListOrdersResponse.AsObject) => {
  formatOrders(orders).forEach(displayOrdersTable);
};

export const command = 'listorders [pair_id] [include_own_orders] [limit]';

export const describe = 'list orders from the order book';

export const builder = {
  pair_id: {
    describe: 'trading pair for which to retrieve orders',
    type: 'string',
  },
  include_own_orders: {
    describe: 'whether to include own orders',
    type: 'boolean',
    default: true,
  },
  limit: {
    describe: 'max number of orders to return',
    type: 'number',
    default: 0,
  },
};

export const handler = (argv: Arguments) => {
  const request = new ListOrdersRequest();
  const pairId = argv.pair_id ? argv.pair_id.toUpperCase() : undefined;
  request.setPairId(pairId);
  request.setIncludeOwnOrders(argv.include_own_orders);
  request.setLimit(argv.limit);
  loadXudClient(argv).listOrders(request, callback(argv, displayTables));
};
