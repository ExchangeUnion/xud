import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import { convertNodeState, createPbNodeState, validatePbNodeStateObj } from './utils';

export type NodeStateUpdatePacketBody = {
  nodeState: NodeState;
};

class NodeStateUpdatePacket extends Packet<NodeStateUpdatePacketBody> {
  public get type() {
    return PacketType.NodeStateUpdate;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): NodeStateUpdatePacket | pb.NodeStateUpdatePacket.AsObject => {
    const obj = pb.NodeStateUpdatePacket.deserializeBinary(binary).toObject();
    return NodeStateUpdatePacket.validate(obj) ? NodeStateUpdatePacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.NodeStateUpdatePacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && validatePbNodeStateObj(obj.nodestate)
    );
  }

  private static convert = (obj: pb.NodeStateUpdatePacket.AsObject): NodeStateUpdatePacket => {
    return new NodeStateUpdatePacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: {
        nodeState: convertNodeState(obj.nodestate!),
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.NodeStateUpdatePacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setNodestate(createPbNodeState(this.body!.nodeState));

    return msg.serializeBinary();
  }
}

export default NodeStateUpdatePacket;
