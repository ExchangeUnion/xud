import Packet, { PacketDirection } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import SwapCompletePacket from './SwapCompletePacket';
import { removeUndefinedProps } from '../../../utils/utils';

// TODO: proper error handling
export type SwapFailedPacketBody = {
  rHash: string;
  errorMessage: string;
};

class SwapFailedPacket extends Packet<SwapFailedPacketBody> {
  public get type() {
    return PacketType.SwapFailed;
  }

  public get direction(): PacketDirection {
    // SwapFailedPacket may serve as a response to SwapRequest packet
    if (this.header.reqId) {
      return PacketDirection.Response;
    }
    return PacketDirection.Unilateral;
  }

  public static deserialize = (binary: Uint8Array): SwapFailedPacket | undefined => {
    const msg = pb.SwapFailedPacket.deserializeBinary(binary).toObject();
    return SwapFailedPacket.validate(msg) ? SwapFailedPacket.convert(msg) : undefined;
  }

  private static validate = (msg: pb.SwapFailedPacket.AsObject): boolean => {
    return !!(msg.header
      && msg.header.id
      && msg.header.hash
      && msg.rhash
    );
  }

  private static convert = (msg: pb.SwapFailedPacket.AsObject): SwapFailedPacket => {
    return new SwapFailedPacket({
      header: removeUndefinedProps({
        id: msg.header!.id,
        hash: msg.header!.hash,
        reqId: msg.header!.reqid || undefined,
      }),
      body: {
        rHash: msg.rhash,
        errorMessage: msg.errormessage,
      },
    });
  }

  public serialize(): Uint8Array {
    const pbHeader = new pb.Header();
    pbHeader.setId(this.header.id);
    pbHeader.setHash(this.header.hash!);
    pbHeader.setReqid(this.header.reqId!);

    const msg = new pb.SwapFailedPacket();
    msg.setHeader(pbHeader);
    msg.setRhash(this.body!.rHash);
    msg.setErrormessage(this.body!.errorMessage);

    return msg.serializeBinary();
  }
}

export default SwapFailedPacket;
