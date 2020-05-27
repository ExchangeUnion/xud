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

/**
 * The response for /config call.
 */
export type ConnextConfigResponse = {
  multisigAddress: string;
  natsClusterId: string;
  natsToken: string;
  nodeUrl: string;
  signerAddress: string;
  userPublicIdentifier: string;
  userIdentifier: string;
};

/**
 * The response for balance call.
 */
export type ConnextBalanceResponse = {
  freeBalanceOffChain: string;
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
 * The response for hashLockTransfer call.
 */
export type ConnextTransferStatus = {
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
  }
};

export type ConnextIncomingTransferRequest = {
  id: string;
  data?: {
    amount: {
      _hex: string;
    };
    appIdentityHash: string;
    assetId: string;
    meta: {
      recipient: string;
      sender: string;
      timelock: 200
    };
    sender: string;
    transferMeta: {
      lockHash: string;
      expiry: {
        _hex: string;
      };
      timelock: string;
    };
    type: string;
    paymentId: string,
    recipient: string;
  };
};

export type ProvidePreimageEvent = {
  rHash: string,
  preimage: string,
};

export type TransferReceivedEvent = {
  tokenAddress: string;
  rHash: string;
  timelock: number;
  units: number;
};
