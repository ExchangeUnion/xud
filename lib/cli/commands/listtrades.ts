import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { ListTradesRequest, ListTradesResponse, Trade } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { satsToCoinsStr } from '../utils';

const HEADERS = [
  colors.blue('Trading Pair'),
  colors.blue('Trade Quantity'),
  colors.blue('Price'),
  colors.blue('Order Type'),
];

const displayTrades = (trades: ListTradesResponse.AsObject) => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  trades.tradesList.forEach((trade: Trade.AsObject) => {
    const type = trade.makerOrder ? 'maker' : 'taker';
    let price = 0;
    if (trade.makerOrder) {
      price = trade.makerOrder.price;
    } else if (trade.takerOrder) {
      price = trade.takerOrder.price;
    }

    table.push([
      trade.pairId,
      satsToCoinsStr(trade.quantity),
      parseFloat(price.toFixed(5)),
      type,
    ]);
  });
  console.log(colors.underline(colors.bold('\Trades:')));
  console.log(table.toString());
};

export const command = 'listtrades [limit]';

export const describe = 'list completed trades';

export const builder = (argv: Argv) => argv
  .option('limit', {
    description: 'the maximum number of trades to display',
    type: 'number',
    default: 15,
  })
  .example('$0 listtrades', 'list most recent trades')
  .example('$0 listtrades 50', 'list the 50 most recent trades');

export const handler = async (argv: Arguments<any>) => {
  const request = new ListTradesRequest();
  request.setLimit(argv.limit);
  (await loadXudClient(argv)).listTrades(request, callback(argv, displayTrades));
};
