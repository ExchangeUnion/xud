import Packet, { PacketHeader, MessageType } from '../Packet';
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

  constructor(public body: HelloPacketBody, header?: PacketHeader) {
    super(body, header);
  }

  public static fromRaw(packet: string): HelloPacket {
    const { header, body } = JSON.parse(packet);
    return new HelloPacket(body, header);
  }
}

export default HelloPacket;
