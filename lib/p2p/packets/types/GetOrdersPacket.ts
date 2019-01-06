import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';

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

  public static deserialize = (binary: Uint8Array): GetOrdersPacket | pb.GetOrdersPacket.AsObject => {
    const obj = pb.GetOrdersPacket.deserializeBinary(binary).toObject();
    return GetOrdersPacket.validate(obj) ? GetOrdersPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.GetOrdersPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.pairIdsList.length > 0
    );
  }

  private static convert = (obj: pb.GetOrdersPacket.AsObject): GetOrdersPacket => {
    return new GetOrdersPacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: {
        pairIds: obj.pairIdsList,
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.GetOrdersPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setPairIdsList(this.body!.pairIds);

    return msg.serializeBinary();
  }
}

export default GetOrdersPacket;
