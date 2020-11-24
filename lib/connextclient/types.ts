/**
 * The configurable options for the connext client.
 */
export type ConnextClientConfig = {
  disable: boolean;
  host: string;
  port: number;
  webhookhost: string;
  webhookport: number;
  nodeUrl: string;
  nodeIdentifier: string;
};

/** General information about the state of this connext client. */
export type ConnextInfo = {
  status: string;
  error?: string;
  address?: string;
  chain?: string;
  version?: string;
};

/** Response for eth_blockNumber call  */
export type ConnextBlockNumberResponse = {
  result: string;
};

/**
 * The payload for tokenPayment call.
 */
export type ConnextTransferRequest = {
  type: "HashlockTransfer";
  channelAddress: string;
  amount: string;
  assetId: string;
  details: {
    lockHash: string;
    expiry: string;
  };
  recipient: string;
  meta: {
    routingId: string;
  };
  publicIdentifier: string;
};

/**
 * The response for errors.
 */
export type ConnextErrorResponse = { message: string };

export type ConnextConfig = {
  publicIdentifier: string;
  signerAddress: string;
  index: number;
};

/**
 * The response for /config call.
 */
export type ConnextConfigResponse = ConnextConfig[];

/**
 * The response for /channel call.
 */
export type ConnextChannelResponse = string[];

/**
 * The response for balance call.
 */
export type ConnextBalanceResponse = {
  freeBalanceOffChain: string;
  nodeFreeBalanceOffChain: string;
  freeBalanceOnChain: string;
};

/**
 * The response for hashLockTransfer call.
 */
export type ConnextTransferResponse = {
  channelAddress: string;
  transferId: string;
  routingId: string;
};

/**
 * The response for withdraw call.
 */
export type ConnextWithdrawResponse = {
  channelAddress: '0xa929dB0530daB525596f5d48Fb5C322fDa8A337B',
  transferId: '0xc2e4592d3fb6c02ee1d3b07bed83b5914f8ca084b0f91d6b80bf8107e58c9c38'
};

type ConnextRoutingPath = {
  recipient: string;
  recipientChainId: number;
  recipientAssetId: string;
};

export type ConnextTransfer = {
  channelFactoryAddress: string;
  assetId: string;
  chainId: number;
  channelAddress: string;
  balance: {
    amount: string[];
    to: string[];
  };
  initiator: string;
  responder: string;
  initialStateHash: string;
  transferDefinition: string;
  transferEncodings: string[];
  transferId: string;
  transferState: {
    lockHash: string;
    expiry: string;
  };
  transferTimeout: string;
  meta: {
    requireOnline: boolean;
    routingId: string;
    path: ConnextRoutingPath[];
    senderIdentifier?: string;
  };
  transferResolver?: {
    preImage?: string;
  };
};

export type TransfersByRoutingIdResponse = ConnextTransfer[];

export type ExpectedIncomingTransfer = {
  rHash: string;
  units: number;
  expiry: number;
  tokenAddress: string;
  routingId: string;
};

export type ConnextPreimageRequest = {
  channelAddress: string;
  channelBalance: {
    to: string[];
    amount: string[];
  };
  transfer: {
    channelFactoryAddress: string;
    assetId: string;
    chainId: string;
    channelAddress: string;
    balance: {
      amount: string[];
      to: string[];
    };
    initiator: string;
    responder: string;
    initialStateHash: string;
    transferDefinition: string;
    transferEncodings: string[];
    transferId: string;
    transferState: {
      lockHash: string;
      expiry: string;
    };
    transferTimeout: string;
    meta: {
      requireOnline: boolean;
      routingId: string;
      path: [
        {
          recipient: string;
          recipientChainId: number;
          recipientAssetId: string;
        }
      ];
    };
    transferResolver: {
      preImage: string;
    };
  };
  conditionType: string;
};

export type ConnextIncomingTransferRequest = {
  channelAddress: string;
  channelBalance: {
    to: string[];
    amount: string[];
  };
  transfer: {
    channelFactoryAddress: string;
    assetId: string; // TODO
    chainId: number; // TODO
    channelAddress: string;
    balance: {
      amount: string[]; // TODO
      to: string[];
    };
    initiator: string;
    responder: string;
    initialStateHash: string;
    transferDefinition: string;
    transferEncodings: string[];
    transferId: string; // TODO
    transferState: {
      lockHash: string; // TODO
      expiry: string; // TODO
    };
    transferTimeout: string; // TODO
    meta: {
      routingId: string; // TODO
    };
  };
  conditionType: string;
};

export type ConnextDepositConfirmedRequest = {
  id: string;
  data?: {
    amount: {
      _hex: string;
    };
    assetId: string;
    hash: string;
  };
};

export type ProvidePreimageEvent = {
  rHash: string;
  preimage: string;
};

export type TransferReceivedEvent = {
  tokenAddress: string;
  rHash: string;
  expiry: number;
  units: number;
  routingId: string;
};

export type OnchainTransferResponse = {
  txhash: string;
};
