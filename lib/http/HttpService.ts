import Service from '../service/Service';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    // TODO: add settle time out, etc
    const secret = await this.service.resolveHash({
      rHash: resolveRequest.secrethash.slice(2),
      amount: resolveRequest.amount,
      tokenAddress: resolveRequest.token,
      cltvDelta: resolveRequest.expiration,
    });
    return { secret };
  }
}

export default HttpService;
