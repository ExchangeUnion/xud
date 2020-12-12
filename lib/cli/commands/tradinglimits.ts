import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { TradingLimitsRequest, TradingLimitsResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { satsToCoinsStr } from '../utils';

const HEADERS = [
  colors.blue('Currency'),
  colors.blue('Max Buy'),
  colors.blue('Max Sell'),
  colors.blue('Reserved Buy'),
  colors.blue('Reserved Sell'),
];

const formatTradingLimits = (tradingLimits: TradingLimitsResponse.AsObject) => {
  const formatted: any[] = [];
  tradingLimits.limitsMap.forEach((tradingLimitElement) => {
    const currency = tradingLimitElement[0];
    const tradingLimit = tradingLimitElement[1];
    const row = [];
    row.push(
      currency,
      `${satsToCoinsStr(tradingLimit.maxBuy)}`,
      `${satsToCoinsStr(tradingLimit.maxSell)}`,
      `${satsToCoinsStr(tradingLimit.reservedBuy)}`,
      `${satsToCoinsStr(tradingLimit.reservedSell)}`,
    );
    formatted.push(row);
  });
  return formatted;
};

const createTable = () => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  return table;
};

export const displayLimits = (limits: TradingLimitsResponse.AsObject) => {
  const table = createTable();
  const formatted = formatTradingLimits(limits);
  formatted.forEach((formattedLimit) => table.push(formattedLimit));
  console.log(colors.underline(colors.bold('\nTrading Limits:')));
  console.log(table.toString());
};

export const command = 'tradinglimits [currency]';

export const describe = 'trading limits for a given currency';

export const builder = (argv: Argv) =>
  argv
    .option('currency', {
      describe: 'the currency to query for',
      type: 'string',
    })
    .example('$0 tradinglimits', 'get the trading limits for all currencies')
    .example('$0 tradinglimits BTC', 'get the trading limits for BTC');

export const handler = async (argv: Arguments<any>) => {
  const request = new TradingLimitsRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }

  (await loadXudClient(argv)).tradingLimits(request, callback(argv, displayLimits));
};
