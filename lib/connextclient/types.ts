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
  assetId: string;
  amount: string;
  lockHash: string;
  timelock: string;
  recipient: string;
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
  appId: string;
  preImage: string;
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
};

export type ConnextPreimageRequest = {
  id: string;
  data?: {
    type: string;
    amount: {
      _hex: string;
    };
    assetId: string;
    paymentId: string;
    sender: string;
    recipient: string;
    meta: {
      sender: string;
      recipient: string;
    };
    transferMeta: {
      preImage: string;
    };
  };
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
    transferId: string;
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
};

export type OnchainTransferResponse = {
  txhash: string;
};
