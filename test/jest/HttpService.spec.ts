import HttpService from '../../lib/http/HttpService';
import Service from '../../lib/service/Service';
import { RaidenResolveRequest } from '../../lib/raidenclient/types';

jest.mock('../../lib/service/Service');
const mockedService = <jest.Mock<Service>><any>Service;

const token = '0x4c354c76d5f73a63a90be776897dc81fb6238772';
const expiration = 75;
const secretHash = '2ea852a816e4390f1468b9b1389be14e3a965479beb2c97354a409993eb52e46';
const resolveRequest: RaidenResolveRequest = {
  token,
  expiration,
  secrethash: `0x${secretHash}`,
  amount: 1,
  reveal_timeout: 50,
};

describe('HttpService', () => {
  let httpService: HttpService;
  let service: Service;

  beforeEach(() => {
    service = new mockedService();
    service.resolveHash = jest.fn().mockReturnValue('validSecret');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('removes 0x from RaidenResolveRequest\'s secrethash', async () => {
    httpService = new HttpService(service);
    await httpService.resolveHashRaiden(resolveRequest);
    expect(service.resolveHash)
      .toHaveBeenCalledWith({
        expiration,
        amount: resolveRequest.amount,
        rHash: secretHash,
        tokenAddress: token,
      });
  });

});
