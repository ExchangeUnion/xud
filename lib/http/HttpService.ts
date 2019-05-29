import Service from '../service/Service';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    const secret = await this.service.resolveHash({
      rHash: resolveRequest.secret_hash.slice(2),
      amount: resolveRequest.amount,
    });
    return { secret };
  }
}

export default HttpService;
