import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { GetNodeInfoRequest } from '../../proto/xudrpc_pb';

export const command = 'getnodeinfo <node_pub_key>';

export const describe = 'get general information about a node';

export const builder = {
  node_pub_key: {
    type: 'string',
    description: 'nodePubKey of node to get reputation',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetNodeInfoRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).getNodeInfo(request, callback);
};
