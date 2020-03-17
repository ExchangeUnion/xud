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
 * The response for tokenPayment call.
 */
export type TokenPaymentResponse = TokenPaymentRequest & {
  secret?: string;
};

/**
 * The payload for tokenPayment call.
 */
export type TokenPaymentRequest = {
  tokenAddress: string;
  targetAddress: string;
  amount: number;
  secretHash: string;
  identifier?: number;
  lockTimeout?: number;
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
 * The response for initConnextClient call.
 */
export type ConnextInitClientResponse = {
  freeBalanceAddress: string,
  multisigAddress: string,
  natsClusterId: string,
  natsToken: string,
  nodeUrl: string,
  signerAddress: string,
  userPublicIdentifier: string,
};

/**
 * The response for channelBalance call.
 */
export type ConnextBalanceResponse = { freeBalance: string };

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
  success: boolean;
};