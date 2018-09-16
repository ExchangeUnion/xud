/** An enumeration of payment channel network clients that support token swaps. */
export enum SwapClients {
  LND,
  RAIDEN,
}

export enum OrderingDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum SwapDealRole {
  Taker = 0,
  Maker = 1,
}

export enum SwapDealPhase {
  SwapCreated = 0,
  SwapRequested = 1,
  SwapAgreed = 2,
  AmountSent = 3,
  AmountReceived = 4,
  SwapCompleted = 5,
}

export enum SwapDealState {
  Active = 0,
  Error = 1,
  Completed = 2,
}
