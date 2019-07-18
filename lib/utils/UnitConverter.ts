class UnitConverter {
  /** Number of smallest units per currency. */
  private UNITS_PER_CURRENCY: { [key: string]: number } = {
    BTC: 1,
    LTC: 1,
    WETH: 10 ** 10,
    DAI: 10 ** 10,
  };
  public init = () => {
    // TODO: Populate the mapping from the database (Currency.decimalPlaces).
    // this.UNITS_PER_CURRENCY = await fetchUnitsPerCurrencyFromDatabase();
  }

  public amountToUnits = (
    { currency, amount }:
    { currency: string, amount: number },
  ): number => {
    const unitsPerCurrency = this.UNITS_PER_CURRENCY[currency];
    if (!unitsPerCurrency) {
      throw new Error(`cannot convert ${currency} amount of ${amount} to units because units per currency was not found in the database`);
    }
    return Math.floor(amount * unitsPerCurrency);
  }

  public unitsToAmount = (
    { currency, units }:
    { currency: string, units: number },
  ): number => {
    const unitsPerCurrency = this.UNITS_PER_CURRENCY[currency];
    if (!unitsPerCurrency) {
      throw new Error(`cannot convert ${currency} units of ${units} to amount because units per currency was not found in the database`);
    }
    return Math.floor(units / unitsPerCurrency);
  }
}

export { UnitConverter };
