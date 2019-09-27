import Service from '../service/Service';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    const secret = await this.service.resolveHash({
      rHash: resolveRequest.secrethash.slice(2),
      amount: resolveRequest.amount,
      tokenAddress: resolveRequest.token,
      expiration: resolveRequest.expiration,
      chain_height: resolveRequest.chain_height,
    });
    return { secret };
  }
}

export default HttpService;
