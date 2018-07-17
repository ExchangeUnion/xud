import PacketType from './PacketType';
import CryptoJS from 'crypto-js';
import MD5 from 'crypto-js/md5';

type PacketHeader = {
  /** The Base64 encoded MD5 hash of the body of this packet. This is used for error checking and as a key to identify packets.*/
  hash: string;
  /** The hash of the body of the received packet which this packet is responding to. */
  reqHash?: string;
};

enum PacketDirection {
  /** A packet that is pushed to a peer without expecting any response. */
  UNILATERAL,
  /** A packet that is sent to a peer requesting a particular response. */
  REQUEST,
  /** A packet that is sent in response to an incoming packet. */
  RESPONSE,
}

abstract class Packet<T = any> {
  public abstract get type(): PacketType;
  public abstract get direction(): PacketDirection;
  public body: T;
  public header: PacketHeader;

  /**
   * Create a packet from a packet body or from a raw, serialized packet.
   * @param body
   * @param reqHash The requesting packet hash to set on the header if this packet is a response
   */
  constructor(body: T | string, reqHash?: string) {
    if (typeof body === 'string') {
      // we are deserializing a received packet from a raw JSON string
      const packet = JSON.parse(body);
      this.body = packet.body;
      this.header = packet.header;
    } else {
      // we are creating a new outgoing packet from a body
      this.body = body;
      this.header = {
        reqHash,
        hash: MD5(JSON.stringify(body)).toString(CryptoJS.enc.Base64),
      };
    }
  }

  /**
   * Serialize this packet to JSON
   */
  public toRaw(): string {
    const { header, body } = this;
    return JSON.stringify({ header, body });
  }
}

export default Packet;
export { PacketHeader, PacketDirection };
