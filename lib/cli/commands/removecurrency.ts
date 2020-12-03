import { Arguments, Argv } from 'yargs';
import { RemoveCurrencyRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'removecurrency <currency>';

export const describe = 'remove a currency';

export const builder = (argv: Argv) =>
  argv
    .positional('currency', {
      description: 'the ticker symbol for the currency',
      type: 'string',
    })
    .example('$0 removecurrency BTC', 'remove BTC');

export const handler = async (argv: Arguments<any>) => {
  const request = new RemoveCurrencyRequest();
  request.setCurrency(argv.currency.toUpperCase());
  (await loadXudClient(argv)).removeCurrency(request, callback(argv));
};
