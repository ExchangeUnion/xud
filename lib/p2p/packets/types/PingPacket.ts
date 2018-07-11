import Packet, { MessageType, PacketHeader } from '../Packet';
import PacketType from '../PacketType';
import {ms} from "../../../utils/utils";

type PingPacketBody = {
  ts: number;
};

class PingPacket extends Packet {
  public type: PacketType = PacketType.PING;
  public messageType: MessageType = MessageType.REQUEST;
  public body!: PingPacketBody;

  init(): PingPacket {
    this.body = { ts: ms() };
    this.header = this.createHeader();
    return this;
  }
}

export default PingPacket;
