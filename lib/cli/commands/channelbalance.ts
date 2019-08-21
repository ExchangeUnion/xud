import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ChannelBalanceRequest, ChannelBalanceResponse } from '../../proto/xudrpc_pb';
import { satsToCoinsStr } from '../utils';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

const HEADERS = [
  colors.blue('Ticker'),
  colors.blue('Balance'),
  colors.blue('Pending Balance'),
];

const formatChannels = (channels: ChannelBalanceResponse.AsObject) => {
  const formatted: any[] = [];
  channels.balancesMap.forEach((channel) => {
    const element = [];
    element.push(channel[0], `${satsToCoinsStr(channel[1].balance)}`, `${satsToCoinsStr(channel[1].pendingOpenBalance)}`);
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

const displayChannels = (channels: ChannelBalanceResponse.AsObject) => {
  const table = createTable();
  const formatted = formatChannels(channels);
  formatted.forEach(channel => table.push(channel));
  console.log(colors.underline(colors.bold('\nChannel balance:')));
  console.log(table.toString());
};

export const command = 'channelbalance [currency]';

export const describe = 'get total channel balance for a given currency';

export const builder = {
  currency: {
    describe: 'the currency to query for',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ChannelBalanceRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }
  loadXudClient(argv).channelBalance(request, callback(argv, displayChannels));
};
