import Packet, { MessageType } from '../Packet';
import PacketType from '../PacketType';
import { ms } from '../../../utils/utils';

type PongPacketBody = {
  ts: number;
};

class PongPacket extends Packet {
  public type: PacketType = PacketType.PONG;
  public messageType: MessageType = MessageType.RESPONSE;
  public body!: PongPacketBody;

  public init(args: { reqHash: string }): PongPacket {
    this.body = { ts: ms() };
    this.header = this.createHeader(this.body, args.reqHash);
    return this;
  }

}

export default PongPacket;
