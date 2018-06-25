import Packet from './Packet';
import PacketType from './PacketType';

type HelloPacketBody = {
  version: string;
  nodeKey: string;
  listenPort: number;
  pairs: string[];
};

class HelloPacket extends Packet {
  public type: PacketType = PacketType.HELLO;
  public responseType: PacketType = PacketType.HELLO;
  public responseTimeout: number = 10000;

  constructor(public body: HelloPacketBody) {
    super();
  }

  public static fromRaw(body: string): HelloPacket {
    const bodyObject = JSON.parse(body);
    return new HelloPacket(bodyObject);
  }

  public toRaw(): string {
    return JSON.stringify(this.body);
  }
}

export default HelloPacket;
