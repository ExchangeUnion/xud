/**
 * The configurable options for the connext client.
 */
export type ConnextClientConfig = {
  disable: boolean;
  host: string;
  port: number;
  webhookhost: string;
  webhookport: number;
};

/** General information about the state of this connext client. */
export type ConnextInfo = {
  status: string;
  error?: string;
  address?: string;
  chain?: string;
  version?: string;
};

/**
 * The connext version.
 */
export type ConnextVersion = {
  version: string;
};

/**
 * The payload for tokenPayment call.
 */
export type TokenPaymentRequest = {
  type: "HashlockTransfer";
  channelAddress: string;
  amount: string;
  assetId: string;
  details: {
    lockHash: string;
    expiry: "0";
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

/**
 * The response for initWallet call.
 */
export type ConnextInitWalletResponse = { success: boolean };

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
  txhash: string;
};

/**
 * The response for deposit call.
 */
export type ConnextDepositResponse = {
  txhash: string;
};

/**
 * The response for hashLockTransfer call.
 */
export type ConnextTransferStatus = {
  senderAppIdentityHash: string;
  receiverIdentifier: string;
  senderIdentifier: string;
  assetId: string;
  amount: string;
  lockHash: string;
  status: string;
  meta: {
    sender: string;
    timelock: string;
  };
  preImage?: string;
  expiry: {
    _hex: string;
  };
};

export type ExpectedIncomingTransfer = {
  rHash: string;
  units: number;
  expiry: number;
  tokenAddress: string;
  paymentId?: string;
  transferId?: string;
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
  timelock: number;
  units: number;
  paymentId: string;
  transferId: string;
};

export type OnchainTransferResponse = {
  txhash: string;
};
