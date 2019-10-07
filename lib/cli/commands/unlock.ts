import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { UnlockNodeRequest } from '../../proto/xudrpc_pb';
import readline from 'readline';

export const command = 'unlock';

export const describe = 'unlock local xud node';

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
    const client = loadXudInitClient(argv);
    // wait up to 3 seconds for rpc server to listen before call in case xud was just started
    client.waitForReady(Date.now() + 3000, () => {
      client.unlockNode(request, callback(argv));
    });
  });
};
