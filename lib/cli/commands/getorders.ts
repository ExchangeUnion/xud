import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

export const command = 'getorders';

export const describe = 'get orders from the orderbook';

const callHandler = (xuClient: XUClient) => {
  return xuClient.getOrders();
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
