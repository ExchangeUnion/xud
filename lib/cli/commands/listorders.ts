import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { Owner } from '../../constants/enums';
import { ListOrdersRequest, ListOrdersResponse, Order } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { satsToCoinsStr } from '../utils';

type FormattedTradingPairOrders = {
  pairId: string;
  orders: string[][];
};

const COLUMNS = [15, 13, 18, 15, 13, 18];
const COLUMNS_IN_ORDER_SIDE = COLUMNS.length / 2;
const HEADER = [
  { content: colors.green('Buy'), colSpan: 3 },
  { content: colors.red('Sell'), colSpan: 3 },
];
const SECONDARY_HEADER = [
  colors.green('Quantity'),
  colors.green('Price'),
  colors.green('Alias'),
  colors.red('Quantity'),
  colors.red('Price'),
  colors.red('Alias'),
];

const addOrderToSide = (orderSide: Order.AsObject[]): string[] => {
  const order = orderSide.pop();
  if (order) {
    return [satsToCoinsStr(order.quantity), order.price.toString(), order.nodeIdentifier!.alias].map((i) =>
      order.isOwnOrder ? colors.cyan(i) : i,
    );
  } else {
    return Array.from(Array(COLUMNS_IN_ORDER_SIDE)).map(() => '');
  }
};

export const formatOrders = (orders: ListOrdersResponse.AsObject) => {
  const formattedOrders: FormattedTradingPairOrders[] = [];
  orders.ordersMap.forEach(([pairId, tradingPair]) => {
    const buy = tradingPair.buyOrdersList;
    const sell = tradingPair.sellOrdersList;
    const totalRows = buy.length < sell.length ? sell.length : buy.length;
    const tradingPairOrders = Array.from(Array(totalRows)).map(() => {
      return addOrderToSide(buy).concat(addOrderToSide(sell));
    });
    formattedOrders.push({
      pairId,
      orders: tradingPairOrders,
    });
  });
  return formattedOrders;
};

const createTable = () => {
  const table = new Table({ colWidths: COLUMNS }) as HorizontalTable;
  table.push(HEADER);
  table.push(SECONDARY_HEADER);
  return table;
};

const displayOrdersTable = (tradingPair: FormattedTradingPairOrders) => {
  const table = createTable();
  tradingPair.orders.forEach((order) => table.push(order));
  console.log(colors.underline(colors.bold(`\nTrading pair: ${tradingPair.pairId}`)));
  console.log(table.toString());
};

const displayTables = (orders: ListOrdersResponse.AsObject) => {
  formatOrders(orders).forEach(displayOrdersTable);
};

export const command = 'listorders [pair_id] [owner] [limit]';

export const describe = 'list orders from the order book';

export const builder = (argv: Argv) =>
  argv
    .option('pair_id', {
      describe: 'trading pair for which to retrieve orders',
      type: 'string',
    })
    .option('owner', {
      describe: 'whether to include own, peer or both orders',
      type: 'string',
      choices: ['Both', 'Own', 'Peer'],
      coerce: (ownerStr: string) => {
        const ownerLower = ownerStr.toLowerCase();
        return ownerLower.charAt(0).toUpperCase() + ownerLower.slice(1);
      },
      default: 'Both',
    })
    .option('limit', {
      describe: 'max number of orders to return per order book side',
      type: 'number',
    })
    .example('$0 listorders', 'list all known orders')
    .example('$0 listorders LTC/BTC', 'list all LTC/BTC orders')
    .example('$0 listorders LTC/BTC Peer', 'list all LTC/BTC orders from peers')
    .example('$0 listorders LTC/BTC Peer 10', 'list the 10 best LTC/BTC orders from peers')
    .example('$0 listorders --owner Own', 'list all local orders')
    .example('$0 listorders --limit 10', 'list the 10 best orders for all trading pairs');

export const handler = async (argv: Arguments<any>) => {
  const request = new ListOrdersRequest();
  const pairId = argv.pair_id ? argv.pair_id.toUpperCase() : undefined;
  request.setPairId(pairId);
  request.setOwner(Number(Owner[argv.owner]));
  if (argv.limit) {
    request.setLimit(argv.limit);
  }
  request.setIncludeAliases(true);
  (await loadXudClient(argv)).listOrders(request, callback(argv, displayTables));
};
