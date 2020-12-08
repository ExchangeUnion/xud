const UNITS_PER_CURRENCY: { [key: string]: number } = {
  BTC: 1,
  LTC: 1,
  ETH: 10 ** 10,
  USDT: 10 ** -2,
  WETH: 10 ** 10,
  DAI: 10 ** 10,
  XUC: 10 ** 10,
};

class UnitConverter {
  /** Number of smallest units per currency. */
  private UNITS_PER_CURRENCY: { [key: string]: number } = UNITS_PER_CURRENCY;

  /**
   * Calculates the incoming and outgoing currencies and amounts of subunits/satoshis for an order if it is swapped.
   * @param quantity The quantity of the order
   * @param price The price of the order
   * @param isBuy Whether the order is a buy
   * @returns An object with the calculated incoming and outgoing values. The quote currency
   * amount is returned as zero if the price is 0 or infinity, indicating a market order.
   */
  public static calculateInboundOutboundAmounts = (
    quantity: number,
    price: number,
    isBuy: boolean,
    pairId: string,
  ) => {
    const [baseCurrency, quoteCurrency] = pairId.split('/');
    const baseCurrencyAmount = quantity;
    const quoteCurrencyAmount =
      price > 0 && price < Number.POSITIVE_INFINITY ? Math.round(quantity * price) : 0; // if price is zero or infinity, this is a market order and we can't know the quote currency amount
    const baseCurrencyUnits = Math.floor(baseCurrencyAmount * UNITS_PER_CURRENCY[baseCurrency]);
    const quoteCurrencyUnits = Math.floor(quoteCurrencyAmount * UNITS_PER_CURRENCY[quoteCurrency]);

    const inboundCurrency = isBuy ? baseCurrency : quoteCurrency;
    const inboundAmount = isBuy ? baseCurrencyAmount : quoteCurrencyAmount;
    const inboundUnits = isBuy ? baseCurrencyUnits : quoteCurrencyUnits;
    const outboundCurrency = isBuy ? quoteCurrency : baseCurrency;
    const outboundAmount = isBuy ? quoteCurrencyAmount : baseCurrencyAmount;
    const outboundUnits = isBuy ? quoteCurrencyUnits : baseCurrencyUnits;
    return {
      inboundCurrency,
      inboundAmount,
      inboundUnits,
      outboundCurrency,
      outboundAmount,
      outboundUnits,
    };
  };

  public init = () => {
    // TODO: Populate the mapping from the database (Currency.decimalPlaces).
    // this.UNITS_PER_CURRENCY = await fetchUnitsPerCurrencyFromDatabase();
  };

  public amountToUnits = ({ currency, amount }: { currency: string; amount: number }): number => {
    const unitsPerCurrency = this.UNITS_PER_CURRENCY[currency];
    if (!unitsPerCurrency) {
      throw new Error(
        `cannot convert ${currency} amount of ${amount} to units because units per currency was not found in the database`,
      );
    }
    return Math.floor(amount * unitsPerCurrency);
  };

  public unitsToAmount = ({ currency, units }: { currency: string; units: number }): number => {
    const unitsPerCurrency = this.UNITS_PER_CURRENCY[currency];
    if (!unitsPerCurrency) {
      throw new Error(
        `cannot convert ${currency} units of ${units} to amount because units per currency was not found in the database`,
      );
    }
    return Math.floor(units / unitsPerCurrency);
  };
}

export { UnitConverter };
