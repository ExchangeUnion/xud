import { Arguments, Argv } from 'yargs';
import { BanRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'ban <node_identifier>';

export const describe = 'ban a remote node';

export const builder = (argv: Argv) =>
  argv
    .positional('node_identifier', {
      description: 'the node key or alias of the remote node to ban',
      type: 'string',
    })
    .example('$0 ban 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b', 'ban by node key')
    .example('$0 ban CheeseMonkey', 'ban by alias');

export const handler = async (argv: Arguments<any>) => {
  const request = new BanRequest();
  request.setNodeIdentifier(argv.node_identifier);
  (await loadXudClient(argv)).ban(request, callback(argv));
};
