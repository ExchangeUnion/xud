/**
 * The configurable options for the connext client.
 */
export type ConnextClientConfig = {
  disable: boolean;
  host: string;
  port: number;
};

/** General information about the state of this connext client. */
export type ConnextInfo = {
  status: string;
  error?: string;
  address?: string;
  channels?: ConnextChannelCount;
  chain?: string;
  version?: string;
};

export type ConnextChannelCount = {
  active: number;
  settled: number;
  closed: number;
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
 * The response for initChannel call.
 */
export type ConnextChannelConfig = {
  freeBalanceAddress: string,
  multisigAddress: string,
  natsClusterId: string,
  natsToken: string,
  nodeUrl: string,
  signerAddress: string,
  userPublicIdentifier: string,
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
  senderPublicIdentifier: string;
  receiverPublicIdentifier?: string;
  assetId: string;
  amount: string;
  lockHash: string;
  status: string;
  meta?: any;
};

export type ExpectedIncomingTransfer = {
  rHash: string;
  units: number;
  expiry: number;
  tokenAddress: string;
};

export type ConnextPreimageRequest = {
  id: string;
  data: {
    newState: {
      lockHash: '0x88a2a1f394d7af4c2d403d7f02686451824f96c2829a24cf277b07b1633b17f0';
      preImage: '0x358a4db68d6210ec55c80315acb10923738152bee25342fd02de9b220a5f793e';
    };
  }
};

export type ConnextIncomingTransferRequest = {
  id: string;
  data: {
    amount: {
      _hex: string;
    };
    assetId: string;
    meta: {
      recipient: string;
      sender: string;
    };
    transferMeta: {
      lockHash: string;
      timelock: {
        _hex: string;
      };
    };
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
