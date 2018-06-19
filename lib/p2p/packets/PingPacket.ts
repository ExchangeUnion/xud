import Packet from './Packet';
import PacketType from './PacketType';

type PingPacketBody = {
  id: string;
};

class PingPacket extends Packet {
  public type: PacketType = PacketType.PING;
  public responseType: PacketType = PacketType.PONG;
  public responseTimeout: number = 10000;

  constructor(public body: PingPacketBody) {
    super();
  }

  public static fromRaw(body: string): PingPacket {
    const bodyObject = JSON.parse(body);
    return new PingPacket(bodyObject);
  }

  public toRaw(): string {
    return JSON.stringify(this.body);
  }
}

export default PingPacket;
