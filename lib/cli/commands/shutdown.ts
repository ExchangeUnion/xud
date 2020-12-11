import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { ShutdownRequest } from '../../proto/xudrpc_pb';

export const command = 'shutdown';

export const describe = 'gracefully shutdown local xud node';

export const handler = async (argv: Arguments) => {
  (await loadXudClient(argv)).shutdown(new ShutdownRequest(), callback(argv));
};
