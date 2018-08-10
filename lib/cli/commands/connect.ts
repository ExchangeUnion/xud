import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ConnectRequest } from '../../proto/xudrpc_pb';

export const command = 'connect <node_pub_key> <host> [port]';

export const describe = 'connect to an xu node';

export const builder = {
  node_pub_key: {
    description: 'nodePubKey of peer to connect',
    type: 'string',
  },
  host: {
    description: 'hostname or IP address',
    type: 'string',
  },
  port: {
    description: 'listening port number',
    type: 'number',
    default: '8885',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ConnectRequest();
  request.setHost(argv.host);
  request.setPort(argv.port);
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).connect(request, callback);
};
