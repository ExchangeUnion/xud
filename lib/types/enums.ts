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
