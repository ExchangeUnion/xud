import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import {removeUndefinedProps} from "../../../utils/utils";

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
      && obj.peerpubkey
      && obj.nodestate
      && obj.nodestate.version
      && obj.nodestate.nodepubkey
      && obj.nodestate.pairsList
      && obj.nodestate.addressesList.filter(addr => addr.host).length === obj.nodestate.addressesList.length
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
        peerPubKey: obj.peerpubkey,
        nodeState: removeUndefinedProps({
          version: obj.nodestate!.version,
          nodePubKey: obj.nodestate!.nodepubkey,
          pairs: obj.nodestate!.pairsList,
          addresses: obj.nodestate!.addressesList,
          raidenAddress: obj.nodestate!.raidenaddress || undefined,
          lndbtcPubKey: obj.nodestate!.lndbtcpubkey || undefined,
          lndltcPubKey: obj.nodestate!.lndltcpubkey || undefined,
        })
      }
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.HelloResponsePacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setSign(this.body!.sign);
    msg.setPeerpubkey(this.body!.peerPubKey);
    msg.setNodestate((() => {
      const pbNodeState = new pb.NodeState();
      pbNodeState.setVersion(this.body!.nodeState.version);
      pbNodeState.setNodepubkey(this.body!.nodeState.nodePubKey);
      pbNodeState.setPairsList(this.body!.nodeState!.pairs);
      pbNodeState.setAddressesList(this.body!.nodeState!.addresses!.map((addr) => {
        const pbAddr = new pb.Address();
        pbAddr.setHost(addr.host);
        pbAddr.setPort(addr.port);
        return pbAddr;
      }));
      pbNodeState.setRaidenaddress(this.body!.nodeState!.raidenAddress!);
      pbNodeState.setLndbtcpubkey(this.body!.nodeState!.lndbtcPubKey!);
      pbNodeState.setLndltcpubkey(this.body!.nodeState!.lndltcPubKey!);
      return pbNodeState;
    })())

    return msg.serializeBinary();
  }
}

export default HelloResponsePacket;
