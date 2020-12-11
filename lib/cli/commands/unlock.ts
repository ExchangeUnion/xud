import { Arguments } from 'yargs';
import readline from 'readline';
import { callback, loadXudInitClient } from '../command';
import { UnlockNodeRequest, UnlockNodeResponse } from '../../proto/xudrpc_pb';

export const command = 'unlock';

export const describe = 'unlock local xud node';

export const builder = {};

const formatOutput = (response: UnlockNodeResponse.AsObject) => {
  console.log('xud was unlocked successfully');
  if (response.unlockedLndsList.length) {
    console.log(`The following wallets were unlocked: ${response.unlockedLndsList.join(', ')}`);
  }
  if (response.lockedLndsList.length) {
    console.log(`The following wallets could not be unlocked: ${response.lockedLndsList.join(', ')}`);
  }
};

export const handler = (argv: Arguments) => {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
  });

  process.stdout.write('Enter master xud password: ');
  rl.question('', async (password) => {
    process.stdout.write('\n');
    rl.close();
    const request = new UnlockNodeRequest();
    request.setPassword(password);
    const client = await loadXudInitClient(argv);
    // wait up to 3 seconds for rpc server to listen before call in case xud was just started
    client.waitForReady(Date.now() + 3000, () => {
      client.unlockNode(request, callback(argv, formatOutput));
    });
  });
};
