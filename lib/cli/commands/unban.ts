import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { UnbanRequest } from '../../proto/xudrpc_pb';

export const command = 'unban <node_key> [reconnect]';

export const describe = 'unban a previously banned remote node';

export const builder = {
  node_key: {
    description: 'the node key of the remote node to unban',
    type: 'string',
  },
  reconnect: {
    description: 'whether to connect to the remote node after unbanning',
    type: 'boolean',
    default: true,
  },
};

export const handler = (argv: Arguments<any>) => {
  const request = new UnbanRequest();
  request.setNodeIdentifier(argv.node_key);
  request.setReconnect(argv.reconnect);
  loadXudClient(argv).unban(request, callback(argv));
};
