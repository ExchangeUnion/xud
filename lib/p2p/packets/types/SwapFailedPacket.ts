import Packet, { PacketDirection, ResponseType } from '../Packet';
import PacketType from '../PacketType';
import * as pb from '../../../proto/xudp2p_pb';
import { removeUndefinedProps } from '../../../utils/utils';
import { SwapFailureReason } from '../../../constants/enums';

// TODO: proper error handling
export type SwapFailedPacketBody = {
  rHash: string;
  failureReason: SwapFailureReason;
  errorMessage?: string;
};

class SwapFailedPacket extends Packet<SwapFailedPacketBody> {
  public get type(): PacketType {
    return PacketType.SwapFailed;
  }

  public get direction(): PacketDirection {
    // SwapFailedPacket may serve as a response to SwapRequest packet
    if (this.header.reqId) {
      return PacketDirection.Response;
    }
    return PacketDirection.Unilateral;
  }

  public get responseType(): ResponseType {
    return undefined;
  }

  public static deserialize = (binary: Uint8Array): SwapFailedPacket | pb.SwapFailedPacket.AsObject => {
    const obj = pb.SwapFailedPacket.deserializeBinary(binary).toObject();
    return SwapFailedPacket.validate(obj) ? SwapFailedPacket.convert(obj) : obj;
  }

  private static validate = (obj: pb.SwapFailedPacket.AsObject): boolean => {
    return !!(obj.id
      && obj.rHash
    );
  }

  private static convert = (obj: pb.SwapFailedPacket.AsObject): SwapFailedPacket => {
    return new SwapFailedPacket({
      header: removeUndefinedProps({
        id: obj.id,
        reqId: obj.reqId || undefined,
      }),
      body: removeUndefinedProps({
        rHash: obj.rHash,
        errorMessage: obj.errorMessage || undefined,
        failureReason: obj.failureReason,
      }),
    });
  }

  public serialize = (): Uint8Array => {
    const msg = new pb.SwapFailedPacket();
    msg.setId(this.header.id);
    msg.setReqId(this.header.reqId!);
    msg.setRHash(this.body!.rHash);
    if (this.body!.errorMessage) {
      msg.setErrorMessage(this.body!.errorMessage!);
    }
    msg.setFailureReason(this.body!.failureReason);

    return msg.serializeBinary();
  }
}

export default SwapFailedPacket;
