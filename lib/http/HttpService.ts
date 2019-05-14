import Service from '../service/Service';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    const secret = await this.service.resolveHash({
      amount: resolveRequest.amount,
      rHash: resolveRequest.secret_hash,
    });
    return { secret };
  }
}

export default HttpService;
