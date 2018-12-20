import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { convertNodeState, createPbNodeState, validatePbNodeStateObj } from './utils';

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
      && validatePbNodeStateObj(obj.nodestate)
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
        ephemeralPubKey: obj.ephemeralpubkey,
        peerPubKey: obj.peerpubkey,
        nodeState: convertNodeState(obj.nodestate!),
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.HelloRequestPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setSign(this.body!.sign);
    msg.setEphemeralpubkey(this.body!.ephemeralPubKey);
    msg.setPeerpubkey(this.body!.peerPubKey);
    msg.setNodestate(createPbNodeState(this.body!.nodeState));

    return msg.serializeBinary();
  }
}

export default HelloRequestPacket;
