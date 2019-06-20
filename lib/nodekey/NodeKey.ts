import secp256k1 from 'secp256k1';
import { randomBytes } from '../utils/utils';
import { promises as fs } from 'fs';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';

/**
 * A class representing an ECDSA public/private key pair that identifies an XU node on the network
 * and can sign messages to prove their veracity.
 */
class NodeKey {
  /**
   * The public key in hex string format.
   */
  public readonly pubKey: string;

  private static ENCRYPTION_IV_LENGTH = 16;

  constructor(public readonly privKey: Buffer) {
    const pubKey = secp256k1.publicKeyCreate(privKey);
    this.pubKey = pubKey.toString('hex');
  }

  /**
   * Generates a random NodeKey.
   */
  public static generate = async (): Promise<NodeKey> => {
    let privKey: Buffer;
    do {
      privKey = await randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    return new NodeKey(privKey);
  }

  private static getCipherKey = (password: string) => {
    return createHash('sha256').update(password).digest();
  }

  /**
   * Load a NodeKey from a file.
   * @param path the path to the file
   * @param password an optional password to decrypt the file
   * @returns a NodeKey if a file containing a valid ECDSA private key exists at the given path
   */
  public static fromFile = async (path: string, password?: string): Promise<NodeKey> => {
    let privKey: Buffer;
    const fileBuffer = await fs.readFile(path);

    if (password) {
      // decrypt file using the password
      // the first 16 bytes contain the initialization vector
      const iv = fileBuffer.slice(0, NodeKey.ENCRYPTION_IV_LENGTH);
      const key = NodeKey.getCipherKey(password);
      const encrypted = fileBuffer.slice(NodeKey.ENCRYPTION_IV_LENGTH);
      const decipher = createDecipheriv('aes-256-cbc', key, iv);
      privKey = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    } else {
      privKey = fileBuffer;
    }
    if (secp256k1.privateKeyVerify(privKey)) {
      return new NodeKey(privKey);
    } else {
      throw new Error(`${path} does not contain a valid ECDSA private key`);
    }
  }

  /**
   * Loads a node key from a file or creates one if none exists. See [[fromFile]] and [[generate]].
   */
  public static load = async (path: string): Promise<NodeKey> => {
    let nodeKey: NodeKey;
    try {
      nodeKey = await NodeKey.fromFile(path);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // node key file does not exist, so create one
        nodeKey = await NodeKey.generate();
        await nodeKey.toFile(path);
      } else {
        throw err;
      }
    }
    return nodeKey;
  }

  public static getPath = (xudir: string, instanceId = 0) => {
    return instanceId > 0
      ? `${xudir}/nodekey_${instanceId}.dat`
      : `${xudir}/nodekey.dat`;
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
  public toFile = async (path: string, password?: string): Promise<void> => {
    let buf: Buffer | CryptoJS.WordArray;
    if (password) {
      const iv = await randomBytes(NodeKey.ENCRYPTION_IV_LENGTH);
      const key = NodeKey.getCipherKey(password);
      const cipher = createCipheriv('aes-256-cbc', key, iv);
      buf = Buffer.concat([iv, cipher.update(this.privKey), cipher.final()]);
    } else {
      buf = this.privKey;
    }
    await fs.writeFile(path, buf);
  }
}

export default NodeKey;
