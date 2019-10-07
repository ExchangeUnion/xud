import { accessSync, watch } from 'fs';
import path from 'path';
import readline from 'readline';
import { Arguments } from 'yargs';
import { CreateNodeRequest, CreateNodeResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudInitClient } from '../command';
import { getDefaultCertPath } from '../utils';

export const command = 'create';

export const describe = 'use this to create a new xud instance and set a password';

export const builder = {};

const waitForCert = (certPath: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      accessSync(certPath);
      resolve();
    } catch (err) {
      if (err.code === 'ENOENT') {
        // wait up to 5 seconds for the tls.cert file to be created in case
        // this is the first time xud has been run
        const certDir = path.dirname(certPath);
        const certFilename = path.basename(certPath);
        const fsWatcher = watch(certDir, (event, filename) => {
          if (event === 'change' && filename === certFilename) {
            clearTimeout(timeout);
            fsWatcher.close();
            resolve();
          }
        });
        const timeout = setTimeout(() => {
          fsWatcher.close();
          reject(`timed out waiting for cert to be created at ${certPath}`);
        }, 5000);
      } else {
        // we handle errors due to file not existing, otherwise reject
        reject(err);
      }
    }
  });
};

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

    if (response.initializedLndsList.length) {
      console.log(`The following lnd wallets were initialized: ${response.initializedLndsList.join(', ')}`);
    }
    if (response.initializedRaiden) {
      console.log('The keystore for raiden was initialized.');
    }

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

export const handler = (argv: Arguments) => {
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
