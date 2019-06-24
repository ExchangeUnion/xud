import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { UnlockNodeRequest } from '../../proto/xudrpc_pb';

export const command = 'unlock <password>';

export const describe = 'unlock an xud node';

export const builder = {
  password: {
    description: 'password to decrypt xud key and wallets',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnlockNodeRequest();
  request.setPassword(argv.password);
  loadXudInitClient(argv).unlockNode(request, callback(argv));
};
