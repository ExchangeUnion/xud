import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { UnbanRequest } from '../../proto/xudrpc_pb';

export const command = 'unban <node_key> [reconnect]';

export const describe = 'unban a previously banned peer';

export const builder = {
  node_key: {
    description: 'the node key of the peer to unban',
    type: 'string',
  },
  reconnect: {
    description: 'whether to reconnect to the peer after unbanning',
    type: 'boolean',
    default: true,
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnbanRequest();
  request.setNodePubKey(argv.node_pub_key);
  request.setReconnect(argv.reconnect);
  loadXudClient(argv).unban(request, callback(argv));
};
