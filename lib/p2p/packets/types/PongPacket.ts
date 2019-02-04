import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import PingPacket from './PingPacket';

class PongPacket extends Packet<undefined> {
  public get type() {
    return PacketType.Pong;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize = (binary: Uint8Array): PongPacket | pb.PongPacket.AsObject => {
    const obj = pb.PongPacket.deserializeBinary(binary).toObject();
    return PongPacket.validate(obj) ? PongPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.PongPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.reqId
    );
  }

  private static convert = (obj: pb.PongPacket.AsObject): PingPacket => {
    return new PongPacket({
      header: {
        id: obj.id,
        reqId: obj.reqId,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.PongPacket();
    msg.setId(this.header.id);
    msg.setReqId(this.header.reqId!);

    return msg.serializeBinary();
  }
}

export default PongPacket;
