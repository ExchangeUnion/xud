import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';

type HelloPacketBody = {
  version: string;
  nodePubKey: string;
  listenPort: number;
  pairs: string[];
};

class HelloPacket extends Packet<HelloPacketBody> {
  public get type() {
    return PacketType.HELLO;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default HelloPacket;
