import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ConnectRequest } from '../../proto/xudrpc_pb';

export const command = 'connect <host> [port]';

export const describe = 'connect to an xu node';

export const builder = {
  host: {
    description: 'target p2p server host',
    type: 'string',
  },
  port: {
    description: 'target p2p server port',
    type: 'number',
    default: '8885',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ConnectRequest();
  request.setHost(argv.host);
  request.setPort(argv.port);
  loadXudClient(argv).connect(request, callback);
};
