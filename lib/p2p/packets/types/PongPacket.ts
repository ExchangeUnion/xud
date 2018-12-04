import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';
import PingPacket from './PingPacket';

class PongPacket extends Packet<undefined> {
  public get type() {
    return PacketType.Pong;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize = (binary: Uint8Array): PongPacket | undefined => {
    const msg = pb.PingPacket.deserializeBinary(binary).toObject();
    return PongPacket.validate(msg) ? PongPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.PongPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && !msg.header.hash
      && msg.header.reqid
    );
  }

  private static convert = (msg: pb.PongPacket.AsObject): PingPacket => {
    return new PingPacket({
      header: removeUndefinedProps({
        id: msg.header!.id,
        reqId: msg.header!.reqid,
      }),
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setReqid(this.header.reqId!);

    const msg = new pb.PingPacket();
    msg.setHeader(pbHeader);

    return msg.serializeBinary();
  }
}

export default PongPacket;
