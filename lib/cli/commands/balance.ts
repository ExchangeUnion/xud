import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { GetBalanceRequest, GetBalanceResponse } from '../../proto/xudrpc_pb';
import { satsToCoinsStr } from '../utils';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

const HEADERS = [
  colors.blue('Ticker'),
  colors.blue('Balance'),
  colors.blue('Pending Balance'),
];

const formatBalances = (balances: GetBalanceResponse.AsObject) => {
  const formatted: any[] = [];
  balances.balancesMap.forEach((balance) => {
    const element = [];
    element.push(balance[0], `${satsToCoinsStr(balance[1].balance)}`, `${satsToCoinsStr(balance[1].pendingOpenBalance)}`);
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

const displayBalances = (balances: GetBalanceResponse.AsObject) => {
  const table = createTable();
  const formatted = formatBalances(balances);
  formatted.forEach(balance => table.push(balance));
  console.log(colors.underline(colors.bold('\nBalance:')));
  console.log(table.toString());
};

export const command = 'balance [currency]';

export const describe = 'get total balance for a given currency';

export const builder = {
  currency: {
    describe: 'the currency to query for',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetBalanceRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }
  loadXudClient(argv).getBalance(request, callback(argv, displayBalances));
};
