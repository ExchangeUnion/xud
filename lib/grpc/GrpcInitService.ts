/* tslint:disable no-null-keyword */
import grpc, { status } from 'grpc';
import InitService from '../service/InitService';
import * as xudrpc from '../proto/xudrpc_pb';
import getGrpcError from './getGrpcError';

class GrpcInitService {
  public disabled = false;
  private initService?: InitService;

  constructor() {}

  public setInitService(initService: InitService) {
    this.initService = initService;
  }

  /**
   * Checks whether this service is ready to handle calls and sends an error to the client
   * caller if not ready.
   * @returns `true` if the service is ready, otherwise `false`
   */
  private isReady = (initService: InitService | undefined, callback: grpc.sendUnaryData<any>)
    : initService is InitService => {
    if (!initService) {
      const err = this.disabled ?
        { code: status.UNIMPLEMENTED, message: 'xud init service is disabled', name: 'DisabledError' } :
        { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' };
      callback(err, null);
      return false;
    }
    return true;
  }

  /**
   * See [[InitService.createNode]]
   */
  public createNode: grpc.handleUnaryCall<xudrpc.CreateNodeRequest, xudrpc.CreateNodeResponse> = async (call, callback) => {
    if (!this.isReady(this.initService, callback)) {
      return;
    }
    try {
      const { mnemonic, initializedLndWallets, initializedRaiden } = await this.initService.createNode(call.request.toObject());
      const response = new xudrpc.CreateNodeResponse();
      if (mnemonic) {
        response.setSeedMnemonicList(mnemonic);
      }
      response.setInitializedLndsList(initializedLndWallets);
      response.setInitializedRaiden(initializedRaiden);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[InitService.unlockNode]]
   */
  public unlockNode: grpc.handleUnaryCall<xudrpc.UnlockNodeRequest, xudrpc.UnlockNodeResponse> = async (call, callback) => {
    if (!this.isReady(this.initService, callback)) {
      return;
    }
    try {
      const unlockNodeResult = await this.initService.unlockNode(call.request.toObject());
      const response = new xudrpc.UnlockNodeResponse();
      response.setUnlockedLndsList(unlockNodeResult.unlockedLndClients);
      response.setLockedLndsList(unlockNodeResult.lockedLndClients);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[InitService.restoreNode]]
   */
  public restoreNode: grpc.handleUnaryCall<xudrpc.RestoreNodeRequest, xudrpc.RestoreNodeResponse> = async (call, callback) => {
    if (!this.isReady(this.initService, callback)) {
      return;
    }
    try {
      const password = call.request.getPassword();
      const lndBackupsMap = call.request.getLndBackupsMap();
      const raidenDatabase = call.request.getRaidenDatabase_asU8();
      const seedMnemonicList = call.request.getSeedMnemonicList();
      const raidenDatabasePath = call.request.getRaidenDatabasePath();
      const xudDatabase = call.request.getXudDatabase_asU8();
      const { restoredLndWallets, restoredRaiden } = await this.initService.restoreNode({
        password,
        seedMnemonicList,
        raidenDatabasePath,
        xudDatabase,
        raidenDatabase,
        lndBackupsMap,
      });
      const response = new xudrpc.RestoreNodeResponse();
      response.setRestoredLndsList(restoredLndWallets);
      response.setRestoredRaiden(restoredRaiden);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }
}

export default GrpcInitService;
