import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import { NodeState } from '../../types';
import { validateNodeState, convertNodeState, serializeNodeState } from '../utils';

class NodeStateUpdatePacket extends Packet<NodeState> {
  public get type(): PacketType {
    return PacketType.NodeStateUpdate;
  }

  public get direction(): PacketDirection {
    return PacketDirection.Unilateral;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): NodeStateUpdatePacket | pb.NodeStateUpdatePacket.AsObject => {
    const obj = pb.NodeStateUpdatePacket.deserializeBinary(binary).toObject();
    return NodeStateUpdatePacket.validate(obj) ? NodeStateUpdatePacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.NodeStateUpdatePacket.AsObject): boolean => {
    return !!(obj.id
      && validateNodeState(obj.nodeState)
    );
  }

  private static convert = (obj: pb.NodeStateUpdatePacket.AsObject): NodeStateUpdatePacket => {
    return new NodeStateUpdatePacket({
      header: {
        id: obj.id,
      },
      body: removeUndefinedProps(convertNodeState(obj.nodeState!)),
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.NodeStateUpdatePacket();

    msg.setId(this.header.id);
    msg.setNodeState(serializeNodeState(this.body!));

    return msg.serializeBinary();
  }
}

export default NodeStateUpdatePacket;
