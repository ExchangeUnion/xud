import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ShutdownRequest } from '../../proto/xudrpc_pb';

export const command = 'shutdown';

export const describe = 'gracefully shutdown the xud node';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).shutdown(new ShutdownRequest(), callback);
};
