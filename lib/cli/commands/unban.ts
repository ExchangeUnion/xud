import { Arguments, Argv } from 'yargs';
import { UnbanRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'unban <node_identifier> [--reconnect]';

export const describe = 'unban a previously banned remote node';

export const builder = (argv: Argv) =>
  argv
    .positional('node_identifier', {
      description: 'the node key or alias of the remote node to unban',
      type: 'string',
    })
    .option('reconnect', {
      description: 'whether to connect to the remote node after unbanning',
      type: 'boolean',
      default: true,
    })
    .example('$0 unban 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b', 'unban by node key')
    .example('$0 unban CheeseMonkey', 'unban by alias');

export const handler = async (argv: Arguments<any>) => {
  const request = new UnbanRequest();
  request.setNodeIdentifier(argv.node_identifier);
  request.setReconnect(argv.reconnect);
  (await loadXudClient(argv)).unban(request, callback(argv));
};
