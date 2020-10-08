import Service from '../service/Service';
import serviceErrors from '../service/errors';
import {
  ConnextPreimageRequest,
  ConnextIncomingTransferRequest,
  ConnextDepositConfirmedRequest,
} from '../connextclient/types';
import { createHash } from 'crypto';

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
    if (incomingTransferRequest.transfer) {
      const transfer = incomingTransferRequest.transfer;
      const {
        transferState,
        meta,
        assetId,
        balance,
      } = transfer;
      const { routingId: paymentId } = meta;
      const { lockHash, expiry: timelockString } = transferState;
      const rHash = lockHash.slice(2);
      const timelock = parseInt(timelockString, 10);
      const { amount } = balance;
      const units = parseInt(amount[0]);
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

  public depositConfirmed = (
    depositConfirmedRequest: ConnextDepositConfirmedRequest,
  ): object => {
    if (depositConfirmedRequest.data && depositConfirmedRequest.data.hash) {
      this.service.depositConfirmed(depositConfirmedRequest.data.hash);
      return {};
    } else {
      throw serviceErrors.INVALID_REQUEST;
    }
  }

}

export default HttpService;
