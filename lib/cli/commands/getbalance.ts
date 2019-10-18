import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { GetBalanceRequest, GetBalanceResponse } from '../../proto/xudrpc_pb';
import { satsToCoinsStr } from '../utils';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

const HEADERS = [
  colors.blue('Currency'),
  colors.blue('Total Balance'),
  colors.blue('Channel Balance (Tradable)'),
  colors.blue('Wallet Balance (Not Tradable)'),
];

const formatBalances = (balances: GetBalanceResponse.AsObject) => {
  const formatted: any[] = [];
  balances.balancesMap.forEach((balance) => {
    const element = [];
    element.push(
      balance[0],
      `${satsToCoinsStr(balance[1].totalBalance)}`,
      formatBalance(balance[1].channelBalance, balance[1].pendingChannelBalance),
      formatBalance(balance[1].walletBalance, balance[1].unconfirmedWalletBalance),
    );
    formatted.push(element);
  });
  return formatted;
};

const formatBalance = (confirmedBalance: number, unconfirmedBalance: number) => {
  const confirmedBalanceStr = satsToCoinsStr(confirmedBalance);
  return unconfirmedBalance > 0 ?
    `${confirmedBalanceStr} (${satsToCoinsStr(unconfirmedBalance)} pending)` :
    confirmedBalanceStr;
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

export const command = 'getbalance [currency]';

export const describe = 'get total balance for a given currency';

export const builder = {
  currency: {
    describe: 'the currency to query for',
    type: 'string',
  },
};

export const handler = (argv: Arguments<any>) => {
  const request = new GetBalanceRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }
  loadXudClient(argv).getBalance(request, callback(argv, displayBalances));
};
