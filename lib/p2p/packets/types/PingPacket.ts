import Packet, { MessageType, PacketHeader } from '../Packet';
import PacketType from '../PacketType';

type PingPacketBody = {
  ts: number;
};

class PingPacket extends Packet {
  public type: PacketType = PacketType.PING;
  public messageType: MessageType = MessageType.REQUEST;

  constructor(public body: PingPacketBody, header?: PacketHeader) {
    super(body, header);
  }

  public static fromRaw(packet: string): PingPacket {
    const { header, body } = JSON.parse(packet);
    return new PingPacket(body, header);
  }
}

export default PingPacket;
