import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { RemoveOrderRequest } from '../../proto/xudrpc_pb';
import { coinsToSats } from '../utils';

export const command = 'removeorder <order_id> [quantity]';

export const describe = 'remove an order';

export const builder = {
  order_id: {
    type: 'string',
  },
  quantity: {
    type: 'number',
    describe: 'quantity to remove; if zero or unspecified the entire order is removed',
  },
};

export const handler = async (argv: Arguments<any>) => {
  const request = new RemoveOrderRequest();
  request.setOrderId(argv.order_id);
  if (argv.quantity) {
    request.setQuantity(coinsToSats(argv.quantity));
  }
  (await loadXudClient(argv)).removeOrder(request, callback(argv));
};
