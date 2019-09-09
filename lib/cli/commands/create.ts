import readline from 'readline';
import { Arguments } from 'yargs';
import { CreateNodeRequest, CreateNodeResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudInitClient } from '../command';

export const command = 'create';

export const describe = 'create an xud node';

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

    if (response.initializedLndsList.length) {
      console.log(`The following lnd wallets were initialized: ${response.initializedLndsList.join(', ')}`);
    }
    if (response.initializedRaiden) {
      console.log('The wallet for raiden was initialized');
    }

    console.log(`
Please write down your 24 word mnemonic. It will allow you to recover your xud
key and funds for the initialized wallets listed above should you forget your
password or lose your device. Keep it somewhere safe, it is your ONLY backup.
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

  console.log('You are creating an xud key and underlying wallets secured by a single password.');
  process.stdout.write('Enter a password: ');
  rl.question('', (password1) => {
    process.stdout.write('\nRe-enter password: ');
    rl.question('', (password2) => {
      process.stdout.write('\n\n');
      rl.close();
      if (password1 === password2) {
        const request = new CreateNodeRequest();
        request.setPassword(password1);
        loadXudInitClient(argv).createNode(request, callback(argv, formatOutput));
      } else {
        console.log('Passwords do not match, please try again');
      }
    });
  });
};
