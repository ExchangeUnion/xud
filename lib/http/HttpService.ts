import Service from '../service/Service';
import serviceErrors from '../service/errors';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';
import { TIMELOCK_BUFFER } from '../connextclient/ConnextClient';
import {
  ConnextPreimageRequest,
  ConnextIncomingTransferRequest,
} from '../connextclient/types';
import { createHash } from 'crypto';

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

  public providePreimage = async (preimageRequest: ConnextPreimageRequest): Promise<object> => {
    if (
      preimageRequest.data && preimageRequest.data.transferMeta
    ) {
      const { preImage: preimage } = preimageRequest.data.transferMeta;
      if (!preimage) {
        throw serviceErrors.INVALID_ARGUMENT('preImage is missing');
      }
      const slicedPreimage = preimage.slice(2);
      const rHash = createHash('sha256').update(Buffer.from(slicedPreimage, 'hex')).digest('hex');
      console.log('created rHash is', rHash);
      await this.service.providePreimage({
        rHash,
        preimage: slicedPreimage,
      });
      return {};
    } else {
      throw serviceErrors.INVALID_REQUEST;
    }
  }

  public incomingTransfer = async (
    incomingTransferRequest: ConnextIncomingTransferRequest,
  ): Promise<object> => {
    if (incomingTransferRequest.data) {
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
      return {};
    } else {
      throw serviceErrors.INVALID_REQUEST;
    }
  }

}

export default HttpService;
