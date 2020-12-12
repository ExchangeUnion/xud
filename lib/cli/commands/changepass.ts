import readline from 'readline';
import { Arguments } from 'yargs';
import { ChangePasswordRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'changepass';

export const describe = 'change the password for an existing xud instance';

export const builder = {};

const formatOutput = () => {
  console.log('The master xud password was succesfully changed.');
  console.log('Passwords for lnd wallets will be changed the next time xud is restarted and unlocked.');
};

export const handler = (argv: Arguments<any>) => {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
  });

  console.log('\
You are changing the master password for xud and underlying wallets.\
');
  process.stdout.write('Enter old password: ');
  rl.question('', (oldPassword) => {
    process.stdout.write('\nEnter new password: ');
    rl.question('', (password1) => {
      process.stdout.write('\nRe-enter password: ');
      rl.question('', async (password2) => {
        process.stdout.write('\n\n');
        rl.close();
        if (password1 === password2) {
          const request = new ChangePasswordRequest();
          request.setNewPassword(password1);
          request.setOldPassword(oldPassword);

          const client = await loadXudClient(argv);
          // wait up to 3 seconds for rpc server to listen before call in case xud was just started
          client.waitForReady(Date.now() + 3000, () => {
            client.changePassword(request, callback(argv, formatOutput));
          });
        } else {
          process.exitCode = 1;
          console.error('Passwords do not match, please try again');
        }
      });
    });
  });
};
