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
export type TokenPaymentResponse = TokenPaymentRequest & {
  secret?: string;
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

export type RaidenResolveRequest = {
  /** The token address for the resolve request in hex. */
  token: string;
  /** The payment hash in hex with 0x prefix. */
  secrethash: string;
  /** The amount of the incoming payment pending resolution, in the smallest units supported by the token. */
  amount: number;
  // unused fields on the raiden request listed below, taken from raiden codebase
  // 'payment_identifier': secret_request_event.payment_identifier,
  // 'payment_sender': to_hex(secret_request_event.recipient),
  // 'expiration': secret_request_event.expiration,
  // 'payment_recipient': to_hex(raiden.address),
  // 'reveal_timeout': raiden.config['reveal_timeout'],
  // 'settle_timeout': raiden.config['settle_timeout'],
};

export type RaidenResolveResponse = {
  /** The preimage in hex format. */
  secret: string,
};
