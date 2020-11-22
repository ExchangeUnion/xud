/** An enumeration of payment channel network clients that support token swaps. */
export enum SwapClientType {
  Lnd = 0,
  Connext = 2,
}

export enum OrderingDirection {
  Desc = 'DESC',
  Asc = 'ASC',
}

export enum OrderSide {
  Buy,
  Sell,
  Both,
}

export enum Owner {
  Both,
  Own,
  Peer,
}

export enum XuNetwork {
  // real coins.
  MainNet = 'mainnet',

  // pre-defined testnet per currency (e.g. bitcoin: testnet3, litecoin: testnet4).
  TestNet = 'testnet',

  // coins are minted by Exchange Union.
  SimNet = 'simnet',

  // coins are minted privately. Seed nodes are not configurable.
  RegTest = 'regtest',
}

/**
 * Magic value per XU network, indicating wire msg origin network,
 * and used to seek to next msg when stream state is unknown.
 */
export const xuNetworkMagicVals = {
  [XuNetwork.MainNet]: 0xd9b4bef9,
  [XuNetwork.TestNet]: 0x0709110b,
  [XuNetwork.SimNet]: 0x12141c16,
  [XuNetwork.RegTest]: 0xdab5bffa,
};

/**
 * XU network per magic value.
 */
export const magicValsXuNetwork = {
  [xuNetworkMagicVals[XuNetwork.MainNet]]: XuNetwork.MainNet,
  [xuNetworkMagicVals[XuNetwork.TestNet]]: XuNetwork.TestNet,
  [xuNetworkMagicVals[XuNetwork.SimNet]]: XuNetwork.SimNet,
  [xuNetworkMagicVals[XuNetwork.RegTest]]: XuNetwork.RegTest,
};

export enum SwapRole {
  Taker = 0,
  Maker = 1,
  Internal = 2,
}

export enum SwapPhase {
  /** 0/5 The swap deal has been created locally. */
  SwapCreated = 0,
  /** 1/5 We've made a request to a peer to accept this swap. */
  SwapRequested = 1,
  /** 2/5 The terms of the swap have been agreed to, and we will attempt to execute it. */
  SwapAccepted = 2,
  /**
   * 3/5 We have made a request to the swap client to send payment according to the agreed terms.
   * The payment (and swap) could still fail due to no route with sufficient capacity, lack of
   * cooperation from the receiver or any intermediary node along the route, or an unexpected
   * error from the swap client.
   */
  SendingPayment = 3,
  /**
   * 4/5 We have completed our outgoing payment and retrieved the preimage which can be used to
   * settle the incoming payment locked by the same hash.
   */
  PreimageResolved = 5,
  /**
   * 5/5 We have received the agreed amount of the swap and released the preimage to the
   * receiving swap client so it can accept payment.
   */
  PaymentReceived = 4,
}

export enum SwapState {
  Active = 0,
  Error = 1,
  Completed = 2,
  /**
   * A swap that was executed but wasn't formally completed. This may occur as a result of xud
   * crashing late in the swap process, after htlcs for both legs of the swap are set up but
   * before the swap is formally complete.
   */
  Recovered = 3,
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
  /** When a swap fails due to exceeding time limits. */
  SwapTimeout = 7,
  /** When a swap fails due to unexpected or possibly malicious behavior. */
  SwapMisbehavior = 8,
  /**
   * The peer has behaved dishonestly during a swap in a way that strongly
   * suggests it is running modified malicious code.
   */
  SwapAbuse = 9,
  /**
   * The peer completed a swap that was delayed beyond the expected deadline
   * to complete or fail the swap deal, but the delay was not so long as to
   * preclude the possibility of latency or lag.
   */
  SwapDelay = 10,
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
  /** A swap client call failed for an unexpected reason. */
  UnexpectedClientError = 5,
  /** Received a swap packet from the peer with invalid data. */
  InvalidSwapPacketReceived = 6,
  /** The call to send payment failed. */
  SendPaymentFailure = 7,
  /** The swap resolver request was invalid. */
  InvalidResolveRequest = 8,
  /** The swap request attempts to reuse a payment hash. */
  PaymentHashReuse = 9,
  /** The swap timed out while we were waiting for it to complete execution. */
  SwapTimedOut = 10,
  /** The deal timed out while we were waiting for the peer to respond to our swap request. */
  DealTimedOut = 11,
  /** The swap failed due to an unrecognized error. */
  UnknownError = 12,
  /** The swap failed due to an error or unexpected behavior on behalf of the remote peer. */
  RemoteError = 13,
  /** The swap failed because of a system or xud crash while the swap was being executed. */
  Crash = 14,
  /** A swap was attempted between an invalid matching of orders. */
  InvalidOrders = 15,
  /** Our payment to the peer was rejected, either deliberately or due to an error. */
  PaymentRejected = 16,
  /** The swap failed due to insufficient balance. */
  InsufficientBalance = 17,
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

export enum AlertType {
  LowChannelBalance = 0,
  LowBalance = 1,
}

export enum BalanceSide {
  Remote = 0,
  Local = 1,
}
