import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { Role, Trade, TradeHistoryRequest, TradeHistoryResponse, OrderSide } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { satsToCoinsStr, trim } from '../utils';

const HEADERS = [
  colors.blue('Execution'),
  colors.blue('Price'),
  colors.blue('Role'),
  colors.blue('Order Id'),
  colors.blue('Order Id    (Counterparty)'),
  colors.blue('Swap Hash'),
  colors.blue('Executed At'),
];

const displayTrades = (trades: TradeHistoryResponse.AsObject) => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  trades.tradesList.forEach((trade: Trade.AsObject) => {
    const [baseCurrency, quoteCurrency] = trade.pairId.split('/');
    const counterparty = trade.counterparty?.alias || 'Self';
    let role: string;
    let orderId: string;
    let counterpartyOrderId: string;
    switch (trade.role) {
      case Role.TAKER:
        orderId = trim(trade.takerOrder!.id ?? '', 8);
        counterpartyOrderId = trim(trade.makerOrder?.id ?? '', 8);
        role = 'Taker';
        break;
      case Role.MAKER:
        orderId = trim(trade.makerOrder!.id ?? '', 8);
        counterpartyOrderId = 'N/A';
        role = 'Maker';
        break;
      case Role.INTERNAL:
        orderId = trim(trade.takerOrder?.id ?? '', 8);
        counterpartyOrderId = trim(trade.makerOrder?.id ?? '', 8);
        role = 'Internal';
        break;
      default:
        throw new Error('unrecognized trade role');
    }
    let side: string;
    switch (trade.side) {
      case OrderSide.BUY:
        side = 'Buy';
        break;
      case OrderSide.SELL:
        side = 'Sell';
        break;
      case OrderSide.BOTH:
        side = trade.takerOrder!.side === OrderSide.BUY ? 'Buy' : 'Sell';
        break;
      default:
        throw new Error('unrecognized trade side');
    }

    const details = [
      `${side} ${satsToCoinsStr(trade.quantity)} ${baseCurrency}`,
      `${trade.price} ${quoteCurrency}`,
      role,
      orderId,
      `${counterpartyOrderId} (${counterparty})`,
      trim(trade.rHash, 6),
      new Date(trade.executedAt).toLocaleString(),
    ];

    table.push(details);
  });
  console.log(colors.underline(colors.bold('Trades:')));
  console.log(table.toString());
};

export const command = 'tradehistory [limit]';

export const describe = 'list completed trades';

export const builder = (argv: Argv) =>
  argv
    .option('limit', {
      description: 'the maximum number of trades to display',
      type: 'number',
      default: 15,
    })
    .option('all', {
      description: 'whether to display the complete trade history',
      type: 'boolean',
      default: false,
    })
    .example('$0 tradehistory', 'list most recent trades')
    .example('$0 tradehistory 50', 'list the 50 most recent trades');

export const handler = async (argv: Arguments<any>) => {
  const request = new TradeHistoryRequest();
  if (!argv.all) {
    // don't set a limit if the --all flag is specified
    request.setLimit(argv.limit);
  }
  (await loadXudClient(argv)).tradeHistory(request, callback(argv, displayTrades));
};
