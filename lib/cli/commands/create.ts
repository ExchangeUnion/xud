import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { CreateNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'create <password>';

export const describe = 'create your xud node and set a password';

export const builder = {
  password: {
    description: 'Use this to instantiate a new xud instance',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CreateNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).createNode(request, callback(argv));
};
