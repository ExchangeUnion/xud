import { createHash } from 'crypto';
import Service from '../service/Service';
import serviceErrors from '../service/errors';
import {
  ConnextPreimageRequest,
  ConnextIncomingTransferRequest,
  ConnextDepositConfirmedRequest,
} from '../connextclient/types';

class HttpService {
  constructor(private service: Service) {}

  public providePreimage = async (preimageRequest: ConnextPreimageRequest): Promise<object> => {
    if (preimageRequest.transfer) {
      const { preImage: preimage } = preimageRequest.transfer.transferResolver;
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
  };

  public incomingTransfer = async (incomingTransferRequest: ConnextIncomingTransferRequest): Promise<object> => {
    if (incomingTransferRequest.transfer) {
      const { transfer } = incomingTransferRequest;
      const { transferState, meta, assetId, balance } = transfer;
      const { routingId } = meta;
      const { lockHash, expiry: expiryString } = transferState;
      const rHash = lockHash.slice(2);
      const expiry = parseInt(expiryString, 10);
      const { amount } = balance;
      const units = BigInt(amount[0]);
      await this.service.transferReceived({
        rHash,
        expiry,
        units,
        routingId,
        tokenAddress: assetId,
      });
      return {};
    } else {
      throw serviceErrors.INVALID_REQUEST;
    }
  };

  public depositConfirmed = (depositConfirmedRequest: ConnextDepositConfirmedRequest): object => {
    if (depositConfirmedRequest.data && depositConfirmedRequest.data.hash) {
      this.service.depositConfirmed(depositConfirmedRequest.data.hash);
      return {};
    } else {
      throw serviceErrors.INVALID_REQUEST;
    }
  };
}

export default HttpService;
