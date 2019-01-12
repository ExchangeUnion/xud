import assert from 'assert';
import crypto from 'crypto';
import Network from './Network';
import Packet from './packets/Packet';

type WireMsgHeader = {
  magic: number,
  type: number,
  length: number,
  checksum: number,
};

type WireMsg = {
  header: WireMsgHeader,
  packet: Buffer;
};

/** Wire protocol msg framer */
class Framer {
  public static readonly MSG_HEADER_LENGTH = 16;
  public static readonly ENCRYPTED_MSG_HEADER_LENGTH = 4;
  public static readonly ENCRYPTION_KEY_LENGTH = 32;
  public static readonly ENCRYPTION_IV_LENGTH = 16;

  constructor(private network: Network) {
  }

  /**
   * Frame a packet with a header to be used as a wire msg
   */
  public frame = (packet: Packet, encryptionKey?: Buffer): Buffer => {
    const payload = packet.toRaw();
    const msg = Buffer.allocUnsafe(Framer.MSG_HEADER_LENGTH + payload.length);

    // network magic value
    msg.writeUInt32LE(this.network.magic, 0, true);

    // length
    msg.writeUInt32LE(payload.length, 4, true);

    // type
    msg.writeUInt32LE(packet.type, 8, true);

    // checksum
    const checksum = packet.checksum();
    checksum.copy(msg, 12, 0, 4);

    // payload
    payload.copy(msg, 16);

    if (!encryptionKey) {
      return msg;
    }

    const ciphertext = this.encrypt(msg, encryptionKey);
    const encryptedMsg = Buffer.allocUnsafe(Framer.ENCRYPTED_MSG_HEADER_LENGTH + ciphertext.length);

    // length
    encryptedMsg.writeUInt32LE(ciphertext.length, 0, true);

    // ciphertext
    ciphertext.copy(encryptedMsg, 4);

    return encryptedMsg;
  }

  /**
   * Unframe a wire msg or an encrypted wire msg
   */
  public unframe = (data: Buffer, encryptionKey?: Buffer): WireMsg => {
    let msg;
    if (!encryptionKey) {
      msg = data;
    } else {
      const length = data.readUInt32LE(0, true);
      const ciphertext = data.slice(4);

      if (length !== ciphertext.length) {
        throw new Error('invalid ciphertext length');
      }

      msg = this.decrypt(ciphertext, encryptionKey);
    }

    const header = this.parseHeader(msg);
    const packet = msg.slice(Framer.MSG_HEADER_LENGTH);

    if (header.length !== packet.length) {
      throw new Error('invalid packet length');
    }

    return { header, packet };
  }

  /**
   * Parse the length of a wire msg or an encrypted wire msg
   */
  public parseLength = (data: Buffer, encrypted: boolean): number => {
    const value = data.readUInt32LE(0, true);

    if (encrypted) {
      if (value === this.network.magic) {
        throw new Error('not encrypted');
      }
      return value;
    }

    if (value !== this.network.magic) {
      throw new Error('invalid magic network value. msg might be encrypted');
    }

    return data.readUInt32LE(4, true);
  }

  /**
   * Parse the header of a wire msg
   */
  public parseHeader = (msg: Buffer): WireMsgHeader => {
    if (msg.length < Framer.MSG_HEADER_LENGTH) {
      throw new Error(`invalid msg header length: data is missing`);
    }

    // network magic value
    const magic = msg.readUInt32LE(0, true);

    // length
    const length = msg.readUInt32LE(4, true);

    // type
    const type = msg.readUInt32LE(8, true);

    // checksum
    const checksum = msg.readUInt32LE(12, true);

    return { magic, type, length, checksum };
  }

  public encrypt = (plaintext: Buffer, key: Buffer): Buffer => {
    const iv = crypto.randomBytes(Framer.ENCRYPTION_IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    return Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);
  }

  public decrypt = (ciphertext: Buffer, key: Buffer): Buffer => {
    const iv = ciphertext.slice(0, Framer.ENCRYPTION_IV_LENGTH);
    const encrypted = ciphertext.slice(Framer.ENCRYPTION_IV_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}

export default Framer;
export { WireMsgHeader };
