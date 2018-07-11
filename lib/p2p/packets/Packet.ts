import PacketType from './PacketType';
import CryptoJS from 'crypto-js';
import MD5 from 'crypto-js/md5';

type PacketHeader = {
  hash: string;
  reqHash?: string;
};

enum MessageType {
  UNILATERAL,
  REQUEST,
  RESPONSE,
}

abstract class Packet {
  public header!: PacketHeader;
  public abstract type: PacketType;
  public abstract messageType: MessageType;
  public abstract body: any;

  public fromRaw(raw: string): Packet {
    const { header, body } = JSON.parse(raw);
    this.body = body;
    this.header = header;
    return this;
  }

  public toRaw(): string {
    const { header, body } = this;
    return JSON.stringify({ header, body });
  }

  public createHeader(reqHash?: string): PacketHeader {
    return {
      reqHash,
      hash: MD5(JSON.stringify(this.body)).toString(CryptoJS.enc.Base64),
    };
  }
}

export default Packet;
export { PacketHeader, MessageType };
