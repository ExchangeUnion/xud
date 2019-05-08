import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

class PingPacket extends Packet<undefined> {
  public get type(): PacketType {
    return PacketType.Ping;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Request;
  }

  public get responseType(): ResponseType {
    return PacketType.Pong;
  }

  public static deserialize = (binary: Uint8Array): PingPacket | pb.PingPacket.AsObject => {
    const obj = pb.PingPacket.deserializeBinary(binary).toObject();
    return PingPacket.validate(obj) ? PingPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.PingPacket.AsObject): boolean => {
    return !!(obj.id);
  }

  private static convert = (obj: pb.PingPacket.AsObject): PingPacket => {
    return new PingPacket({
      header: {
        id: obj.id,
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.PingPacket();
    msg.setId(this.header.id);

    return msg.serializeBinary();
  }
}

export default PingPacket;
