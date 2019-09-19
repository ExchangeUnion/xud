/** Order size limits denominated in satoshis. */
const limits: { [currency: string]: number } = {
  BTC: 100000,
  LTC: 15000000,
  WETH: 5000000,
  DAI: 1000000000,
};

export default limits;
