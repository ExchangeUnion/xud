import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { UnbanRequest } from '../../proto/xudrpc_pb';

export const command = 'unban <node_identifier> [reconnect]';

export const describe = 'unban a previously banned remote node';

export const builder = {
  node_identifier: {
    description: 'the node key or alias of the remote node to unban',
    type: 'string',
  },
  reconnect: {
    description: 'whether to connect to the remote node after unbanning',
    type: 'boolean',
    default: true,
  },
};

export const handler = async (argv: Arguments<any>) => {
  const request = new UnbanRequest();
  request.setNodeIdentifier(argv.node_identifier);
  request.setReconnect(argv.reconnect);
  (await loadXudClient(argv)).unban(request, callback(argv));
};
