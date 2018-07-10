import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { PayInvoiceRequest } from '../../proto/xudrpc_pb';

export const command = 'payinvoice <invoice>';

export const describe = 'pay a Lightning invoice';

export const builder = {
  invoice: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new PayInvoiceRequest();
  request.setInvoice(argv.invoice);
  loadXudClient(argv).payInvoice(request, callback);
};
