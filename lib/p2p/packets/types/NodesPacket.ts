import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import { NodeConnectionInfo } from '../../types';
import * as pb from '../../../proto/xudp2p_pb';

class NodesPacket extends Packet<NodeConnectionInfo[]> {
  public get type(): PacketType {
    return PacketType.Nodes;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Response;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): NodesPacket | pb.NodesPacket.AsObject => {
    const obj = pb.NodesPacket.deserializeBinary(binary).toObject();
    return NodesPacket.validate(obj) ? NodesPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.NodesPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.reqId
      && obj.nodesList.every(node =>
        !!node.nodePubKey
        && node.addressesList.length > 0
        && node.addressesList.every(addr => addr.port > 0 && !!addr.host),
      )
    );

    // TODO: add address port/host format validation
  }

  private static convert = (obj: pb.NodesPacket.AsObject): NodesPacket => {
    return new NodesPacket({
      header: {
        id: obj.id,
        reqId: obj.reqId,
      },
      body: obj.nodesList.map(node => ({
        nodePubKey: node.nodePubKey,
        addresses: node.addressesList,
      })),
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.NodesPacket();
    msg.setId(this.header.id);
    msg.setReqId(this.header.reqId!);
    msg.setNodesList(this.body!.map((node) => {
      const pbNode = new pb.Node();
      pbNode.setNodePubKey(node.nodePubKey);
      pbNode.setAddressesList(node.addresses.map((addr) => {
        const pbAddr = new pb.Address();
        pbAddr.setHost(addr.host);
        pbAddr.setPort(addr.port);
        return pbAddr;
      }));

      return pbNode;
    }));

    return msg.serializeBinary();
  }
}

export default NodesPacket;
