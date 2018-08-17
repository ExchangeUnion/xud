import PacketType from './PacketType';
import CryptoJS from 'crypto-js';
import MD5 from 'crypto-js/md5';
import uuidv1 from 'uuid/v1';

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

enum PacketDirection {
  /** A packet that is pushed to a peer without expecting any response. */
  UNILATERAL,
  /** A packet requesting a response. */
  REQUEST,
  /** A packet that is sent in response to an incoming packet. */
  RESPONSE,
}

abstract class Packet<T = any> implements PacketInterface {
  public abstract get type(): PacketType;
  public abstract get direction(): PacketDirection;
  public body?: T;
  public header: PacketHeader;
  /** Wire protocol delimiter. */
  public static PROTOCOL_DELIMITER = 'ↂ₿ↂ';

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
      // we are deserializing a received packet from a raw JSON string
      delete bodyOrPacket.header.type; // deleting type from header because it's being used only for the wire protocol
      this.header = bodyOrPacket.header;

      if (bodyOrPacket.body) {
        this.body = bodyOrPacket.body;
      }
    } else {
      // we are creating a new outgoing packet from a body
      this.header = { id: uuidv1() };

      if (reqId) {
        this.header.reqId = reqId;
      }

      if (bodyOrPacket) {
        this.body = bodyOrPacket;
        this.header.hash = MD5(JSON.stringify(bodyOrPacket)).toString(CryptoJS.enc.Base64);
      }
    }
  }

  /**
   * Serialize this packet to JSON.
   * @returns JSON string representing the packet
   */
  public toRaw(): string {
    const { body } = this;
    // explicitly set the type on the header before serializing
    const header: PacketHeader = { ...this.header, type: this.type };
    return body ? JSON.stringify({ header, body }) : JSON.stringify({ header });
  }
}

export default Packet;
export { PacketHeader, PacketDirection, PacketInterface };
