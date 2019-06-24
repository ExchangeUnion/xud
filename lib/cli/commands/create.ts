import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { CreateNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'create <password>';

export const describe = 'create an xud node';

export const builder = {
  password: {
    description: 'password to encrypt xud key and wallets',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).createNode(request, callback(argv));
};
