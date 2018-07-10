import { loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { SubscribeInvoicesRequest, SubscribeInvoicesResponse } from '../../proto/xudrpc_pb';

export const command = 'subscribe';

export const describe = 'subscribe to settled invoices';

export const handler = (argv: Arguments) => {
  const request = new SubscribeInvoicesRequest();
  const call = loadXudClient(argv).subscribeInvoices(request);
  call.on('data', (message: SubscribeInvoicesResponse) => {
    console.log(message.toObject());
  });
};
