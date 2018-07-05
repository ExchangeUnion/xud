import Packet, { MessageType, PacketHeader } from '../Packet';
import PacketType from '../PacketType';

type PongPacketBody = {
  ts: number;
};

class PongPacket extends Packet {
  public type: PacketType = PacketType.PONG;
  public messageType: MessageType = MessageType.RESPONSE;

  constructor(public body: PongPacketBody, header?: PacketHeader) {
    super(body, header);
  }

  public static fromRaw(packet: string): PongPacket {
    const { header, body } = JSON.parse(packet);
    return new PongPacket(body, header);
  }
}

export default PongPacket;
