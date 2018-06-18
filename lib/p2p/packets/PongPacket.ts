import Packet from './Packet';
import PacketType from './PacketType';

type PongPacketBody = {
  id: string;
};

class PingPacker extends Packet {
  public type: PacketType = PacketType.PONG;
  public responseType = undefined;
  public responseTimeout = undefined;

  constructor(public body: PongPacketBody) {
    super();
  }

  public static fromRaw(body: string): PingPacker {
    const bodyObject = JSON.parse(body);
    return new PingPacker(bodyObject);
  }

  public toRaw(): string {
    return JSON.stringify(this.body);
  }
}

export default PingPacker;
