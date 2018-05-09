import callback from '../command';
import XUClient from '../../xuclient/XUClient';
import { Arguments } from 'yargs';

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

const callHandler = (xuClient: XUClient, argv: Arguments) => {
  return xuClient.connect(argv.host, argv.port);
};

export const handler = (argv: Arguments) => {
  callback(argv, callHandler);
};
