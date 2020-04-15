import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { TradingLimitsRequest, TradingLimitsResponse } from '../../proto/xudrpc_pb';
import { satsToCoinsStr } from '../utils';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

const HEADERS = [
  colors.blue('Currency'),
  colors.blue('Max Buy'),
  colors.blue('Max Sell'),
];

const formatTradingLimits = (tradingLimits: TradingLimitsResponse.AsObject) => {
  const formatted: any[] = [];
  tradingLimits.limitsMap.forEach((limits) => {
    const element = [];
    element.push(
      limits[0],
      `${satsToCoinsStr(limits[1].maxbuy)}`,
      `${satsToCoinsStr(limits[1].maxsell)}`,
    );
    formatted.push(element);
  });
  return formatted;
};

const createTable = () => {
  const table = new Table({
    head: HEADERS,
  }) as HorizontalTable;
  return table;
};

const displayLimits = (limits: TradingLimitsResponse.AsObject) => {
  const table = createTable();
  const formatted = formatTradingLimits(limits);
  formatted.forEach(limits => table.push(limits));
  console.log(colors.underline(colors.bold('\nTrading Limits:')));
  console.log(table.toString());
};

export const command = 'tradinglimits [currency]';

export const describe = 'trading limits for a given currency';

export const builder = {
  currency: {
    describe: 'the currency to query for',
    type: 'string',
  },
};

export const handler = async (argv: Arguments<any>) => {
  const request = new TradingLimitsRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }

  (await loadXudClient(argv)).tradingLimits(request, callback(argv, displayLimits));
};
