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

export enum SwapRole {
  Taker = 0,
  Maker = 1,
}

export enum SwapPhase {
  SwapCreated = 0,
  SwapRequested = 1,
  SwapAgreed = 2,
  AmountSent = 3,
  AmountReceived = 4,
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
  SwapFailure = 3,
  SwapSuccess = 4,
  MaxParserBufferSizeExceeded = 5,
  InvalidPacket = 6,
  UnknownPacketType = 7,
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
  PeerFailedSwap, // TODO: this generic reason can be replaced with the failure reason reported by the peer
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
}
