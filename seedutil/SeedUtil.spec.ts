import { exec } from 'child_process';
import { promises as fs, existsSync } from 'fs';

const executeCommand = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      } else {
        if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      }
    });
  });
};

const deleteDir = async (path: string) => {
  try {
    if (existsSync(path)) {
      // delete all the files first because
      // fs.rmdir is non-recursive
      const files = await fs.readdir(path);
      const deletePromises: Promise<void>[] = [];
      files.forEach((file) => {
        deletePromises.push(fs.unlink(`${path}/${file}`));
      });
      await Promise.all(deletePromises);
      // delete directory
      await fs.rmdir(path);
    }
  } catch (e) {
    throw new Error(`unable to clear keystore folder: ${e}`);
  }
};

const SUCCESS_KEYSTORE_CREATED = 'Keystore created';
const ERRORS = {
  INVALID_MNEMONIC_LENGTH: 'expecting 24-word mnemonic seed separated by a space',
  INVALID_SEED_OR_PASSWORD: 'invalid seed or password',
  KEYSTORE_FILE_ALREADY_EXISTS: 'account already exists',
};

const VALID_SEED = {
  seedPassword: 'mysecretpassword',
  seedWords: [
    'abstract', 'gossip', 'rubber', 'wool', 'trash', 'wisdom',
    'home', 'grass', 'prepare', 'frequent', 'diary', 'police',
    'direct', 'cheap', 'exhibit', 'box', 'lens', 'absorb',
    'speak', 'admit', 'pyramid', 'transfer', 'define', 'antenna',
  ],
  ethAddress: '23ccdcd149bd433d64987ffebbc88ac909842303',
};

const DEFAULT_KEYSTORE_PATH = `${process.cwd()}/seedutil/keystore`;

describe('SeedUtil', () => {
  beforeEach(async () => {
    await deleteDir(DEFAULT_KEYSTORE_PATH);
  });

  test('it errors with no arguments', async () => {
    await expect(executeCommand('./seedutil/seedutil'))
      .rejects.toThrow(ERRORS.INVALID_MNEMONIC_LENGTH);
  });

  test('it errors with 23 words', async () => {
    const cmd = `./seedutil/seedutil ${VALID_SEED.seedWords.slice(0, 22).join(' ')}`;
    await expect(executeCommand(cmd))
      .rejects.toThrow(ERRORS.INVALID_MNEMONIC_LENGTH);
  });

  test('it errors with 24 words and invalid password', async () => {
    const cmd = `./seedutil/seedutil ${VALID_SEED.seedWords.join(' ')}`;
    await expect(executeCommand(cmd))
      .rejects.toThrow(ERRORS.INVALID_SEED_OR_PASSWORD);
  });

  test('it succeeds with 24 words, valid password', async () => {
    const cmd = `./seedutil/seedutil ${VALID_SEED.seedWords.join(' ')} ${VALID_SEED.seedPassword}`;
    await expect(executeCommand(cmd))
      .resolves.toMatch(SUCCESS_KEYSTORE_CREATED);
    // Read our keystore file
    const files = await fs.readdir(DEFAULT_KEYSTORE_PATH);
    expect(files.length).toEqual(1);
    const keyStorePath = `${DEFAULT_KEYSTORE_PATH}/${files[0]}`;
    const keyStoreObj = JSON.parse(await fs.readFile(keyStorePath, 'utf8'));
    // verify that the derived ETH address matches
    expect(keyStoreObj.address).toEqual(VALID_SEED.ethAddress);
    // running it again should cause it to fail
    // because keystore file already exists
    await expect(executeCommand(cmd))
      .rejects.toThrow(ERRORS.KEYSTORE_FILE_ALREADY_EXISTS);
  });

  test('it allows custom keystore save path', async () => {
    const CUSTOM_PATH = `${process.cwd()}/seedutil/custom`;
    const cmd = `./seedutil/seedutil ${VALID_SEED.seedWords.join(' ')} ${VALID_SEED.seedPassword} ${CUSTOM_PATH}`;
    await expect(executeCommand(cmd))
      .resolves.toMatch(SUCCESS_KEYSTORE_CREATED);
    // cleanup custom path
    await deleteDir(CUSTOM_PATH);
  });
});
