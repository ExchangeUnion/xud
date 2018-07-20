import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { CancelOrderRequest } from '../../proto/xudrpc_pb';

export const command = 'cancelorder <id>';

export const describe = 'cancel an order';

export const builder = {
  id: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CancelOrderRequest();
  request.setId(argv.type);
  loadXudClient(argv).cancelOrder(request, callback);
};
