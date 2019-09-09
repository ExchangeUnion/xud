import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { DiscoverNodesRequest } from '../../proto/xudrpc_pb';

export const command = 'discovernodes <node_key>';

export const describe = 'discover nodes from a specific peer';

export const builder = {
  node_key: {
    description: 'the node key of the peer to discover nodes from',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new DiscoverNodesRequest();
  request.setPeerPubKey(argv.peer_pub_key);
  loadXudClient(argv).discoverNodes(request, callback(argv));
};
