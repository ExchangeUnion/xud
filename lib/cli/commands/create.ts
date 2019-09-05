import { Arguments } from 'yargs';
import { callback, loadXudInitClient } from '../command';
import { CreateNodeRequest } from '../../proto/xudrpc_pb';
import readline from 'readline';

export const command = 'create';

export const describe = 'create an xud node';

export const builder = {};

export const handler = (argv: Arguments) => {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
  });

  process.stdout.write('Enter master xud password: ');
  rl.question('', (password1) => {
    process.stdout.write('\n');
    process.stdout.write('Re-enter password: ');
    rl.question('', (password2) => {
      process.stdout.write('\n');
      rl.close();
      if (password1 === password2) {
        const request = new CreateNodeRequest();
        request.setPassword(argv.password);
        loadXudInitClient(argv).createNode(request, callback(argv));
      } else {
        console.log('Passwords do not match, please try again');
      }
    });
  });
};
