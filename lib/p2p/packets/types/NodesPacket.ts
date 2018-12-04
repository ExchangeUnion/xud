import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeConnectionInfo } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import HelloPacket from './HelloPacket';

class NodesPacket extends Packet<NodeConnectionInfo[]> {
  public get type() {
    return PacketType.Nodes;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize = (binary: Uint8Array): NodesPacket | undefined => {
    const msg = pb.NodesPacket.deserializeBinary(binary).toObject();
    return NodesPacket.validate(msg) ? NodesPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.NodesPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && msg.header.reqid
      && msg.nodesList.filter(node =>
        node.nodepubkey
        && node.addressesList.length > 0
        && node.addressesList.filter(addr => addr.port && addr.host).length === node.addressesList.length,
      ).length === msg.nodesList.length
    );

    // TODO: add address port/host format validation
  }

  private static convert = (msg: pb.NodesPacket.AsObject): NodesPacket => {
    return new NodesPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
        reqId: msg.header!.reqid,
      },
      body: msg.nodesList.map(node => ({
        nodePubKey: node.nodepubkey,
        addresses: node.addressesList,
      })),
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);
    pbHeader.setReqid(this.header.reqId!);

    const msg = new pb.NodesPacket();
    msg.setHeader(pbHeader);
    msg.setNodesList(this.body!.map((node) => {
      const pbNode = new pb.Node();
      pbNode.setNodepubkey(node.nodePubKey);
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
