import PacketType from './PacketType';
import CryptoJS from 'crypto-js';
import MD5 from 'crypto-js/md5';
import uuidv1 from 'uuid/v1';
import stringify from 'json-stable-stringify';

type PacketHeader = {
  /** An identifer for the packet which must be unique for a given socket. */
  id: string;
  /** The id of the received packet to which this packet is responding. */
  reqId?: string;
  type?: PacketType;
  /** The Base64 encoded MD5 hash of the body of the packet, to be used for error checking. */
  hash?: string;
};

interface PacketInterface {
  body?: any;
  header: PacketHeader;
}

function isPacketInterface(obj: any): obj is PacketInterface {
  if (obj) {
    const header = (<PacketInterface>obj).header;
    return header !== undefined && typeof header.id === 'string';
  }
  return false;
}

function isPacket(obj: any): obj is Packet {
  const p = (<Packet>obj);
  return (
    p.toRaw !== undefined  && typeof p.toRaw === 'function'
    && p.serialize !== undefined && typeof p.serialize === 'function'
    && p.type !== undefined && typeof p.type === 'number'
    && p.direction !== undefined && typeof p.direction === 'number'
  );
}

enum PacketDirection {
  /** A packet that is pushed to a peer without expecting any response. */
  Unilateral,
  /** A packet requesting a response. */
  Request,
  /** A packet that is sent in response to an incoming packet. */
  Response,
}

abstract class Packet<T = any> implements PacketInterface {
  public abstract get type(): PacketType;
  public abstract get direction(): PacketDirection;
  public body?: T;
  public header: PacketHeader;

  /**
   * Create a packet from a deserialized packet message.
   * @param packet a deserialized object containing a packet header and optional body
   */
  constructor(packet: PacketInterface);

  /**
   * Create a packet from a packet body.
   * @param reqId the id of the requesting packet to set on the header if this packet is a response
   */
  constructor(body?: T, reqId?: string);

  constructor(bodyOrPacket?: T | PacketInterface, reqId?: string) {
    if (isPacketInterface(bodyOrPacket)) {
      // we are constructing the deserialized packet
      this.header = bodyOrPacket.header;

      if (bodyOrPacket.body) {
        this.body = bodyOrPacket.body;
      }
    } else {
      // we are constructing a new outgoing packet from a body
      this.header = { id: uuidv1() };

      if (reqId) {
        this.header.reqId = reqId;
      }

      if (bodyOrPacket) {
        this.body = bodyOrPacket;
        this.header.hash = this.hash(bodyOrPacket);
      }
    }
  }
  public abstract serialize(): Uint8Array;

  private hash(value: any): string {
    return MD5(stringify(value)).toString(CryptoJS.enc.Base64);
  }

  /**
   * Verify the header hash against the packet body.
   */
  public verifyDataIntegrity(): boolean {
    if (!this.body) {
      return true;
    }

    if (!this.header.hash) {
      return false;
    }

    return this.header.hash === this.hash(this.body);
  }

  /**
   * Serialize this packet to binary Buffer.
   * @returns Buffer representation of the packet
   */
  public toRaw(): Buffer {
    const msg = this.serialize();

    const type = Buffer.alloc(1);
    type.writeUInt8(this.type, 0, true);

    const size = Buffer.allocUnsafe(4);
    size.writeUInt32LE(msg.length, 0, true);

    return Buffer.concat([type, size, Buffer.from(msg.buffer as ArrayBuffer)]);
  }
}

export default Packet;
export { PacketHeader, PacketDirection, PacketInterface, isPacket };
