/**
 * The configurable options for the connext client.
 */

export type ConnextClientConfig = {
  disable: boolean;
  ethProviderUrl: string;
  nodeUrl: string;
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


