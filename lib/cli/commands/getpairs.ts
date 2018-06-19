import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { GetPairsRequest } from '../../proto/xudrpc_pb';

export const command = 'getpairs';

export const describe = 'get order book\'s available pairs';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).getPairs(new GetPairsRequest(), callback);
};
