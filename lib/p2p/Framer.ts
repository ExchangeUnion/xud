import assert from 'assert';
import { createCipheriv, createDecipheriv } from 'crypto';
import { magicValsXuNetwork } from '../constants/enums';
import { randomBytes } from '../utils/cryptoUtils';
import errors from './errors';
import Network from './Network';
import Packet from './packets/Packet';
import { calcChecksum } from './packets/utils';

type WireMsgHeader = {
  magic?: number;
  type: number;
  length: number;
  checksum?: number;
};

type WireMsg = {
  header: WireMsgHeader;
  packet: Buffer;
};

/** Wire protocol msg framer */
class Framer {
  public static readonly MSG_HEADER_LENGTH = 16;
  public static readonly ENCRYPTED_MSG_HEADER_LENGTH = 4;
  public static readonly ENCRYPTED_MSG_PAYLOAD_HEADER_LENGTH = 8;
  public static readonly ENCRYPTION_KEY_LENGTH = 32;
  public static readonly ENCRYPTION_IV_LENGTH = 16;

  constructor(private network: Network) {}

  /**
   * Frame a packet with a header to be used as a wire msg
   */
  public frame = async (packet: Packet, encryptionKey?: Buffer): Promise<Buffer> => {
    const packetRaw = packet.toRaw();

    if (encryptionKey) {
      const msg = Buffer.allocUnsafe(Framer.ENCRYPTED_MSG_PAYLOAD_HEADER_LENGTH + packetRaw.length);

      // length
      msg.writeUInt32LE(packetRaw.length, 0);

      // type
      msg.writeUInt32LE(packet.type, 4);

      // packet
      packetRaw.copy(msg, 8);

      const ciphertext = await this.encrypt(msg, encryptionKey);
      const encryptedMsg = Buffer.allocUnsafe(Framer.ENCRYPTED_MSG_HEADER_LENGTH + ciphertext.length);

      // length
      encryptedMsg.writeUInt32LE(ciphertext.length, 0);

      // ciphertext
      ciphertext.copy(encryptedMsg, 4);

      return encryptedMsg;
    } else {
      const msg = Buffer.allocUnsafe(Framer.MSG_HEADER_LENGTH + packetRaw.length);

      // network magic value
      msg.writeUInt32LE(this.network.magic, 0);

      // length
      msg.writeUInt32LE(packetRaw.length, 4);

      // type
      msg.writeUInt32LE(packet.type, 8);

      // checksum
      msg.writeUInt32LE(calcChecksum(packetRaw), 12);

      // payload
      packetRaw.copy(msg, 16);

      return msg;
    }
  };

  /**
   * Unframe a wire msg or an encrypted wire msg
   */
  public unframe = (msg: Buffer, encryptionKey?: Buffer): WireMsg => {
    let wireMsg: WireMsg;
    if (encryptionKey) {
      const length = msg.readUInt32LE(0);
      const ciphertext = msg.slice(Framer.ENCRYPTED_MSG_HEADER_LENGTH);

      if (length !== ciphertext.length) {
        throw errors.FRAMER_INVALID_MSG_LENGTH(length, ciphertext.length);
      }

      const decryptedMsg = this.decrypt(ciphertext, encryptionKey);

      wireMsg = {
        header: this.parseHeader(decryptedMsg, true),
        packet: decryptedMsg.slice(Framer.ENCRYPTED_MSG_PAYLOAD_HEADER_LENGTH),
      };
    } else {
      wireMsg = {
        header: this.parseHeader(msg, false),
        packet: msg.slice(Framer.MSG_HEADER_LENGTH),
      };
    }

    if (wireMsg.header.length !== wireMsg.packet.length) {
      throw errors.FRAMER_INVALID_MSG_LENGTH(wireMsg.header.length, wireMsg.packet.length);
    }

    return wireMsg;
  };

  /**
   * Parse the length of a wire msg or an encrypted wire msg
   */
  public parseLength = (data: Buffer, encrypted: boolean): number => {
    const value = data.readUInt32LE(0);

    if (encrypted) {
      if (value === this.network.magic) {
        throw errors.FRAMER_MSG_NOT_ENCRYPTED;
      }
      return value;
    }

    if (value !== this.network.magic) {
      const network = magicValsXuNetwork[value];
      if (network) {
        throw errors.FRAMER_INCOMPATIBLE_MSG_ORIGIN_NETWORK(this.network.xuNetwork, network);
      } else {
        throw errors.FRAMER_INVALID_NETWORK_MAGIC_VALUE;
      }
    }

    return data.readUInt32LE(4);
  };

  /**
   * Parse the header of a wire msg or an encrypted wire msg payload
   */
  public parseHeader = (msg: Buffer, encrypted: boolean): WireMsgHeader => {
    if (encrypted) {
      assert(msg.length >= Framer.ENCRYPTED_MSG_PAYLOAD_HEADER_LENGTH, 'invalid msg header length: data is missing');

      // length
      const length = msg.readUInt32LE(0);

      // type
      const type = msg.readUInt32LE(4);

      return { length, type };
    } else {
      assert(msg.length >= Framer.MSG_HEADER_LENGTH, 'invalid msg header length: data is missing');

      // network magic value
      const magic = msg.readUInt32LE(0);

      // length
      const length = msg.readUInt32LE(4);

      // type
      const type = msg.readUInt32LE(8);

      // checksum
      const checksum = msg.readUInt32LE(12);

      return { magic, type, length, checksum };
    }
  };

  public encrypt = async (plaintext: Buffer, key: Buffer): Promise<Buffer> => {
    const iv = await randomBytes(Framer.ENCRYPTION_IV_LENGTH);
    const cipher = createCipheriv('aes-256-cbc', key, iv);

    return Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);
  };

  public decrypt = (ciphertext: Buffer, key: Buffer): Buffer => {
    const iv = ciphertext.slice(0, Framer.ENCRYPTION_IV_LENGTH);
    const encrypted = ciphertext.slice(Framer.ENCRYPTION_IV_LENGTH);
    const decipher = createDecipheriv('aes-256-cbc', key, iv);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  };
}

export default Framer;
export { WireMsgHeader };
