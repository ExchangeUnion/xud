import Service from '../service/Service';
import serviceErrors from '../service/errors';
import { RaidenResolveRequest, RaidenResolveResponse } from '../raidenclient/types';

type ConnextPreimageRequest = {
  id: string;
  data: {
    newState: {
      lockHash: '0x88a2a1f394d7af4c2d403d7f02686451824f96c2829a24cf277b07b1633b17f0';
      preImage: '0x358a4db68d6210ec55c80315acb10923738152bee25342fd02de9b220a5f793e';
    };
  }
};

type CoinTransfer = {
  amount: {
    _hex: string;
  };
  to: string;
};

type ConnextIncomingTransferRequest = {
  id: string;
  data: {
    appInstance: {
      latestState: {
        lockHash: string;
        timelock: {
          _hex: string;
        };
        coinTransfers: CoinTransfer[];
      };
      singleAssetTwoPartyCoinTransferInterpreterParams: {
        tokenAddress: string;
      };
    };
  }
};

class HttpService {
  constructor(private service: Service) {}

  public resolveHashRaiden = async (resolveRequest: RaidenResolveRequest): Promise<RaidenResolveResponse> => {
    const { secrethash, amount, token, expiration, chain_height } = resolveRequest;
    if (!secrethash || typeof secrethash !== 'string') {
      throw serviceErrors.INVALID_ARGUMENT('secrethash must be a non-empty string');
    }
    const secret = await this.service.resolveHash({
      amount,
      expiration,
      chain_height,
      rHash: secrethash.slice(2),
      tokenAddress: token,
    });
    return { secret };
  }

  public providePreimage = async (preimageRequest: ConnextPreimageRequest): Promise<any> => {
    if (
      preimageRequest.data && preimageRequest.data.newState
    ) {
      const { lockHash: rHash, preImage: preimage } = preimageRequest.data.newState;
      if (!rHash) {
        throw new Error('rHash is required');
      }
      if (!preimage) {
        throw new Error('preImage is required');
      }
      this.service.providePreimage({
        rHash,
        preimage,
      });
      return { success: true };
    } else {
      return { success: false };
    }
  }

  public incomingTransfer = async (
    incomingTransferRequest: ConnextIncomingTransferRequest,
  ): Promise<any> => {
    const { appInstance } = incomingTransferRequest.data;
    const {
      latestState,
    } = appInstance;
    const { lockHash, timelock, coinTransfers } = latestState;
    const { tokenAddress } = appInstance.singleAssetTwoPartyCoinTransferInterpreterParams;
    const TIMELOCK_BUFFER = 100;
    const rHash = lockHash.slice(2);
    const timelockWithBuffer = TIMELOCK_BUFFER + parseInt(timelock._hex, 16);
    if (coinTransfers.length !== 2) {
      throw new Error('coinTransfers length must be 2');
    }
    const senderAmount = parseInt(coinTransfers[0].amount._hex, 16);
    const receiverAmount = parseInt(coinTransfers[1].amount._hex, 16);
    if (receiverAmount !== 0) {
      throw new Error('receiver amount must be 0');
    }
    this.service.transferReceived({
      tokenAddress,
      rHash,
      timelock: timelockWithBuffer,
      amount: senderAmount,
    });
    return { success: true };
  }
}

export default HttpService;
