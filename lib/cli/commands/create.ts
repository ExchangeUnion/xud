import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { CreateNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'create <password>';

export const describe = 'create your xud node and set a password';

export const builder = {
  password: {
    description: 'This is the first method that should be used to instantiate a new xud instance. Set a password to encrypt your public key and underlying wallets.',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).createNode(request, callback(argv));
};
