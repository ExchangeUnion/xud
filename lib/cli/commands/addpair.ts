import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { AddPairRequest } from '../../proto/xudrpc_pb';

export const command = 'addpair <base_currency> <quote_currency>';

export const describe = 'add a trading pair';

export const builder = {
  base_currency: {
    description: 'The currency bought and sold for this trading pair',
    type: 'string',
  },
  quote_currency: {
    description: 'The currency used to quote a price',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new AddPairRequest();
  request.setBaseCurrency(argv.base_currency.toUpperCase());
  request.setQuoteCurrency(argv.quote_currency.toUpperCase());
  loadXudClient(argv).addPair(request, callback(argv));
};
