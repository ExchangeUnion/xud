import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import { HandshakeState } from '../../../types/p2p';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';

class HelloPacket extends Packet<HandshakeState> {
  public get type() {
    return PacketType.Hello;
  }

  public get direction() {
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): HelloPacket | pb.HelloPacket.AsObject => {
    const obj = pb.HelloPacket.deserializeBinary(binary).toObject();
    return HelloPacket.validate(obj) ? HelloPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.HelloPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.version
      && obj.nodePubKey
      && obj.pairsList
      && obj.addressesList.every(addr => !!addr.host)
    );
  }

  private static convert = (obj: pb.HelloPacket.AsObject): HelloPacket => {
    return new HelloPacket({
      header: {
        id: obj.id,
        hash: obj.hash,
      },
      body: removeUndefinedProps({
        version: obj.version,
        nodePubKey: obj.nodePubKey,
        pairs: obj.pairsList,
        addresses: obj.addressesList,
        raidenAddress: obj.raidenAddress || undefined,
        lndbtcPubKey: obj.lndbtcPubKey || undefined,
        lndltcPubKey: obj.lndltcPubKey || undefined,
      }),
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.HelloPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setVersion(this.body.version);
    msg.setNodePubKey(this.body.nodePubKey);
    msg.setPairsList(this.body.pairs);
    msg.setAddressesList(this.body.addresses.map((addr) => {
      const pbAddr = new pb.Address();
      pbAddr.setHost(addr.host);
      pbAddr.setPort(addr.port);
      return pbAddr;
    }));
    msg.setRaidenAddress(this.body.raidenAddress);
    msg.setLndbtcPubKey(this.body.lndbtcPubKey);
    msg.setLndltcPubKey(this.body.lndltcPubKey);

    return msg.serializeBinary();
  }
}

export default HelloPacket;
