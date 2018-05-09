import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

export const command = 'shutdown';

export const describe = 'gracefully shutdown the xud node';

const callHandler = (xuClient: XUClient) => {
  return xuClient.shutdown();
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
