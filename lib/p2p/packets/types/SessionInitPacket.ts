import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { NodeState } from '../../types';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps, setObjectToMap, convertKvpArrayToKvps } from '../../../utils/utils';

export type SessionInitPacketBody = {
  sign: string;
  ephemeralPubKey: string;
  peerPubKey: string;
  nodeState: NodeState;
};

class SessionInitPacket extends Packet<SessionInitPacketBody> {
  public get type() {
    return PacketType.SessionInit;
  }

  public get direction() {
    return PacketDirection.Request;
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
      && obj.nodeState
      && obj.nodeState.version
      && obj.nodeState.nodePubKey
      && obj.nodeState.pairsList
      && obj.nodeState.addressesList.filter(addr => addr.host).length === obj.nodeState.addressesList.length
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
        nodeState: removeUndefinedProps({
          version: obj.nodeState!.version,
          nodePubKey: obj.nodeState!.nodePubKey,
          pairs: obj.nodeState!.pairsList,
          addresses: obj.nodeState!.addressesList,
          raidenAddress: obj.nodeState!.raidenAddress || undefined,
          lndPubKeys: obj.nodeState!.lndPubKeysMap ? convertKvpArrayToKvps(obj.nodeState!.lndPubKeysMap) : undefined,
        }),
      },
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SessionInitPacket();
    msg.setId(this.header.id);
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
      if (this.body!.nodeState.lndPubKeys) {
        setObjectToMap(this.body!.nodeState.lndPubKeys, pbNodeState.getLndPubKeysMap());
      }
      return pbNodeState;
    })());

    return msg.serializeBinary();
  }
}

export default SessionInitPacket;
