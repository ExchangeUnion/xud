import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ChannelBalanceRequest } from '../../proto/xudrpc_pb';

export const command = 'channelbalance <currency>';

export const describe = 'get total channel balance for a given currency';

export const builder = {
  currency: {
    describe: 'the currency to query for',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ChannelBalanceRequest();
  request.setCurrency(argv.currency.toUpperCase());
  loadXudClient(argv).channelBalance(request, callback);
};
