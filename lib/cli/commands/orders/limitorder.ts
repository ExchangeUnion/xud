import { callback, loadXudClient } from '../../command';
import { Arguments } from 'yargs';
import { PlaceOrderRequest, Order } from '../../../proto/xudrpc_pb';

export const command = 'limitorder <pair_id> <order_id> <quantity> <price>';

export const describe = 'place a limit order';

export const builder = {
  pair_id: {
    type: 'string',
  },
  order_id: {
    type: 'string',
  },
  quantity: {
    type: 'number',
  },
  price: {
    type: 'number',
  },
};

export const handler = (argv: Arguments) => {
  const request = new PlaceOrderRequest();

  request.setPairId(argv.pair_id);
  request.setOrderId(argv.order_id);
  request.setQuantity(argv.quantity);
  request.setPrice(argv.price);

  loadXudClient(argv).placeOrder(request, callback);
};
