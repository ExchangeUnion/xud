import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { CancelOrderRequest, Order } from '../../proto/xudrpc_pb';

export const command = 'placeorder <pair_id> <price> <quantity>';

export const describe = 'place an order';

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
