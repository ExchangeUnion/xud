import assert from 'assert';
import { exec as childProcessExec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const seedutilPath = path.join(__dirname, '..', '..', 'seedutil', 'seedutil');

/** A promisified wrapped for the NodeJS `child_process.exec` method. */
const exec = promisify(childProcessExec);

/**
 * Executes the seedutil tool to generate an ethereum keystore from the given
 * mnemonic and password at the specified path.
 * @param mnemonic the 24 seed recovery mnemonic
 * @param password the password to protect the keystore
 * @param pathVal the path in which to create the keystore directory
 */
async function keystore(mnemonic: string[], password: string, pathVal: string) {
  const { stdout, stderr } = await exec(
    `${seedutilPath} keystore -pass=${password} -path=${pathVal} ${mnemonic.join(' ')}`,
  );

  if (stderr) {
    throw new Error(stderr);
  }

  if (!stdout.includes('Keystore created')) {
    throw new Error(stdout);
  }
}

/**
 * Executes the seedutil tool to encipher a deciphered seed hex string into a mnemonic
 * @param decipheredSeedHex the deciphered seed in hex format
 */
async function encipher(decipheredSeedHex: string) {
  const { stdout, stderr } = await exec(`${seedutilPath} encipher ${decipheredSeedHex}`);

  if (stderr) {
    throw new Error(stderr);
  }

  const mnemonic = stdout.trim().split(' ');
  assert.equal(mnemonic.length, 24, 'seedutil did not encipher mnemonic of exactly 24 words');
  return mnemonic;
}

async function decipher(mnemonic: string[]) {
  const { stdout, stderr } = await exec(`${seedutilPath} decipher ${mnemonic.join(' ')}`);

  if (stderr) {
    throw new Error(stderr);
  }

  const decipheredSeed = stdout.trim();
  return Buffer.from(decipheredSeed, 'hex');
}

async function deriveChild(mnemonic: string[], clientType: string) {
  const { stdout, stderr } = await exec(`${seedutilPath} derivechild -client ${clientType} ${mnemonic.join(' ')}`);

  if (stderr) {
    throw new Error(stderr);
  }

  const childMnenomic = stdout.trim().split(' ');
  assert.equal(childMnenomic.length, 24, 'seedutil did not derive child mnemonic of exactly 24 words');
  return childMnenomic;
}

async function generate() {
  const { stdout, stderr } = await exec(`${seedutilPath} generate`);

  if (stderr) {
    throw new Error(stderr);
  }

  const mnemonic = stdout.trim().split(' ');
  assert.equal(mnemonic.length, 24, 'seedutil did not generate mnemonic of exactly 24 words');
  return mnemonic;
}

export { keystore, encipher, decipher, deriveChild, generate };
