import callback from '../command';
import { Arguments } from 'yargs';
import XUClient from '../../xuclient/XUClient';

export const command = 'getinfo';

export const describe = 'get general info from the xud node';

const callHandler = (xuClient: XUClient) => {
  return xuClient.getInfo();
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
