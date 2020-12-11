import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { GetBalanceRequest, GetBalanceResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { satsToCoinsStr } from '../utils';

const HEADERS = [
  colors.blue('Currency'),
  colors.blue('Total Balance'),
  colors.blue('Wallet Balance (Not Tradable)'),
  colors.blue('Channel Balance (Tradable)'),
];

const formatBalances = (balances: GetBalanceResponse.AsObject) => {
  const formatted: any[] = [];
  balances.balancesMap.forEach((balanceElement) => {
    const currency = balanceElement[0];
    const balance = balanceElement[1];
    const row = [];
    row.push(
      currency,
      satsToCoinsStr(balance.totalBalance),
      formatBalance(balance.walletBalance, balance.unconfirmedWalletBalance),
      formatBalance(balance.channelBalance, balance.pendingChannelBalance, balance.inactiveChannelBalance),
    );
    formatted.push(row);
  });
  return formatted;
};

const formatBalance = (availableBalance: number, pendingBalance: number, inactiveBalance = 0) => {
  const availableBalanceStr = satsToCoinsStr(availableBalance);
  const unconfirmedBalanceStr = pendingBalance > 0 ? `${satsToCoinsStr(pendingBalance)} pending` : undefined;
  const inactiveBalanceStr = inactiveBalance > 0 ? `${satsToCoinsStr(inactiveBalance)} inactive` : undefined;
  if (unconfirmedBalanceStr || inactiveBalanceStr) {
    let str = availableBalanceStr;
    let paranthetical = '';
    if (unconfirmedBalanceStr) {
      paranthetical += paranthetical ? ` | ${unconfirmedBalanceStr}` : unconfirmedBalanceStr;
    }
    if (inactiveBalanceStr) {
      paranthetical += paranthetical ? ` | ${inactiveBalanceStr}` : inactiveBalanceStr;
    }
    str += ` (${paranthetical})`;
    return str;
  }
  return availableBalanceStr;
};

const createTable = () => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  return table;
};

export const displayBalances = (balances: GetBalanceResponse.AsObject) => {
  const table = createTable();
  const formatted = formatBalances(balances);
  formatted.forEach((balance) => table.push(balance));
  console.log(colors.underline(colors.bold('\nBalance:')));
  console.log(table.toString());
};

export const command = 'getbalance [currency]';

export const describe = 'get total balance for a given currency';

export const builder = (argv: Argv) =>
  argv
    .option('currency', {
      describe: 'the currency to query for',
      type: 'string',
    })
    .example('$0 getbalance', 'get balance for all currencies')
    .example('$0 getbalance BTC', 'get BTC balance');

export const handler = async (argv: Arguments<any>) => {
  const request = new GetBalanceRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }
  (await loadXudClient(argv)).getBalance(request, callback(argv, displayBalances));
};
