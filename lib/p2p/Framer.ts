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
  private encryptionEnabled = false;
  private encryptionKey?: Buffer;

  constructor(private network: Network) {
  }

  public setEncrypted = (val: boolean) => {
    this.encryptionEnabled = val;
  }

  public setEncryptionKey = (key: Buffer): void => {
    this.encryptionKey = key;
  }

  /**
   * Frame a packet with a header to be used as a wire msg
   */
  public frame = (packet: Packet): Buffer => {
    const payload = packet.toRaw();
    let msg = Buffer.allocUnsafe(16 + payload.length);

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

    if (this.encryptionEnabled) {
      assert(this.encryptionKey);

      msg = this.encrypt(msg);
    }

    return msg;
  }

  /**
   * Unframe a wire msg or an encrypted wire msg
   */
  public unframe = (data: Buffer): WireMsg => {
    let msg;
    if (!this.encryptionEnabled) {
      msg = data;
    } else {
      assert(this.encryptionKey);
      const length = data.readUInt32LE(0, true);
      const ciphertext = data.slice(4);

      if (length !== ciphertext.length) {
        throw new Error('invalid ciphertext length');
      }

      msg = this.decrypt(ciphertext);
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
  public parseLength = (data: Buffer): number => {
    const value = data.readUInt32LE(0, true);

    if (this.encryptionEnabled) {
      if (value === this.network.magic) {
        throw new Error('not encrypted');
      }
      return value;
    }

    if (value !== this.network.magic) {
      throw new Error('invalid magic network value');
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

  public encrypt = (plaintext: Buffer): Buffer => {
    assert(this.encryptionEnabled && this.encryptionKey);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    const encrypted = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

    const length = Buffer.allocUnsafe(4);
    length.writeUInt32LE(encrypted.length, 0, true);

    return Buffer.concat([length, encrypted]);
  }

  public decrypt = (ciphertext: Buffer): Buffer => {
    const iv = ciphertext.slice(0, 16);
    const encrypted = ciphertext.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}

export default Framer;
export { WireMsgHeader };
