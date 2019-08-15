/** Order size limits denominated in satoshis. */
const limits: { [currency: string]: number } = {
  BTC : 42949,
  LTC : 50000,
  WETH : 2000000,
  DAI : 500000000,
};

export default limits;
