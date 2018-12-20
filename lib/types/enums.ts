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
  PacketDataIntegrityError = 8,
}

export enum SwapFailureReason {
  /** Could not find the order specified by a swap request. */
  OrderNotFound,
  /** The order specified by a swap request is on hold for a different ongoing swap. */
  OrderOnHold,
  /** The swap request contained invalid data. */
  InvalidSwapRequest,
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
