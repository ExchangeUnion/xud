import { exec as childProcessExec } from 'child_process';
import { promisify } from 'util';

/** A promisified wrapped for the NodeJS `child_process.exec` method. */
const exec = promisify(childProcessExec);

/**
 * Attempts to execute the seedutil tool which will generate an ethereum keystore
 * according to a given mnemonic and password at the specified path
 * @param mnemonic the 24 seed recovery mnemonic
 * @param password the password to protect the keystore
 * @param path the path in which to create the keystore directory
 */
const seedutil = async (mnemonic: string[], password: string, path: string) => {
  const { stdout, stderr } = await exec(`./seedutil/seedutil -pass=${password} -path=${path} ${mnemonic.join(' ')}`);

  if (stderr) {
    throw new Error(stderr);
  }

  if (!stdout.includes('Keystore created')) {
    throw new Error(stdout);
  }
};

export default seedutil;
