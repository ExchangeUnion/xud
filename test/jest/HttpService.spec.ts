import HttpService from '../../lib/http/HttpService';
import Service from '../../lib/service/Service';

jest.mock('../../lib/service/Service');
const mockedService = <jest.Mock<Service>>(<any>Service);

const rHash = 'd92e2eb0e9118faedc5ce533b65737b33a88c187c10e74e6d8b1be34626ae892';
const preImage = 'd55dd2b285a815f9449d9e665ed61dd19663e08e9d4e84db621ca3e78082fabf';
const preimageRequest: any = { transfer: { transferResolver: { preImage: `0x${preImage}` } } };

describe('HttpService', () => {
  let httpService: HttpService;
  let service: Service;

  beforeEach(() => {
    service = new mockedService();
    service.providePreimage = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('provide preimage', async () => {
    httpService = new HttpService(service);
    await httpService.providePreimage(preimageRequest);
    expect(service.providePreimage).toHaveBeenCalledWith({
      rHash,
      preimage: preImage,
    });
  });
});
