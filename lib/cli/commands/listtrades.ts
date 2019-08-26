import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { ListTradesRequest, ListTradesResponse, Trade } from '../../proto/xudrpc_pb';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
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

export const builder = {
  limit: {
    description: 'the maximum number of trades to display',
    type: 'number',
    default: 15,
  },
};

export const handler = (argv: Arguments) => {
  const request = new ListTradesRequest();
  request.setLimit(argv.limit);
  loadXudClient(argv).listTrades(request, callback(argv, displayTrades));
};
