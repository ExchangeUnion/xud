import Packet from './Packet';
import PacketType from './PacketType';

type PingPacketBody = {
  id: string;
};

class PingPacker extends Packet {
  public type: PacketType = PacketType.PING;
  public responseType = PacketType.PONG;
  public responseTimeout = 10000;

  constructor(public body: PingPacketBody) {
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
