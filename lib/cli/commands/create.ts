import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { CreateNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'create <password>';

export const describe = 'use this to create a new xud instance and set a password';

export const builder = {
  password: {
    description: 'the password to secure xud with',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).createNode(request, callback(argv));
};
