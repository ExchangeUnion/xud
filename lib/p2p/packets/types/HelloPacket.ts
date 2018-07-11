import Packet, { MessageType } from '../Packet';
import PacketType from '../PacketType';

type HelloPacketBody = {
  version: string;
  nodeKey: string;
  listenPort: number;
  pairs: string[];
};

class HelloPacket extends Packet {
  public type: PacketType = PacketType.HELLO;
  public messageType: MessageType = MessageType.UNILATERAL;
  public body!: HelloPacketBody;

  public init(args: HelloPacketBody): HelloPacket {
    this.body = args;
    this.header = this.createHeader();
    return this;
  }
}

export default HelloPacket;
