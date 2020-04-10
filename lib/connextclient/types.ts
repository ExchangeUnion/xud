/**
 * The configurable options for the connext client.
 */

import { PaymentState } from 'lib/swaps/SwapClient';

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
 * The response for channelBalance call.
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

export type PaymentHistoryItem = {
  rHash: string;
  status: PaymentState;
};
