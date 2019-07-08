import Service from '../service/Service';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    // TODO: add reveal_timeout, settle time out,  token, etc
    const secret = await this.service.resolveHash({
      rHash: resolveRequest.secrethash.slice(2),
      amount: resolveRequest.amount,
    });
    return { secret };
  }
}

export default HttpService;
