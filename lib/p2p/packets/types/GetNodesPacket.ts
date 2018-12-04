import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import DisconnectingPacket from './DisconnectingPacket';

class GetNodesPacket extends Packet<undefined> {
  public get type() {
    return PacketType.GetNodes;
  }

  public get direction() {
    return PacketDirection.Request;
  }

  public static deserialize = (binary: Uint8Array): GetNodesPacket | undefined => {
    const msg = pb.GetNodesPacket.deserializeBinary(binary).toObject();
    return GetNodesPacket.validate(msg) ? GetNodesPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.GetNodesPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && !msg.header.hash
      && !msg.header.reqid
    );
  }

  private static convert = (msg: pb.GetNodesPacket.AsObject): GetNodesPacket => {
    return new GetNodesPacket({
      header: {
        id: msg.header!.id,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);

    const msg = new pb.PingPacket();
    msg.setHeader(pbHeader);

    return msg.serializeBinary();
  }
}

export default GetNodesPacket;
