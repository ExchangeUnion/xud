import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { UnlockNodeRequest } from '../../proto/xudrpc_pb';
import readline from 'readline';

export const command = 'unlock';

export const describe = 'unlock an xud node';

export const builder = {};

export const handler = (argv: Arguments) => {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
  });

  process.stdout.write('Enter master xud password: ');
  rl.question('', (password) => {
    process.stdout.write('\n');
    rl.close();
    const request = new UnlockNodeRequest();
    request.setPassword(password);
    loadXudInitClient(argv).unlockNode(request, callback(argv));
  });
};
