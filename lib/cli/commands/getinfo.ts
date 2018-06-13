import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { GetInfoRequest } from '../../proto/xudrpc_pb';

export const command = 'getinfo';

export const describe = 'get general info from the xud node';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).getInfo(new GetInfoRequest(), callback);
};
