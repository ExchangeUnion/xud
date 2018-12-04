import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';

class PingPacket extends Packet<undefined> {
  public get type() {
    return PacketType.Ping;
  }

  public get direction() {
    return PacketDirection.Request;
  }

  public static deserialize = (binary: Uint8Array): PingPacket | undefined => {
    const msg = pb.PingPacket.deserializeBinary(binary).toObject();
    return PingPacket.validate(msg) ? PingPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.PingPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && !msg.header.hash
      && !msg.header.reqid
    );
  }

  private static convert = (msg: pb.PingPacket.AsObject): PingPacket => {
    return new PingPacket({
      header: removeUndefinedProps({
        id: msg.header!.id,
      }),
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

export default PingPacket;
