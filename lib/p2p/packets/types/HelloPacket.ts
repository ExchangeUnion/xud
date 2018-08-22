import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { HandshakeState } from '../../../types/p2p';

class HelloPacket extends Packet<HandshakeState> {
  public get type() {
    return PacketType.HELLO;
  }

  public get direction() {
    return PacketDirection.UNILATERAL;
  }
}

export default HelloPacket;
