import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

export const command = 'getorders [max_results]';

export const describe = 'get orders from the orderbook';

export const builder = {
  max_results: {
    type: 'number',
  },
};

const callHandler = (xuClient: XUClient, argv: Arguments) => {
  return xuClient.getOrders(argv.max_results);
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
