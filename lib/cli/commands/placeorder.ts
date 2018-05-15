import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

export const command = 'placeorder <pair_id> <price> <quantity>';

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

const callHandler = (xuClient: XUClient, argv: Arguments) => {
  const order = {
    price: argv.price,
    quantity: argv.quantity,
    pairId: argv.pair_id,
  };
  return xuClient.placeOrder(order);
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
