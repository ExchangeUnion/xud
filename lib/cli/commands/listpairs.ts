import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListPairsRequest } from '../../proto/xudrpc_pb';

export const command = 'listpairs';

export const describe = 'get order book\'s available pairs';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).listPairs(new ListPairsRequest(), callback);
};
