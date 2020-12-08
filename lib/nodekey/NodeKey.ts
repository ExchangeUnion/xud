import { entropyToMnemonic } from 'bip39';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import secp256k1 from 'secp256k1';
import { SwapClientType } from '../constants/enums';
import { decrypt, encrypt, randomBytes } from '../utils/cryptoUtils';
import { encipher } from '../utils/seedutil';

/**
 * A class representing an ECDSA public/private key pair that identifies an XU node on the network
 * and can sign messages to prove their veracity.
 */
class NodeKey {
  public password?: string;

  /**
   * @param privKey The 32 byte private key
   * @param pubKey The public key in hex string format.
   */
  constructor(
    public readonly privKey: Buffer,
    public readonly pubKey: string,
    private readonly path: string,
  ) {}

  /**
   * Generates a random NodeKey.
   */
  public static generate = async (path?: string): Promise<NodeKey> => {
    let privKey: Buffer;
    do {
      privKey = await randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    return NodeKey.fromBytes(privKey, path);
  };

  /**
   * Converts a buffer of bytes to a NodeKey. Uses the first 32 bytes from the buffer to generate
   * the private key. If the buffer has fewer than 32 bytes, the buffer is right-padded with zeros.
   */
  public static fromBytes = (bytes: Buffer, path?: string): NodeKey => {
    let privKey: Buffer;
    if (bytes.byteLength === 32) {
      privKey = bytes;
    } else if (bytes.byteLength < 32) {
      privKey = Buffer.concat([bytes, Buffer.alloc(32 - bytes.byteLength)]);
    } else {
      privKey = bytes.slice(0, 32);
    }

    const pubKeyBytes = secp256k1.publicKeyCreate(privKey);
    const pubKey = pubKeyBytes.toString('hex');

    return new NodeKey(privKey, pubKey, path ?? '');
  };

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
      privKey = decrypt(fileBuffer, password);
    } else {
      privKey = fileBuffer;
    }
    if (secp256k1.privateKeyVerify(privKey)) {
      const nodeKey = NodeKey.fromBytes(privKey, path);
      nodeKey.password = password;
      return nodeKey;
    } else {
      throw new Error(`${path} does not contain a valid ECDSA private key`);
    }
  };

  public static getPath = (xudir: string, instanceId = 0) => {
    return instanceId > 0 ? `${xudir}/nodekey_${instanceId}.dat` : `${xudir}/nodekey.dat`;
  };

  /**
   * Signs a message with the private key.
   * @param msg the data to sign
   * @returns the signature
   */
  public sign = (msg: Buffer): Buffer => {
    return secp256k1.sign(msg, this.privKey).signature;
  };

  /**
   * Saves the private key to a file, optionally encrypted by a password.
   * @param path the path at which to save the file
   * @param password an optional password parameter for encrypting the private key
   */
  public toFile = async (password?: string): Promise<void> => {
    let buf: Buffer;
    if (password) {
      this.password = password;
      buf = await encrypt(this.privKey, password);
    } else {
      buf = this.privKey;
    }
    await fs.writeFile(this.path, buf);
  };

  /**
   * Derives a child mnemonic seed from the private key for the swap client.
   * @param swapClient the swap client to create the seed for
   * @returns a BIP39 mnemonic
   */
  public childSeed = (swapClient: SwapClientType) => {
    const privKeyHex = this.privKey.toString('hex');
    const childSeedEntropy = createHash('sha256').update(`${privKeyHex}-${swapClient}`).digest();
    return entropyToMnemonic(childSeedEntropy);
  };

  public getMnemonic = async () => {
    const decipheredSeed = this.privKey.slice(0, 19);
    const decipheredSeedHex = decipheredSeed.toString('hex');
    const seedMnemonic = await encipher(decipheredSeedHex);

    return seedMnemonic;
  };
}

export default NodeKey;
