import { Currency } from '../orderbook/types';

class UnitConverter {
  private decimalPlacesPerCurrency = new Map<string, number>();

  constructor(currencies: Currency[]) {
    currencies.forEach((currency) => {
      this.decimalPlacesPerCurrency.set(currency.id, currency.decimalPlaces);
    });
  }

  public setDecimalPlacesPerCurrency = (currency: string, decimalPlaces: number) => {
    this.decimalPlacesPerCurrency.set(currency, decimalPlaces);
  };

  /**
   * Calculates the incoming and outgoing currencies and amounts of subunits/satoshis for an order if it is swapped.
   * @param quantity The quantity of the order
   * @param price The price of the order
   * @param isBuy Whether the order is a buy
   * @returns An object with the calculated incoming and outgoing values. The quote currency
   * amount is returned as zero if the price is 0 or infinity, indicating a market order.
   */
  public calculateInboundOutboundAmounts = (quantity: number, price: number, isBuy: boolean, pairId: string) => {
    const [baseCurrency, quoteCurrency] = pairId.split('/');
    const baseCurrencyAmount = quantity;
    const quoteCurrencyAmount = price > 0 && price < Number.POSITIVE_INFINITY ? Math.round(quantity * price) : 0; // if price is zero or infinity, this is a market order and we can't know the quote currency amount
    const baseCurrencyUnits = this.amountToUnits({ currency: baseCurrency, amount: baseCurrencyAmount });
    const quoteCurrencyUnits = this.amountToUnits({ currency: quoteCurrency, amount: quoteCurrencyAmount });

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

  public amountToUnits = ({ currency, amount }: { currency: string; amount: number }): bigint => {
    const decimalPlaces = this.decimalPlacesPerCurrency.get(currency);
    if (!decimalPlaces) {
      throw new Error(
        `cannot convert ${currency} amount of ${amount} to units because decimal places per currency was not found in the database`,
      );
    }
    if (decimalPlaces < 8) {
      return BigInt(amount) / 10n ** (8n - BigInt(decimalPlaces));
    } else if (decimalPlaces > 8n) {
      return BigInt(amount) * 10n ** (BigInt(decimalPlaces) - 8n);
    } else {
      return BigInt(amount);
    }
  };

  public unitsToAmount = ({ currency, units }: { currency: string; units: bigint }): number => {
    const decimalPlaces = this.decimalPlacesPerCurrency.get(currency);
    if (!decimalPlaces) {
      throw new Error(
        `cannot convert ${currency} units of ${units} to units because decimal places per currency was not found in the database`,
      );
    }
    if (decimalPlaces < 8) {
      return Number(units) * 10 ** (8 - decimalPlaces);
    } else if (decimalPlaces > 8n) {
      return Number(units) / 10 ** (decimalPlaces - 8);
    } else {
      return Number(units);
    }
  };
}

export { UnitConverter };
