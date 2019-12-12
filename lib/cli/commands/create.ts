import readline from 'readline';
import { Arguments } from 'yargs';
import { CreateNodeRequest, CreateNodeResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudInitClient } from '../command';
import { getDefaultCertPath, waitForCert } from '../utils';

export const command = 'create';

export const describe = 'create a new xud instance and set a password';

export const builder = {};

const formatOutput = (response: CreateNodeResponse.AsObject) => {
  if (response.seedMnemonicList.length === 24) {
    const WORDS_PER_ROW = 4;
    const numberedMnemonic = response.seedMnemonicList.map((value, index) => {
      return `${index >= 9 ? '' : ' '}${index + 1}. ${value.padEnd(10)}`;
    });
    console.log('----------------------BEGIN XUD SEED---------------------');
    for (let n = 0; n < response.seedMnemonicList.length / WORDS_PER_ROW; n += 1) {
      console.log(numberedMnemonic.slice(n * WORDS_PER_ROW, (n + 1) * WORDS_PER_ROW).join(' '));
    }
    console.log('-----------------------END XUD SEED----------------------\n');

    let walletInitializedMessage = 'The following wallets were initialized: ';

    if (response.initializedLndsList.length) {
      walletInitializedMessage += response.initializedLndsList.join(', ');
    }

    if (response.initializedRaiden) {
      if (!walletInitializedMessage.endsWith(' ')) {
        walletInitializedMessage += ', ';
      }

      walletInitializedMessage += 'ERC20(ETH)';
    }

    console.log(walletInitializedMessage);

    console.log(`
Please write down your 24 word mnemonic. It will allow you to recover your xud
node key and on-chain funds for the initialized wallets listed above should you
forget your password or lose your device. Off-chain funds in channels can NOT
be recovered with it and must be backed up and recovered separately. Keep it
somewhere safe, it is your ONLY backup in case of data loss.
    `);
  } else {
    console.log('xud was initialized without a seed because no wallets could be initialized.');
  }
};

export const handler = (argv: Arguments<any>) => {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
  });

  console.log(`
You are creating an xud node key and underlying wallets. All will be secured by
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

        const client = loadXudInitClient(argv);
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
