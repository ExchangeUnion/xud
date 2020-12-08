import readline from 'readline';
import { Arguments } from 'yargs';
import { CreateNodeRequest, CreateNodeResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudInitClient } from '../command';
import { getDefaultCertPath, waitForCert, showSeed } from '../utils';

export const command = 'create';

export const describe = 'create a new xud instance and set a password';

export const builder = {};

const formatOutput = (response: CreateNodeResponse.AsObject) => {
  const { seedMnemonicList } = response;
  showSeed(seedMnemonicList);

  let walletInitializedMessage = 'The following wallets were initialized: ';

  if (response.initializedLndsList.length) {
    walletInitializedMessage += response.initializedLndsList.join(', ') + (response.initializedConnext ? ', ETH' : '');
  } else if (response.initializedConnext) {
    walletInitializedMessage += 'ETH';
  }

  console.log(walletInitializedMessage);
};

export const handler = (argv: Arguments<any>) => {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
  });

  console.log(`\
You are creating an xud node key and underlying wallets. All will be secured by \
a single password provided below.
`);
  process.stdout.write('Enter a password: ');
  rl.question('', (password1) => {
    process.stdout.write('\nRe-enter password: ');
    rl.question('', async (password2) => {
      process.stdout.write('\n\n');
      rl.close();
      if (password1 === password2) {
        const request = new CreateNodeRequest();
        request.setPassword(password1);

        const certPath = argv.tlscertpath ? argv.tlscertpath : getDefaultCertPath();
        try {
          await waitForCert(certPath);
        } catch (err) {
          console.error(err);
          process.exitCode = 1;
          return;
        }

        const client = await loadXudInitClient(argv);
        // wait up to 3 seconds for rpc server to listen before call in case xud was just started
        client.waitForReady(Date.now() + 3000, () => {
          client.createNode(request, callback(argv, formatOutput));
        });
      } else {
        process.exitCode = 1;
        console.error('Passwords do not match, please try again');
      }
    });
  });
};
