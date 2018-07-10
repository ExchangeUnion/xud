import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { AddInvoiceRequest } from '../../proto/xudrpc_pb';

export const command = 'addinvoice <value> [memo]';

export const describe = 'get orders from the order book';

export const builder = {
  value: {
    type: 'number',
  },
  memo: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new AddInvoiceRequest();
  request.setValue(argv.value);
  request.setMemo(argv.memo);
  loadXudClient(argv).addInvoice(request, callback);
};
