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

  public static deserialize = (binary: Uint8Array): SwapFailedPacket | pb.SwapFailedPacket.AsObject => {
    const obj = pb.SwapFailedPacket.deserializeBinary(binary).toObject();
    return SwapFailedPacket.validate(obj) ? SwapFailedPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SwapFailedPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.hash
      && obj.rhash
    );
  }

  private static convert = (obj: pb.SwapFailedPacket.AsObject): SwapFailedPacket => {
    return new SwapFailedPacket({
      header: removeUndefinedProps({
        id: obj.id,
        hash: obj.hash,
        reqId: obj.reqid || undefined,
      }),
      body: {
        rHash: obj.rhash,
        errorMessage: obj.errormessage,
      },
    });
  }

  public serialize(): Uint8Array {
    const msg = new pb.SwapFailedPacket();
    msg.setId(this.header.id);
    msg.setHash(this.header.hash!);
    msg.setReqid(this.header.reqId!);
    msg.setRhash(this.body!.rHash);
    msg.setErrormessage(this.body!.errorMessage);

    return msg.serializeBinary();
  }
}

export default SwapFailedPacket;
