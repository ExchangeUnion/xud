import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';

export type GetOrdersPacketBody = {
  pairIds: string[],
};

class GetOrdersPacket extends Packet<GetOrdersPacketBody> {
  public get type() {
    return PacketType.GetOrders;
  }

  public get direction() {
    return PacketDirection.Request;
  }

  public static deserialize = (binary: Uint8Array): GetOrdersPacket | undefined => {
    const msg = pb.GetOrdersPacket.deserializeBinary(binary).toObject();
    return GetOrdersPacket.validate(msg) ? GetOrdersPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.GetOrdersPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.pairidsList.length > 0
    );
  }

  private static convert = (msg: pb.GetOrdersPacket.AsObject): GetOrdersPacket => {
    return new GetOrdersPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: {
        pairIds: msg.pairidsList,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.GetOrdersPacket();
    msg.setHeader(pbHeader);
    msg.setPairidsList(this.body!.pairIds);

    return msg.serializeBinary();
  }
}

export default GetOrdersPacket;
