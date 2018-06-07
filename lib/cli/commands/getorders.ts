import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

export const command = 'getorders [pair_id] [max_results]';

export const describe = 'get orders from the orderbook';

export const builder = {
  pair_id: {
    type: 'string',
  },
  max_results: {
    default: 10,
    description: 'max # of orders to return, 0 = no limit',
    type: 'number',
  },
};

const callHandler = (xuClient: XUClient, argv: Arguments) => {
  return xuClient.getOrders(argv.pair_id, argv.max_results);
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
