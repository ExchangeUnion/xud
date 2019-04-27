import { loadXudClient, callback } from '../command';
import { Arguments } from 'yargs';
import { GetTransactionsRequest } from '../../proto/xudrpc_pb';
import * as lndrpc from '../../proto/lndrpc_pb';

export const command = 'subscribetransactions <currency>';

export const describe = 'stream newly discovered transactions relevant to the wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetTransactionsRequest();
  request.setCurrency(argv.currency);
  request.setGetTransactions(new lndrpc.GetTransactionsRequest());

  const stream = loadXudClient(argv).subscribeTransactions(request, callback(argv));

  stream.on('data', (tx: lndrpc.Transaction) => {
    console.log(`Transaction recived: ${JSON.stringify(tx.toObject())}`);
  });

  stream.on('error', (err: Error) => {
    console.log(`Unexpected error occurred: ${JSON.stringify(err)}`);
  });

};
