import CryptoJS from 'crypto-js';
import secp256k1 from 'secp256k1';
import { randomBytes } from '../utils/utils';
import { exists, readFile, writeFile } from '../utils/fsUtils';

/**
 * A class representing an ECDSA public/private key pair that identifies an XU node on the network
 * and can sign messages to prove their veracity.
 */
class NodeKey {
  private pubKeyStr: string;

  constructor(private privKey: Buffer) {
    const pubKey = secp256k1.publicKeyCreate(privKey);
    this.pubKeyStr = pubKey.toString('hex');
  }

  public get nodePubKey(): string {
    return this.pubKeyStr;
  }

  public get nodePrivKey(): Buffer {
    return this.privKey;
  }

  /**
   * Generates a random NodeKey.
   */
  private static generate = async (): Promise<NodeKey> => {
    let privKey: Buffer;
    do {
      privKey = await randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    return new NodeKey(privKey);
  }

  /**
   * Load a NodeKey from a file.
   * @param path the path to the file
   * @param password an optional password to decrypt the file
   * @returns a NodeKey if a file containing a valid ECDSA private key exists at the given path
   */
  private static fromFile = (path: string, password?: string): Promise<NodeKey> => {
    return new Promise(async (resolve, reject) => {
      let buf = await readFile(path);

      if (password) {
        const encryptedString = buf.toString('utf8');
        const decryptedString = CryptoJS.AES.decrypt(encryptedString, password).toString(CryptoJS.enc.Hex);
        buf = Buffer.from(decryptedString, 'hex');
      }

      if (secp256k1.privateKeyVerify(buf)) {
        resolve(new NodeKey(buf));
      } else {
        reject(new Error(`${path} does not contain a valid ECDSA private key`));
      }
    });
  }

  /**
   * Loads a node key from a file or create one if none exists. See [[fromFile]] and [[generate]].
   */
  public static load = async (xudir: string, instanceId = 0): Promise<NodeKey> => {
    const path: string = instanceId > 0
      ? `${xudir}/nodekey_${instanceId}.dat`
      : `${xudir}/nodekey.dat`;

    let nodeKey: NodeKey;
    if (await exists(path)) {
      nodeKey = await NodeKey.fromFile(path);
    } else {
      nodeKey = await NodeKey.generate();
      await nodeKey.toFile(path);
    }
    return nodeKey;
  }

  /**
   * Signs a message with the private key.
   * @param msg the data to sign
   * @returns the signature
   */
  public sign = (msg: Buffer): Buffer => {
    return secp256k1.sign(msg, this.privKey).signature;
  }

  /**
   * Saves the private key to a file, optionally encrypted by a password.
   * @param path the path at which to save the file
   * @param password an optional password parameter for encrypting the private key
   */
  private toFile = (path: string, password?: string): Promise<void> => {
    let buf: Buffer | CryptoJS.WordArray;
    if (password) {
      const lwa = CryptoJS.lib.WordArray.create(this.privKey.buffer);
      buf = CryptoJS.AES.encrypt(lwa, password);
    } else {
      buf = this.privKey;
    }
    return writeFile(path, buf);
  }
}

export default NodeKey;
