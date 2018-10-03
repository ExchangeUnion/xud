import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { UnbanRequest } from '../../proto/xudrpc_pb';

export const command = 'unban <node_pub_key>';

export const describe = 'unban an xud node';

export const builder = {
  node_pub_key: {
    description: 'nodePubKey of the node to unban',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnbanRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).unban(request, callback);
};
