import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { UnbanRequest } from '../../proto/xudrpc_pb';

export const command = 'unban <node_pub_key> [reconnect]';

export const describe = 'unban an xud node';

export const builder = {
  node_pub_key: {
    description: 'NodePubKey of the node to unban',
    type: 'string',
  },
  reconnect: {
    description: 'Whether to reconnect after unbanning',
    type: 'boolean',
    default: true,
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnbanRequest();
  request.setNodePubKey(argv.node_pub_key);
  request.setReconnect(argv.reconnect);
  loadXudClient(argv).unban(request, callback());
};
