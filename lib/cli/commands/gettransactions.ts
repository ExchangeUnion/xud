import { callback, loadXudClient } from '../command';
import { GetTransactionsRequest } from '../../proto/xudrpc_pb';
import { GetTransactionsRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'gettransactions <currency>';

export const describe = 'get transactions';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new GetTransactionsRequest();
  const lndrequest = new LndRequest();
  request.setCurrency(argv.currency);
  request.setGetTransactions(lndrequest);
  loadXudClient(argv).getTransactions(request, callback(argv));
};
