import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { RemoveCurrencyRequest } from '../../proto/xudrpc_pb';

export const command = 'removecurrency <currency>';

export const describe = 'remove a currency';

export const builder = {
  currency: {
    description: 'The ticker symbol for the currency',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new RemoveCurrencyRequest();
  request.setCurrency(argv.currency.toUpperCase());
  loadXudClient(argv).removeCurrency(request, callback);
};
