import Service from '../service/Service';
import serviceErrors from '../service/errors';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';
import { TIMELOCK_BUFFER } from '../connextclient/ConnextClient';
import {
  ConnextPreimageRequest,
  ConnextIncomingTransferRequest,
} from '../connextclient/types';

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    const { secrethash, amount, token, expiration, chain_height } = resolveRequest;
    if (!secrethash || typeof secrethash !== 'string') {
      throw serviceErrors.INVALID_ARGUMENT('secrethash must be a non-empty string');
    }
    const secret = await this.service.resolveHash({
      amount,
      expiration,
      chain_height,
      rHash: secrethash.slice(2),
      tokenAddress: token,
    });
    return { secret };
  }

  public providePreimage = async (preimageRequest: ConnextPreimageRequest): Promise<any> => {
    if (
      preimageRequest.data && preimageRequest.data.newState
    ) {
      const { lockHash: rHash, preImage: preimage } = preimageRequest.data.newState;
      if (!rHash) {
        throw new Error('rHash is required');
      }
      if (!preimage) {
        throw new Error('preImage is required');
      }
      await this.service.providePreimage({
        rHash: rHash.slice(2),
        preimage: preimage.slice(2),
      });
      return { success: true };
    } else {
      return { success: false };
    }
  }

  public incomingTransfer = async (
    incomingTransferRequest: ConnextIncomingTransferRequest,
  ): Promise<any> => {
    const {
      amount: amountHex,
      assetId,
    } = incomingTransferRequest.data;
    const {
      lockHash,
      timelock: timelockHex,
    } = incomingTransferRequest.data.transferMeta;
    const rHash = lockHash.slice(2);
    const timelock = TIMELOCK_BUFFER + parseInt(timelockHex._hex, 16);
    const units = parseInt(amountHex._hex, 16);
    await this.service.transferReceived({
      rHash,
      timelock,
      units,
      tokenAddress: assetId,
    });
    return { success: true };
  }

}

export default HttpService;
