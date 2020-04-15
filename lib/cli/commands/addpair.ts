import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { AddPairRequest } from '../../proto/xudrpc_pb';

export const command = 'addpair <base_currency> <quote_currency>';

export const describe = 'add a trading pair';

export const builder = {
  base_currency: {
    description: 'the currency bought and sold for this trading pair',
    type: 'string',
  },
  quote_currency: {
    description: 'the currency used to quote a price',
    type: 'string',
  },
};

export const handler = async (argv: Arguments<any>) => {
  const request = new AddPairRequest();
  request.setBaseCurrency(argv.base_currency.toUpperCase());
  request.setQuoteCurrency(argv.quote_currency.toUpperCase());
  (await loadXudClient(argv)).addPair(request, callback(argv));
};
