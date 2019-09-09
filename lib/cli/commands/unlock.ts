import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { UnlockNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'unlock <password>';

export const describe = 'unlock xud';

export const builder = {
  password: {
    description: 'the password previously used to create the xud instance',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnlockNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).unlockNode(request, callback(argv));
};
