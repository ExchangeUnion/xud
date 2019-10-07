/* tslint:disable no-null-keyword */
import grpc from 'grpc';
import InitService from 'lib/service/InitService';
import * as xudrpc from '../proto/xudrpc_pb';
import getGrpcError from './getGrpcError';

class GrpcInitService {
  constructor(private initService: InitService) {}

  /**
   * See [[InitService.createNode]]
   */
  public createNode: grpc.handleUnaryCall<xudrpc.CreateNodeRequest, xudrpc.CreateNodeResponse> = async (call, callback) => {
    try {
      const { mnemonic, initializedLndWallets, initializedRaiden } = await this.initService.createNode(call.request.toObject());
      const response = new xudrpc.CreateNodeResponse();
      if (mnemonic) {
        response.setSeedMnemonicList(mnemonic);
      }
      if (initializedLndWallets) {
        response.setInitializedLndsList(initializedLndWallets);
      }
      response.setInitializedRaiden(initializedRaiden);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
    this.initService.pendingCall = false;
  }

  /**
   * See [[InitService.unlockNode]]
   */
  public unlockNode: grpc.handleUnaryCall<xudrpc.UnlockNodeRequest, xudrpc.UnlockNodeResponse> = async (call, callback) => {
    try {
      const unlockedLndClients = await this.initService.unlockNode(call.request.toObject());
      const response = new xudrpc.UnlockNodeResponse();
      response.setUnlockedLndsList(unlockedLndClients);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
    this.initService.pendingCall = false;
  }
}

export default GrpcInitService;
