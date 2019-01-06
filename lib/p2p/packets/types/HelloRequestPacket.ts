import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import {removeUndefinedProps} from "../../../utils/utils";

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
      && obj.ephemeralpubkey
      && obj.peerpubkey
      && obj.nodestate
      && obj.nodestate.version
      && obj.nodestate.nodepubkey
      && obj.nodestate.pairsList
      && obj.nodestate.addressesList.filter(addr => addr.host).length === obj.nodestate.addressesList.length
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
        peerPubKey: obj.peerpubkey,
        ephemeralPubKey: obj.ephemeralpubkey,
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
    const msg = new pb.HelloRequestPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setSign(this.body!.sign);
    msg.setPeerpubkey(this.body!.peerPubKey);
    msg.setEphemeralpubkey(this.body!.ephemeralPubKey);
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

export default HelloRequestPacket;
