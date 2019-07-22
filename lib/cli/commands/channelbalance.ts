import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ChannelBalanceRequest, ChannelBalanceResponse } from '../../proto/xudrpc_pb';
import { satsToCoinsStr } from '../utils';

export const command = 'channelbalance [currency]';

export const describe = 'get total channel balance for a given currency';

export const builder = {
  currency: {
    describe: 'the currency to query for',
    type: 'string',
  },
};

export const formatOutput = (response: ChannelBalanceResponse.AsObject) => {
  const balancesMap = response.balancesMap;
  balancesMap.forEach(([currency, channelBalance]) => {
    const pendingBalance = channelBalance.pendingOpenBalance ? ` (+${satsToCoinsStr(channelBalance.pendingOpenBalance)} ${currency} pending)` : '';
    console.log(`${satsToCoinsStr(channelBalance.balance)} ${currency}${pendingBalance}`);
  });
};

export const handler = (argv: Arguments) => {
  const request = new ChannelBalanceRequest();
  if (argv.currency) {
    request.setCurrency(argv.currency.toUpperCase());
  }
  loadXudClient(argv).channelBalance(request, callback(argv, formatOutput));
};
