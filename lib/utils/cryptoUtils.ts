import { createCipheriv, createDecipheriv, createHash, randomBytes as cryptoRandomBytes } from 'crypto';
import { promisify } from 'util';

const ENCRYPTION_IV_LENGTH = 16;

/** A promisified wrapper for the NodeJS `crypto.randomBytes` method. */
export const randomBytes = promisify(cryptoRandomBytes);

function getCipherKey(password: string) {
  return createHash('sha256').update(password).digest();
}

/**
 * Encrypts a Buffer or base64 string using a password
 * @param payload a Buffer or base64 string
 * @returns an encrypted Buffer
 */
export async function encrypt(payload: Buffer | string, password: string) {
  const buf = typeof payload === 'string' ? Buffer.from(payload, 'utf8') : payload;

  const iv = await randomBytes(ENCRYPTION_IV_LENGTH);
  const key = getCipherKey(password);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([iv, cipher.update(buf), cipher.final()]);
}

/**
 * Decrypts a Buffer or base64 string using a password
 * @param payload a Buffer or base64 string
 * @returns a decrypted Buffer
 */
export function decrypt(payload: Buffer | string, password: string) {
  const buf = typeof payload === 'string' ? Buffer.from(payload, 'base64') : payload;

  // the first 16 bytes contain the initialization vector
  const iv = buf.slice(0, ENCRYPTION_IV_LENGTH);
  const key = getCipherKey(password);
  const encrypted = buf.slice(ENCRYPTION_IV_LENGTH);
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

/** Returns a random payment preimage and hash in hex encoding. */
export async function generatePreimageAndHash() {
  const bytes = await randomBytes(32);
  const rPreimage = bytes.toString('hex');
  const rHash = createHash('sha256').update(bytes).digest('hex');
  return { rPreimage, rHash };
}
