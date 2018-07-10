import PacketType from './PacketType';
import CryptoJS from 'crypto-js';
import SHA256 from 'crypto-js/sha256';

type PacketHeader = {
  hash?: string;
  reqHash?: string;
};

enum MessageType {
  UNILATERAL,
  REQUEST,
  RESPONSE,
}

abstract class Packet {
  public header: PacketHeader;
  public abstract type: PacketType;
  public abstract body: any;
  public abstract messageType: MessageType;

  constructor (body: any, header?: PacketHeader) {
    this.header = {
      hash: (header && header.hash) || SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Hex),
      ...header!,
    };
  }

  public toRaw(): string {
    const { header, body } = this;
    return JSON.stringify({ header, body });
  }
}

export default Packet;
export { PacketHeader, MessageType };
