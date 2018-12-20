import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import { convertNodeState, createPbNodeState, validatePbNodeStateObj } from './utils';

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
      && obj.reqid
      && obj.hash
      && obj.sign
      && obj.peerpubkey
      && validatePbNodeStateObj(obj.nodestate)
    );
  }

  private static convert = (obj: pb.HelloResponsePacket.AsObject): HelloResponsePacket => {
    return new HelloResponsePacket({
      header: {
        id: obj.id,
        hash: obj.hash,
        reqId: obj.reqid,
      },
      body: {
        sign: obj.sign,
        peerPubKey: obj.peerpubkey,
        nodeState: convertNodeState(obj.nodestate!),
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.HelloResponsePacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setReqid(this.header.reqId!);
    msg.setSign(this.body!.sign);
    msg.setPeerpubkey(this.body!.peerPubKey);
    msg.setNodestate(createPbNodeState(this.body!.nodeState));

    return msg.serializeBinary();
  }
}

export default HelloResponsePacket;
