import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../types';
import * as pb from '../../../proto/xudp2p_pb';
import { validateNodeState, convertNodeState, serializeNodeState } from '../utils';

export type SessionInitPacketBody = {
  sign: string;
  ephemeralPubKey: string;
  /** The node pub key of the peer we are connecting to. */
  peerPubKey: string;
  /** Our local node state. */
  nodeState: NodeState;
  /** The version of xud we are running. */
  version: string;
  /** Our local node pub key. */
  nodePubKey: string;
};

class SessionInitPacket extends Packet<SessionInitPacketBody> {
  public get type(): PacketType {
    return PacketType.SessionInit;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Request;
  }

  public get responseType(): ResponseType {
    return PacketType.SessionAck;
  }

  public static deserialize = (binary: Uint8Array): SessionInitPacket | pb.SessionInitPacket.AsObject => {
    const obj = pb.SessionInitPacket.deserializeBinary(binary).toObject();
    return SessionInitPacket.validate(obj) ? SessionInitPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SessionInitPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.sign
      && obj.ephemeralPubKey
      && obj.peerPubKey
      && obj.version
      && obj.nodePubKey
      && validateNodeState(obj.nodeState)
    );
  }

  private static convert = (obj: pb.SessionInitPacket.AsObject): SessionInitPacket => {
    return new SessionInitPacket({
      header: {
        id: obj.id,
      },
      body: {
        sign: obj.sign,
        peerPubKey: obj.peerPubKey,
        ephemeralPubKey: obj.ephemeralPubKey,
        version: obj.version,
        nodePubKey: obj.nodePubKey,
        nodeState: convertNodeState(obj.nodeState!),
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SessionInitPacket();
    msg.setId(this.header.id);
    msg.setSign(this.body!.sign);
    msg.setPeerPubKey(this.body!.peerPubKey);
    msg.setEphemeralPubKey(this.body!.ephemeralPubKey);
    msg.setVersion(this.body!.version);
    msg.setNodePubKey(this.body!.nodePubKey);
    msg.setNodeState(serializeNodeState(this.body!.nodeState));

    return msg.serializeBinary();
  }
}

export default SessionInitPacket;
