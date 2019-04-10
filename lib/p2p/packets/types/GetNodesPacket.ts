import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

class GetNodesPacket extends Packet<undefined> {
  public get type(): PacketType {
    return PacketType.GetNodes;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Request;
  }

  public get responseType(): ResponseType {
    return PacketType.Nodes;
  }

  public static deserialize = (binary: Uint8Array): GetNodesPacket | pb.GetNodesPacket.AsObject => {
    const obj = pb.GetNodesPacket.deserializeBinary(binary).toObject();
    return GetNodesPacket.validate(obj) ? GetNodesPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.GetNodesPacket.AsObject): boolean => {
    return !!(obj.id);
  }

  private static convert = (obj: pb.GetNodesPacket.AsObject): GetNodesPacket => {
    return new GetNodesPacket({
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

export default GetNodesPacket;
