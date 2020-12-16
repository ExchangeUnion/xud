import { getUnitConverter } from '../utils';

export const UNITS_PER_CURRENCY: { [key: string]: bigint } = {
  BTC: 1n,
  LTC: 1n,
  ETH: 10n ** 10n,
};

describe('UnitConverter', () => {
  const unitConverter = getUnitConverter();

  describe('amountToUnits', () => {
    test('converts BTC amount to units', () => {
      const amount = 99999999;
      expect(
        unitConverter.amountToUnits({
          amount,
          currency: 'BTC',
        }),
      ).toEqual(BigInt(amount));
    });

    test('converts ETH amount to units', () => {
      expect(
        unitConverter.amountToUnits({
          amount: 7500000,
          currency: 'ETH',
        }),
      ).toEqual(75000000000000000n);
    });

    test('throws error upon unknown currency', () => {
      expect.assertions(1);
      try {
        unitConverter.amountToUnits({
          amount: 123,
          currency: 'ABC',
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });
  });

  describe('unitsToAmount', () => {
    test('converts BTC units to amount', () => {
      const units = 99999999n;
      expect(
        unitConverter.unitsToAmount({
          units,
          currency: 'BTC',
        }),
      ).toEqual(Number(units));
    });

    test('converts ETH units to amount', () => {
      expect(
        unitConverter.unitsToAmount({
          units: 75000000000000000n,
          currency: 'ETH',
        }),
      ).toEqual(7500000);
    });

    test('throws error upon unknown currency', () => {
      expect.assertions(1);
      try {
        unitConverter.unitsToAmount({
          units: 123n,
          currency: 'ABC',
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });
  });

  describe('calculateInboundOutboundAmounts', () => {
    const pairId = 'LTC/BTC';
    const quantity = 250000;
    const bigQuantity = 250000n;
    const price = 0.01;
    const priceDivisor = 100n;

    test('calculate inbound and outbound amounts and currencies for a buy order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        outboundCurrency,
        outboundAmount,
        inboundUnits,
        outboundUnits,
      } = unitConverter.calculateInboundOutboundAmounts(quantity, price, true, pairId);
      expect(inboundCurrency).toEqual('LTC');
      expect(inboundAmount).toEqual(quantity);
      expect(inboundUnits).toEqual(UNITS_PER_CURRENCY['LTC'] * bigQuantity);
      expect(outboundCurrency).toEqual('BTC');
      expect(outboundAmount).toEqual(quantity * price);
      expect(outboundUnits).toEqual((UNITS_PER_CURRENCY['BTC'] * bigQuantity) / priceDivisor);
    });

    test('calculate inbound and outbound amounts and currencies for a sell order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        outboundCurrency,
        outboundAmount,
        inboundUnits,
        outboundUnits,
      } = unitConverter.calculateInboundOutboundAmounts(quantity, price, false, pairId);
      expect(inboundCurrency).toEqual('BTC');
      expect(inboundAmount).toEqual(quantity * price);
      expect(inboundUnits).toEqual((UNITS_PER_CURRENCY['BTC'] * bigQuantity) / priceDivisor);
      expect(outboundCurrency).toEqual('LTC');
      expect(outboundAmount).toEqual(quantity);
      expect(outboundUnits).toEqual(UNITS_PER_CURRENCY['LTC'] * bigQuantity);
    });

    test('calculate 0 outbound amount for a market buy order', () => {
      const { outboundCurrency, outboundAmount, outboundUnits } = unitConverter.calculateInboundOutboundAmounts(
        quantity,
        0,
        true,
        pairId,
      );
      expect(outboundCurrency).toEqual('BTC');
      expect(outboundAmount).toEqual(0);
      expect(outboundUnits).toEqual(0n);
    });

    test('calculate 0 inbound amount for a market sell order', () => {
      const { inboundCurrency, inboundAmount, inboundUnits } = unitConverter.calculateInboundOutboundAmounts(
        quantity,
        Number.POSITIVE_INFINITY,
        false,
        pairId,
      );
      expect(inboundCurrency).toEqual('BTC');
      expect(inboundAmount).toEqual(0);
      expect(inboundUnits).toEqual(0n);
    });

    test('calculate inbound and outbound amounts and currencies for a Connext order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        outboundCurrency,
        outboundAmount,
        inboundUnits,
        outboundUnits,
      } = unitConverter.calculateInboundOutboundAmounts(quantity, price, true, 'ETH/BTC');
      expect(inboundCurrency).toEqual('ETH');
      expect(inboundAmount).toEqual(quantity);
      expect(inboundUnits).toEqual(UNITS_PER_CURRENCY['ETH'] * bigQuantity);
      expect(outboundCurrency).toEqual('BTC');
      expect(outboundAmount).toEqual(quantity * price);
      expect(outboundUnits).toEqual((UNITS_PER_CURRENCY['BTC'] * bigQuantity) / priceDivisor);
    });
  });
});
