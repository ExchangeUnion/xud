import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { ConnectRequest } from '../../proto/xudrpc_pb';

export const command = 'connect <node_uri>';

export const describe = 'connect to an xu node';

export const builder = {
  node_uri: {
    description: 'uri of peer in [nodePubKey]@[host]:[port]',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ConnectRequest();
  request.setNodeUri(argv.node_uri);
  loadXudClient(argv).connect(request, callback);
};
