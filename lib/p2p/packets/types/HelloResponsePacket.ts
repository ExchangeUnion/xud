import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';

export type HelloResponsePacketBody = {
  sign: string;
  peerPubKey: string;
  nodeState: NodeState;
};

class HelloResponsePacket extends Packet<HelloResponsePacketBody> {
  public get type() {
    return PacketType.HelloResponse;
  }

  public get direction() {
    return PacketDirection.Response;
  }

  public static deserialize = (binary: Uint8Array): HelloResponsePacket | pb.HelloResponsePacket.AsObject => {
    const obj = pb.HelloResponsePacket.deserializeBinary(binary).toObject();
    return HelloResponsePacket.validate(obj) ? HelloResponsePacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.HelloResponsePacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.sign
      && obj.peerPubKey
      && obj.nodeState
      && obj.nodeState.version
      && obj.nodeState.nodePubKey
      && obj.nodeState.pairsList
      && obj.nodeState.addressesList.filter(addr => addr.host).length === obj.nodeState.addressesList.length
    );
  }

  private static convert = (obj: pb.HelloResponsePacket.AsObject): HelloResponsePacket => {
    return new HelloResponsePacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: {
        sign: obj.sign,
        peerPubKey: obj.peerPubKey,
        nodeState: removeUndefinedProps({
          version: obj.nodeState!.version,
          nodePubKey: obj.nodeState!.nodePubKey,
          pairs: obj.nodeState!.pairsList,
          addresses: obj.nodeState!.addressesList,
          raidenAddress: obj.nodeState!.raidenAddress || undefined,
          lndbtcPubKey: obj.nodeState!.lndBtcPubKey || undefined,
          lndltcPubKey: obj.nodeState!.lndLtcPubKey || undefined,
        }),
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.HelloResponsePacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setSign(this.body!.sign);
    msg.setPeerPubKey(this.body!.peerPubKey);
    msg.setNodeState((() => {
      const pbNodeState = new pb.NodeState();
      pbNodeState.setVersion(this.body!.nodeState.version);
      pbNodeState.setNodePubKey(this.body!.nodeState.nodePubKey);
      pbNodeState.setPairsList(this.body!.nodeState.pairs);
      pbNodeState.setAddressesList(this.body!.nodeState.addresses!.map((addr) => {
        const pbAddr = new pb.Address();
        pbAddr.setHost(addr.host);
        pbAddr.setPort(addr.port);
        return pbAddr;
      }));
      pbNodeState.setRaidenAddress(this.body!.nodeState.raidenAddress!);
      pbNodeState.setLndBtcPubKey(this.body!.nodeState.lndbtcPubKey!);
      pbNodeState.setLndLtcPubKey(this.body!.nodeState.lndltcPubKey!);
      return pbNodeState;
    })());

    return msg.serializeBinary();
  }
}

export default HelloResponsePacket;
