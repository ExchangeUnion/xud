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

  public static deserialize(binary: Uint8Array): HelloPacket | undefined {
    const msg = pb.HelloPacket.deserializeBinary(binary).toObject();
    return HelloPacket.validate(msg) ? HelloPacket.convert(msg) : undefined;
  }

  private static validate(msg: pb.HelloPacket.AsObject): boolean {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && !msg.header.reqid
      && msg.version
      && msg.nodepubkey
      && msg.pairsList
      && msg.addressesList.filter(addr => addr.port && addr.host).length === msg.addressesList.length
    );
  }

  private static convert = (msg: pb.HelloPacket.AsObject): HelloPacket => {
    return new HelloPacket({
      header: {
        id: msg.header!.id,
        hash: msg.header!.hash,
      },
      body: removeUndefinedProps({
        version: msg.version,
        nodePubKey: msg.nodepubkey,
        pairs: msg.pairsList,
        addresses: msg.addressesList,
        raidenAddress: msg.raidenaddress || undefined,
        lndbtcPubKey: msg.lndbtcpubkey || undefined,
        lndltcPubKey: msg.lndltcpubkey || undefined,
      }),
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);

    const msg = new pb.HelloPacket();
    msg.setHeader(pbHeader);
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
