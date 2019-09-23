/**
 * The configurable options for the raiden client.
 */
export type RaidenClientConfig = {
  disable: boolean;
  host: string;
  port: number;
};

/** General information about the state of this raiden client. */
export type RaidenInfo = {
  error?: string;
  address?: string;
  channels?: number;
  version?: string;
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

export type PaymentEvent = {
  event: string;
  payment_network_address: string;
  token_network_address: string
  identifier: number;
  amount?: number;
  target?: string
  initiator?: string;
  secret?: string;
  route?: string[];
  reason?: string;
  log_time: string;
};
