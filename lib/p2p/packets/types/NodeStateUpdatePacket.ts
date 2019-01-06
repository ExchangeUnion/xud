import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import {NodeState, NodeStateUpdate} from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';

class NodeStateUpdatePacket extends Packet<NodeStateUpdate> {
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
      && obj.pairsList
      && obj.addressesList.filter(addr => addr.host).length === obj.addressesList.length
    );
  }

  private static convert = (obj: pb.NodeStateUpdatePacket.AsObject): NodeStateUpdatePacket => {
    return new NodeStateUpdatePacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: removeUndefinedProps({
        pairs: obj.pairsList,
        addresses: obj.addressesList,
        raidenAddress: obj.raidenaddress || undefined,
        lndbtcPubKey: obj.lndbtcpubkey || undefined,
        lndltcPubKey: obj.lndltcpubkey || undefined,
      })
    })
  }

  public serialize(): Uint8Array {
    const msg = new pb.NodeStateUpdatePacket();

    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setPairsList(this.body!.pairs);
    msg.setAddressesList(this.body!.addresses!.map((addr) => {
      const pbAddr = new pb.Address();
      pbAddr.setHost(addr.host);
      pbAddr.setPort(addr.port);
      return pbAddr;
    }));
    msg.setRaidenaddress(this.body!.raidenAddress!);
    msg.setLndbtcpubkey(this.body!.lndbtcPubKey!);
    msg.setLndltcpubkey(this.body!.lndltcPubKey!);

    return msg.serializeBinary();
  }
}

export default NodeStateUpdatePacket;
