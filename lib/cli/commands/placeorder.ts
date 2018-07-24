import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { PlaceOrderRequest, Order } from '../../proto/xudrpc_pb';

export const command = 'placeorder <pair_id> <quantity> [price]';

export const describe = 'place an order';

export const builder = {
  price: {
    type: 'number',
  },
  quantity: {
    type: 'number',
  },
  pair_id: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new PlaceOrderRequest();

  const order = new Order();
  order.setPrice(argv.price);
  order.setQuantity(argv.quantity);
  order.setPairId(argv.pair_id);
  request.setOrder(order);

  loadXudClient(argv).placeOrder(request, callback);
};
