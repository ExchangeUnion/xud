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
 * The payload for the [[openChannel]] call.
 */
export type OpenChannelPayload = {
  partner_address: string;
  token_address: string;
  balance: number;
  settle_timeout: 100;
};

/**
 * A raiden payment channel.
 */
export type Channel = OpenChannelPayload & {
  channel_address: string;
  state: string;
};

/**
 * A raiden channel event.
 */
export type ChannelEvent = {
  event_type: string;
  identifier?: number;
  amount?: number;
};

/**
 * The response for tokenPayment call.
 */
export type TokenPaymentResponse = {
  secret: string;
};

/**
 * The payload for tokenPayment call.
 */
export type TokenPaymentRequest = {
  token_address: string,
  target_address: string,
  amount: number,
  secret_hash: string,
  identifier?: number,
};
