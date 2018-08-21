export enum SwapProtocol {
  LND = 'LND',
  RAIDEN = 'RAIDEN',
}

export enum OrderingDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

// TODO: consider to replace CurrencyType with currencies.
export enum CurrencyType {
  BTC = 0,
  LTC = 1,
}

export enum SwapDealRole {
  Taker = 0,
  Maker = 1,
}
