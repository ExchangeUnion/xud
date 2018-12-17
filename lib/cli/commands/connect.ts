import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { ConnectRequest } from '../../proto/xudrpc_pb';

export const command = 'connect <node_uri> [retry_connecting]';

export const describe = 'connect to an xu node';

export const builder = {
  node_uri: {
    description: 'uri of peer in [nodePubKey]@[host]:[port]',
    type: 'string',
  },
  retry_connecting: {
    description: 'whether to apply multiple connection retry attempts',
    type: 'boolean',
    default: false,
  },
};

export const handler = (argv: Arguments) => {
  const request = new ConnectRequest();
  request.setNodeUri(argv.node_uri);
  request.setRetryConnecting(argv.retry_connecting);
  loadXudClient(argv).connect(request, callback(argv));
};
