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
      formatBalance(balance[1].channelBalance, balance[1].pendingChannelBalance, balance[1].inactiveChannelBalance),
      formatBalance(balance[1].walletBalance, balance[1].unconfirmedWalletBalance),
    );
    formatted.push(element);
  });
  return formatted;
};

const formatBalance = (confirmedBalance: number, unconfirmedBalance: number, inactiveBalance = 0) => {
  const confirmedBalanceStr = satsToCoinsStr(confirmedBalance);
  const unconfirmedBalanceStr = unconfirmedBalance > 0 ? `${satsToCoinsStr(unconfirmedBalance)} pending` : undefined;
  const inactiveBalanceStr = inactiveBalance > 0 ? `${satsToCoinsStr(inactiveBalance)} inactive` : undefined;
  if (unconfirmedBalanceStr || inactiveBalanceStr) {
    let str = `${confirmedBalanceStr} (`;
    if (unconfirmedBalanceStr) {
      str += inactiveBalanceStr ? `${inactiveBalanceStr} | ${unconfirmedBalanceStr}` : unconfirmedBalanceStr;
    } else {
      str += inactiveBalanceStr;
    }
    str += ')';
    return str;
  }
  return confirmedBalanceStr;
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

export const handler = async (argv: Arguments<any>) => {
  const request = new GetBalanceRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }
  (await loadXudClient(argv)).getBalance(request, callback(argv, displayBalances));
};
