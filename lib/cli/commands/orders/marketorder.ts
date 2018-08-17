import { Arguments } from 'yargs';
import * as limitorder from './limitorder';

export const command = 'marketorder <pair_id> <order_id> <quantity>';

export const describe = 'place a market order';

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
};

export const handler = (argv: Arguments) => {
  limitorder.handler(argv);
};
