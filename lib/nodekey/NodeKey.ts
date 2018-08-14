import CryptoJS from 'crypto-js';
import { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';
import fs from 'fs';

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

  /**
   * Generate a random NodeKey.
   */
  private static generate = (): NodeKey => {
    let privKey: Buffer;
    do {
      privKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    return new NodeKey(privKey);
  }

  /**
   * Load a NodeKey from a file.
   * @param path the path to the file
   * @param password an optional password to decrypt the file
   * @returns a NodeKey if a file containing a valid ECDSA private key exists at the given path
   */
  private static fromFile = (path: string, password?: string): NodeKey => {
    let buf: Buffer;
    if (password) {
      const encryptedString: string = fs.readFileSync(path, 'utf8');
      const decryptedString: string = CryptoJS.AES.decrypt(encryptedString, password).toString(CryptoJS.enc.Hex);
      buf = Buffer.from(decryptedString, 'hex');
    } else {
      buf = fs.readFileSync(path);
    }

    if (secp256k1.privateKeyVerify(buf)) {
      return new NodeKey(buf);
    } else {
      throw new Error(`${path} does not contain a valid ECDSA private key`);
    }
  }

  /**
   * Load a node key from a file or create one if none exists. See [[fromFile]] and [[generate]].
   */
  public static load = (xudir: string, instanceId: number): NodeKey => {
    let keypath: string;
    if (instanceId > 0) {
      keypath = `${xudir}/nodekey_${instanceId}.dat`;
    } else {
      keypath = `${xudir}/nodekey.dat`;
    }
    let nodeKey: NodeKey;
    if (fs.existsSync(keypath)) {
      nodeKey = NodeKey.fromFile(keypath);
    } else {
      nodeKey = NodeKey.generate();
      nodeKey.toFile(keypath);
    }
    return nodeKey;
  }

  /**
   * Sign a message with the private key.
   * @param msg the data to sign
   * @returns the signature
   */
  public sign = (msg: Buffer): Buffer => {
    return secp256k1.sign(msg, this.privKey).signature;
  }

  /**
   * Save the private key to a file, optionally encrypted by a password.
   * @param path the path at which to save the file
   * @param password an optional password parameter for encrypting the private key
   */
  private toFile = (path: string, password?: string): void => {
    let buf: Buffer | CryptoJS.WordArray;
    if (password) {
      const lwa = CryptoJS.lib.WordArray.create(this.privKey.buffer);
      buf = CryptoJS.AES.encrypt(lwa, password);
    } else {
      buf = this.privKey;
    }
    fs.writeFileSync(path, buf);
  }
}

export default NodeKey;
