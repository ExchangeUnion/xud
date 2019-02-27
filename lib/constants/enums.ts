/** An enumeration of payment channel network clients that support token swaps. */
export enum SwapClients {
  Lnd,
  Raiden,
}

export enum OrderingDirection {
  Desc = 'DESC',
  Asc = 'ASC',
}

export enum OrderSide {
  Buy,
  Sell,
}

export enum Network {
  MainNet = 'mainnet',
  TestNet = 'testnet',
  SimNet = 'simnet',
  RegTest = 'regtest',
}

/**
 * Magic value indicating wire msg origin network, and used to seek to next msg when stream state is unknown
 */
export enum NetworkMagic {
  MainNet = 0xd9b4bef9,
  TestNet = 0x0709110b,
  SimNet = 0x12141c16,
  RegTest = 0xdab5bffa,
}

export enum SwapRole {
  Taker = 0,
  Maker = 1,
}

export enum SwapPhase {
  /** The swap has been created locally. */
  SwapCreated = 0,
  /** The swap has been sent to a peer to request approval. */
  SwapRequested = 1,
  /** The terms of the swap have been agreed to, and we will attempt to execute it. */
  SwapAgreed = 2,
  /**
   * We have commanded lnd to send payment according to the agreed terms. The payment (and swap)
   * could still fail due to no route with sufficient capacity, lack of cooperation from the
   * receiver or any intermediary node along the route, or an unexpected error from lnd.
   */
  SendingAmount = 3,
  /** We have received the agreed amount of the swap, and the preimage is now known to both sides. */
  AmountReceived = 4,
  /** The swap has been formally completed and both sides have confirmed they've received payment. */
  SwapCompleted = 5,
}

export enum SwapState {
  Active = 0,
  Error = 1,
  Completed = 2,
}

export enum ReputationEvent {
  ManualBan = 0,
  ManualUnban = 1,
  PacketTimeout = 2,
  WireProtocolErr = 3,
  InvalidAuth = 4,
  SwapSuccess = 5,
  /** When a swap is accepted and is attempted to be executed but fails. */
  SwapFailure = 6,
  /** When a swap is accepted and then fails due to exceeding time limits. */
  SwapTimeout = 7,
  /** When a swap fails due to unexpected or possibly malicious behavior. */
  SwapMisbehavior = 8,
}

export enum SwapFailureReason {
  /** Could not find the order specified by a swap request. */
  OrderNotFound = 0,
  /** The order specified by a swap request is on hold for a different ongoing swap. */
  OrderOnHold = 1,
  /** The swap request contained invalid data. */
  InvalidSwapRequest = 2,
  /** We are not connected to both swap clients, or we are missing pub key identifiers for the peer's nodes. */
  SwapClientNotSetup = 3,
  /** Could not find a route to complete the swap. */
  NoRouteFound = 4,
  /** A call to lnd failed for an unexpected reason. */
  UnexpectedLndError = 5,
  /** Received a swap packet from the peer with invalid data. */
  InvalidSwapPacketReceived = 6,
  /** The call to lnd to send payment failed. */
  SendPaymentFailure = 7,
  /** The swap resolver request from lnd was invalid. */
  InvalidResolveRequest = 8,
  /** The swap request attempts to reuse a payment hash. */
  PaymentHashReuse = 9,
  /** The swap timed out while we were waiting for it to complete execution. */
  SwapTimedOut = 10,
  /** The deal timed out while we were waiting for the peer to respond to our swap request. */
  DealTimedOut = 11,
  /** The swap failed due to an unrecognized error. */
  UnknownError = 12,
}

export enum DisconnectionReason {
  ResponseStalling = 1,
  IncompatibleProtocolVersion = 2,
  UnexpectedIdentity = 3,
  ForbiddenIdentityUpdate = 4,
  ConnectedToSelf = 5,
  NotAcceptingConnections = 6,
  Banned = 7,
  AlreadyConnected = 8,
  Shutdown = 9,
  MalformedVersion = 10,
  AuthFailureInvalidTarget = 11,
  AuthFailureInvalidSignature = 12,
  WireProtocolErr = 13,
}
