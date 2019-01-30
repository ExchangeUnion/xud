import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { RemoveOrderRequest } from '../../proto/xudrpc_pb';

export const command = 'removeorder <order_id> [quantity]';

export const describe = 'remove an order';

export const builder = {
  order_id: {
    type: 'string',
  },
  quantity: {
    type: 'number',
    describe: 'quantity to remove, if unspecified the entire order is removed',
  },
};

export const handler = (argv: Arguments) => {
  const request = new RemoveOrderRequest();
  request.setOrderId(argv.order_id);
  if (argv.quantity) {
    request.setQuantity(argv.quantity);
  }
  loadXudClient(argv).removeOrder(request, callback(argv));
};
