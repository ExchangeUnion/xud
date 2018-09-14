import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { CancelOrderRequest } from '../../proto/xudrpc_pb';

export const command = 'cancelorder <order_id>';

export const describe = 'cancel an order';

export const builder = {
  order_id: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CancelOrderRequest();
  request.setOrderId(argv.order_id);
  loadXudClient(argv).cancelOrder(request, callback);
};
