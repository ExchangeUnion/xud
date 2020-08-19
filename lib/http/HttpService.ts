import { createHash } from 'crypto';
import { ConnextIncomingTransferRequest, ConnextPreimageRequest } from '../connextclient/types';
import serviceErrors from '../service/errors';
import Service from '../service/Service';

class HttpService {
  constructor(private service: Service) {}

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
        paymentId,
      } = incomingTransferRequest.data;
      const {
        lockHash,
        timelock: timelockString,
      } = incomingTransferRequest.data.transferMeta;
      const rHash = lockHash.slice(2);
      const timelock = parseInt(timelockString, 10);
      const units = parseInt(amountHex._hex, 16);
      await this.service.transferReceived({
        rHash,
        timelock,
        units,
        paymentId,
        tokenAddress: assetId,
      });
      return {};
    } else {
      throw serviceErrors.INVALID_REQUEST;
    }
  }

}

export default HttpService;
