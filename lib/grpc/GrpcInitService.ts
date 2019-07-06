/* tslint:disable no-null-keyword */
import grpc, { status } from 'grpc';
import * as xudrpc from '../proto/xudrpc_pb';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import InitService from 'lib/service/InitService';

class GrpcInitService {
  constructor(private initService: InitService) {}

  private getGrpcError = (err: any) => {
    // if we recognize this error, use a proper gRPC ServiceError with a descriptive and appropriate code
    let code: grpc.status | undefined;
    switch (err.code) {
      case serviceErrorCodes.PENDING_CALL_CONFLICT:
        code = status.RESOURCE_EXHAUSTED;
        break;
      case serviceErrorCodes.UNIMPLEMENTED:
        code = status.UNIMPLEMENTED;
        break;
    }

    // return a grpc error with the code if we've assigned one, otherwise pass along the caught error as UNKNOWN
    const grpcError: grpc.ServiceError = {
      code: code || status.UNKNOWN,
      message: err.message,
      name: err.name,
    };

    return grpcError;
  }

  /**
   * See [[InitService.createNode]]
   */
  public createNode: grpc.handleUnaryCall<xudrpc.CreateNodeRequest, xudrpc.CreateNodeResponse> = async (call, callback) => {
    try {
      const mnemonic = await this.initService.createNode(call.request.toObject());
      const response = new xudrpc.CreateNodeResponse();
      if (mnemonic) {
        response.setSeedMnemonicList(mnemonic);
      }

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
    this.initService.pendingCall = false;
  }

  /**
   * See [[InitService.unlockNode]]
   */
  public unlockNode: grpc.handleUnaryCall<xudrpc.UnlockNodeRequest, xudrpc.UnlockNodeResponse> = async (call, callback) => {
    try {
      await this.initService.unlockNode(call.request.toObject());
      const response = new xudrpc.UnlockNodeResponse();

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
    this.initService.pendingCall = false;
  }
}

export default GrpcInitService;
