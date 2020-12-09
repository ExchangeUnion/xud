import { Arguments, Argv } from 'yargs';
import { DiscoverNodesRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'discovernodes <node_identifier>';

export const describe = 'discover nodes from a specific peer';

export const builder = (argv: Argv) =>
  argv
    .positional('node_identifier', {
      description: 'the node key or alias of the connected peer to discover nodes from',
      type: 'string',
    })
    .example(
      '$0 discovernodes 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b',
      'discover nodes from a peer by node key',
    )
    .example('$0 discovernodes CheeseMonkey', 'discover nodes from a peer by alias');

export const handler = async (argv: Arguments<any>) => {
  const request = new DiscoverNodesRequest();
  request.setNodeIdentifier(argv.node_identifier);
  (await loadXudClient(argv)).discoverNodes(request, callback(argv));
};
