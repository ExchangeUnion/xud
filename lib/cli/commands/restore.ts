import { promises as fs } from 'fs';
import { join } from 'path';
import readline from 'readline';
import { Arguments } from 'yargs';
import { getDefaultBackupDir } from '../../utils/utils';
import { RestoreNodeRequest, RestoreNodeResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudInitClient } from '../command';
import { getDefaultCertPath, waitForCert } from '../utils';

export const command = 'restore [backup_directory]';

export const describe = 'restore an xud instance from seed';

export const builder = {
  backup_directory: {
    description: `The directory to which backups were written,
uses the default directory if unspecified`,
    type: 'string',
  },
};

const exitWithError = (message: string) => {
  console.error(message);
  process.exit(1);
};

const formatOutput = (response: RestoreNodeResponse.AsObject) => {
  let walletRestoredMessage = 'The following wallets were restored: ';

  if (response.restoredLndsList.length) {
    walletRestoredMessage += response.restoredLndsList.join(', ') + (response.restoredConnext ? ', ETH' : '');
  } else if (response.restoredConnext) {
    walletRestoredMessage += 'ETH';
  }

  console.log(walletRestoredMessage);
};

export const handler = async (argv: Arguments<any>) => {
  const request = new RestoreNodeRequest();

  const readDbBackupPromises: Promise<void>[] = [];
  let backupDir: string;
  if (argv.backup_directory) {
    try {
      const x = await fs.stat(argv.backup_directory);
      if (!x.isDirectory()) {
        exitWithError(`${argv.backup_directory} is not a directory`);
        return;
      }
      backupDir = argv.backup_directory;
    } catch (err) {
      exitWithError(`could not read from ${argv.backup_directory}`);
      return;
    }
  } else {
    backupDir = getDefaultBackupDir();
  }

  try {
    await fs.access(backupDir);

    // we must load backup files from disk before sending the restore request
    const backupDirectory = await fs.readdir(backupDir);
    backupDirectory.forEach((filename) => {
      readDbBackupPromises.push(
        fs.readFile(join(backupDir, filename)).then((fileContent) => {
          if (filename.startsWith('lnd-')) {
            request.getLndBackupsMap().set(filename.substr(4), fileContent);
          } else if (filename === 'xud') {
            request.setXudDatabase(fileContent);
          }
        }),
      );
    });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      exitWithError(err.message);
      return;
    }
  }

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
      exitWithError('Mnemonic must be exactly 24 words');
      return;
    }
    process.stdout.write('Enter a password: ');
    rlQuiet.question('', (password1) => {
      process.stdout.write('\nRe-enter password: ');
      rlQuiet.question('', async (password2) => {
        process.stdout.write('\n\n');
        rlQuiet.close();
        if (password1 === password2) {
          if (password1.length < 8) {
            exitWithError('Password must be at least 8 characters');
            return;
          }

          request.setPassword(password1);
          request.setSeedMnemonicList(mnemonic);

          // we must wait for any db backup files to have been read and set on the request
          await Promise.all(readDbBackupPromises);

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
            client.restoreNode(request, callback(argv, formatOutput));
          });
        } else {
          exitWithError('Passwords do not match, please try again');
        }
      });
    });
  });
};
