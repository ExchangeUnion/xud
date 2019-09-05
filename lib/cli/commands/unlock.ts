import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { UnlockNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'unlock <password>';

export const describe = 'unlock your xud node';

export const builder = {
  password: {
    description: 'Replace <password> with the password you previously used to create your xud node to decrypt your xud node key and underlying wallets',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnlockNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).unlockNode(request, callback(argv));
};
