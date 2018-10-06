import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { GetNodeReputationRequest } from '../../proto/xudrpc_pb';

export const command = 'getnodereputation <node_pub_key>';

export const describe = 'get node reputation';

export const builder = {
  node_pub_key: {
    type: 'string',
    description: 'NodePubKey of node to get reputation',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetNodeReputationRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).getNodeReputation(request, callback);
};
