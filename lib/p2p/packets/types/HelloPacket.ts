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
      && obj.nodepubkey
      && obj.pairsList
      && obj.addressesList.filter(addr => addr.host).length === obj.addressesList.length
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
        nodePubKey: obj.nodepubkey,
        pairs: obj.pairsList,
        addresses: obj.addressesList,
        raidenAddress: obj.raidenaddress || undefined,
        lndbtcPubKey: obj.lndbtcpubkey || undefined,
        lndltcPubKey: obj.lndltcpubkey || undefined,
      }),
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.HelloPacket();
    msg.setId(this.header.id)
    msg.setHash(this.header.hash!)
    msg.setVersion(this.body!.version);
    msg.setNodepubkey(this.body!.nodePubKey);
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

export default HelloPacket;
