import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { ListTradesRequest, ListTradesResponse, Trade } from '../../proto/xudrpc_pb';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { satsToCoinsStr } from '../utils';
import { OrderSide } from '../../constants/enums';

const HEADERS = [
  colors.blue('Trading Pair'),
  colors.blue('Amount'),
  colors.blue('Buy/Sell'),
  colors.blue('Price'),
  colors.blue('Peer Pubkey'),
  colors.blue('Secret'),
  colors.blue('Role'),
];

const trimPubKey = (key: string) => {
  if (key.length <= 0) {
    return '';
  }
  return `${key.slice(0, 10)}...${key.slice(key.length - 10)}`;
};

const displayTrades = (trades: ListTradesResponse.AsObject) => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  trades.tradesList.forEach((trade: Trade.AsObject) => {
    const details = [
      trade.pairId,
      satsToCoinsStr(trade.quantity),
    ];

    const order = trade.makerOrder ? trade.makerOrder : trade.takerOrder;
    if (order) {
      details.push(OrderSide[order.side]);
      details.push(order.price.toFixed(5));
      details.push(trimPubKey(order.peerPubKey));
    } else {
      details.push(...['', '', '']);
    }

    details.push(trimPubKey(trade.rHash));
    details.push(trade.makerOrder ? 'Maker' : 'Taker');

    table.push(details);
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
