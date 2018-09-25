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
