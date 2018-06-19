import Packet from './Packet';
import PacketType from './PacketType';

type PongPacketBody = {
  id: string;
};

class PongPacket extends Packet {
  public type: PacketType = PacketType.PONG;
  public responseType?: PacketType = undefined;
  public responseTimeout?: number = undefined;

  constructor(public body: PongPacketBody) {
    super();
  }

  public static fromRaw(body: string): PongPacket {
    const bodyObject = JSON.parse(body);
    return new PongPacket(bodyObject);
  }

  public toRaw(): string {
    return JSON.stringify(this.body);
  }
}

export default PongPacket;
