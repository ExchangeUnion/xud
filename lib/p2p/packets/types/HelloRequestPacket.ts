import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';

export type HelloRequestPacketBody = {
  sign: string;
  ephemeralPubKey: string;
  peerPubKey: string;
  nodeState: NodeState;
};

class HelloRequestPacket extends Packet<HelloRequestPacketBody> {
  public get type() {
    return PacketType.HelloRequest;
  }

  public get direction() {
    return PacketDirection.Request;
  }

  public static deserialize = (binary: Uint8Array): HelloRequestPacket | pb.HelloRequestPacket.AsObject => {
    const obj = pb.HelloRequestPacket.deserializeBinary(binary).toObject();
    return HelloRequestPacket.validate(obj) ? HelloRequestPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.HelloRequestPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.sign
      && obj.ephemeralPubKey
      && obj.peerPubKey
      && obj.nodeState
      && obj.nodeState.version
      && obj.nodeState.nodePubKey
      && obj.nodeState.pairsList
      && obj.nodeState.addressesList.filter(addr => addr.host).length === obj.nodeState.addressesList.length
    );
  }

  private static convert = (obj: pb.HelloRequestPacket.AsObject): HelloRequestPacket => {
    return new HelloRequestPacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: {
        sign: obj.sign,
        peerPubKey: obj.peerPubKey,
        ephemeralPubKey: obj.ephemeralPubKey,
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
    const msg = new pb.HelloRequestPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setSign(this.body!.sign);
    msg.setPeerPubKey(this.body!.peerPubKey);
    msg.setEphemeralPubKey(this.body!.ephemeralPubKey);
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

export default HelloRequestPacket;
