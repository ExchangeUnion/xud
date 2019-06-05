import HttpService from '../../lib/http/HttpService';
import Service from '../../lib/service/Service';

jest.mock('../../lib/service/Service');
const mockedService = <jest.Mock<Service>><any>Service;

const secretHash = '2ea852a816e4390f1468b9b1389be14e3a965479beb2c97354a409993eb52e46';
const resolveRequest = {
  token: '0x4c354c76d5f73a63a90be776897dc81fb6238772',
  secret_hash: `0x${secretHash}`,
  amount: 1,
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

  test('removes 0x from RaidenResolveRequest\'s secret_hash', async () => {
    httpService = new HttpService(service);
    await httpService.resolveHashRaiden(resolveRequest);
    expect(service.resolveHash)
      .toHaveBeenCalledWith({
        amount: resolveRequest.amount,
        rHash: secretHash,
      });
  });

});
