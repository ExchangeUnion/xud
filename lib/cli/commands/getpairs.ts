import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

export const command = 'getpairs';

export const describe = 'get orderbook\'s available pairs';

const callHandler = (xuClient: XUClient) => {
  return xuClient.getPairs();
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
