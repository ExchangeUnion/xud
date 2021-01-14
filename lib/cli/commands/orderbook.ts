import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { OrderBookRequest, OrderBookResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { satsToCoinsStr } from '../utils';

const COLUMNS = [19, 19, 19, 19];
const HEADER = [
  { content: colors.green('Buy'), colSpan: 2 },
  { content: colors.red('Sell'), colSpan: 2 },
];
const SECONDARY_HEADER = [colors.green('Quantity'), colors.green('Price'), colors.red('Price'), colors.red('Quantity')];

let precision = 0;

const createTable = () => {
  const table = new Table({ colWidths: COLUMNS }) as HorizontalTable;
  table.push(HEADER);
  table.push(SECONDARY_HEADER);
  return table;
};

const displayOrderbook = (pairId: string, orderbook: OrderBookResponse.Buckets.AsObject) => {
  const table = createTable();
  const { buyBucketsList, sellBucketsList } = orderbook;
  const rowCount = Math.max(buyBucketsList.length, sellBucketsList.length);

  for (let n = 0; n < rowCount; n += 1) {
    const row: string[] = [];
    row[0] = buyBucketsList[n] ? satsToCoinsStr(buyBucketsList[n].quantity) : '';
    row[1] = buyBucketsList[n]?.price.toString() ?? '';
    if (row[1] === '0') {
      // instead of displaying zero, display the < symbol and the smallest price bucket
      // given the specified precision. for example if precision is 2, a zero value
      // would be converted to "<0.01"
      row[1] = `<${1 / 10 ** precision}`;
    }
    row[2] = sellBucketsList[n]?.price.toString() ?? '';
    row[3] = sellBucketsList[n] ? satsToCoinsStr(sellBucketsList[n].quantity) : '';
    table.push(row);
  }

  console.log(colors.underline(colors.bold(`\nTrading pair: ${pairId}`)));
  console.log(table.toString());
};

export const displayTables = (orderbooks: OrderBookResponse.AsObject) => {
  orderbooks.bucketsMap.forEach((val) => {
    displayOrderbook(val[0], val[1]);
  });
};

export const command = 'orderbook [pair_id] [precision]';

export const describe = 'display the order book, with orders aggregated per price point';

export const builder = (argv: Argv) =>
  argv
    .option('pair_id', {
      describe: 'trading pair for which to retrieve the order book',
      type: 'string',
    })
    .option('precision', {
      describe: 'the number of digits following the decimal point',
      type: 'number',
      default: 5,
    })
    .option('limit', {
      describe: 'the number of digits following the decimal point',
      type: 'number',
      default: 8,
    })
    .example('$0 orderbook', 'display the order books for all trading pairs')
    .example('$0 orderbook LTC/BTC', 'display the LTC/BTC order book')
    .example('$0 orderbook LTC/BTC 2', 'display the LTC/BTC order book with 2 decimal precision')
    .example('$0 orderbook --precision 2', 'display the order books for all trading pairs with 2 decimal precision')
    .example(
      '$0 orderbook BTC/USDT -2 --limit 10',
      'display the USDT/BTC order book with up to 10 buckets using hundreds place precision',
    );

export const handler = async (argv: Arguments<any>) => {
  const request = new OrderBookRequest();
  const pairId = argv.pair_id ? argv.pair_id.toUpperCase() : undefined;
  request.setPairId(pairId);
  request.setPrecision(argv.precision);
  precision = argv.precision; // store the precision to a global variable in case we need it for display purposes later
  request.setLimit(argv.limit);
  (await loadXudClient(argv)).orderBook(request, callback(argv, displayTables));
};
