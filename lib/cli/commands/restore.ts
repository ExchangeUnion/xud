import readline from 'readline';
import { Arguments } from 'yargs';
import { RestoreNodeRequest, RestoreNodeResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudInitClient } from '../command';
import { getDefaultCertPath, waitForCert } from '../utils';

export const command = 'restore';

export const describe = 'restore an xud instance from seed';

export const builder = {};

const formatOutput = (response: RestoreNodeResponse.AsObject) => {
  let walletRestoredMessage = 'The following wallets were restored: ';

  if (response.restoredLndsList.length) {
    walletRestoredMessage += response.restoredLndsList.join(', ');
  }

  if (response.restoredRaiden) {
    if (!walletRestoredMessage.endsWith(' ')) {
      walletRestoredMessage += ', ';
    }

    walletRestoredMessage += 'ERC20(ETH)';
  }

  console.log(walletRestoredMessage);
};

export const handler = (argv: Arguments<any>) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  console.log(`
You are restoring an xud node key and underlying wallets. All will be secured by
a single password provided below.
  `);
  rl.question('Enter your 24 word mnemonic separated by spaces: ', (mnemonicStr) => {
    rl.close();
    const rlQuiet = readline.createInterface({
      input: process.stdin,
      terminal: true,
    });
    const mnemonic = mnemonicStr.split(' ');
    if (mnemonic.length !== 24) {
      console.error('Mnemonic must be exactly 24 words');
      process.exitCode = 1;
      return;
    }
    process.stdout.write('Enter a password: ');
    rlQuiet.question('', (password1) => {
      process.stdout.write('\nRe-enter password: ');
      rlQuiet.question('', async (password2) => {
        process.stdout.write('\n\n');
        rlQuiet.close();
        if (password1 === password2) {
          const request = new RestoreNodeRequest();
          request.setPassword(password1);
          request.setSeedMnemonicList(mnemonic);

          const certPath = argv.tlscertpath ? argv.tlscertpath : getDefaultCertPath();
          try {
            await waitForCert(certPath);
          } catch (err) {
            console.error(err);
            process.exitCode = 1;
            return;
          }

          const client = loadXudInitClient(argv);
          // wait up to 3 seconds for rpc server to listen before call in case xud was just started
          client.waitForReady(Date.now() + 3000, () => {
            client.restoreNode(request, callback(argv, formatOutput));
          });
        } else {
          process.exitCode = 1;
          console.error('Passwords do not match, please try again');
        }
      });
    });
  });
};
