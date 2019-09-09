/**
 * The configurable options for the raiden client.
 */
import { SwapClientStatus } from '../constants/enums';

export type RaidenClientConfig = {
  disable: boolean;
  host: string;
  port: number;
};

/** General information about the state of this raiden client. */
export type RaidenInfo = {
  status: SwapClientStatus;
  error?: string;
  address?: string;
  channels?: RaidenChannelCount;
  chain?: string;
  version?: string;
};

export type RaidenChannelCount = {
  active: number,
  settled: number,
  closed: number,
};

/**
 * The payload for the openChannel call.
 */
export type OpenChannelPayload = {
  partner_address: string;
  token_address: string;
  total_deposit: number;
  settle_timeout: number;
};

/**
 * A raiden payment channel.
 */
export type Channel = OpenChannelPayload & {
  channel_address: string;
  token_network_identifier: string;
  channel_identifier: number;
  /** The balance of the channel denominated in the smallest units supported by the token. */
  balance: number
  state: string;
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
  token_address: string,
  target_address: string,
  /** The amount of the payment request denominated in the smallest units supported by the token. */
  amount: number,
  secret_hash: string,
  identifier?: number,
  lock_timeout?: number,
};

export type RaidenResolveRequest = {
  /** The token address for the resolve request in hex. */
  token: string;
  /** The payment hash in hex with 0x prefix. */
  secrethash: string;
  /** The amount of the incoming payment pending resolution, in the smallest units supported by the token. */
  amount: number;
  /** The lock expiration for the incoming payment (absolute block number). */
  expiration: number;
  /** The current height of the chain */
  chain_height: number;
};

export type RaidenResolveResponse = {
  /** The preimage in hex format. */
  secret: string,
};
