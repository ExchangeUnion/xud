import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { DisconnectRequest } from '../../proto/xudrpc_pb';

export const command = 'disconnect <host> [port]';

export const describe = 'disconnect from an xu node';

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
  const request = new DisconnectRequest();
  request.setHost(argv.host);
  request.setPort(argv.port);
  loadXudClient(argv).disconnect(request, callback);
};
