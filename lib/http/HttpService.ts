import Service from '../service/Service';
import serviceErrors from '../service/errors';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

type ConnextPreimageRequest = {
  id: string;
  data: {
    newState: {
      lockHash: '0x88a2a1f394d7af4c2d403d7f02686451824f96c2829a24cf277b07b1633b17f0';
      preImage: '0x358a4db68d6210ec55c80315acb10923738152bee25342fd02de9b220a5f793e';
    };
  }
};

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
      console.log('rHash', rHash, 'and preimage', preimage);
      this.service.providePreimage({
        rHash,
        preimage,
      });
      return { success: true };
    } else {
      return { success: false };
    }
  }
}

export default HttpService;
