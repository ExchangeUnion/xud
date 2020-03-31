import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { DiscoverNodesRequest } from '../../proto/xudrpc_pb';

export const command = 'discovernodes <node_identifier>';

export const describe = 'discover nodes from a specific peer';

export const builder = {
  node_identifier: {
    description: 'the node key or alias of the connected peer to discover nodes from',
    type: 'string',
  },
};

export const handler = (argv: Arguments<any>) => {
  const request = new DiscoverNodesRequest();
  request.setNodeIdentifier(argv.node_identifier);
  loadXudClient(argv).discoverNodes(request, callback(argv));
};
