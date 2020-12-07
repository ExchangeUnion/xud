import { UnitConverter } from '../../lib/utils/UnitConverter';

describe('UnitConverter', () => {
  const unitConverter = new UnitConverter();

  describe('amountToUnits', () => {
    test('converts BTC amount to units', () => {
      unitConverter.init();
      const amount = 99999999;
      expect(
        unitConverter.amountToUnits({
          amount,
          currency: 'BTC',
        })
      ).toEqual(amount);
    });

    test('converts WETH amount to units', () => {
      unitConverter.init();
      expect(
        unitConverter.amountToUnits({
          amount: 7500000,
          currency: 'WETH',
        })
      ).toEqual(75000000000000000);
    });

    test('throws error upon unknown currency', () => {
      expect.assertions(1);
      unitConverter.init();
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
      unitConverter.init();
      const units = 99999999;
      expect(
        unitConverter.unitsToAmount({
          units,
          currency: 'BTC',
        })
      ).toEqual(units);
    });

    test('converts WETH units to amount', () => {
      unitConverter.init();
      expect(
        unitConverter.unitsToAmount({
          units: 75000000000000000,
          currency: 'WETH',
        })
      ).toEqual(7500000);
    });

    test('throws error upon unknown currency', () => {
      expect.assertions(1);
      unitConverter.init();
      try {
        unitConverter.unitsToAmount({
          units: 123,
          currency: 'ABC',
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });
  });

  describe('calculateSwapAmounts', () => {
    const pairId = 'LTC/BTC';
    const quantity = 250000;
    const price = 0.01;

    test('calculate inbound and outbound amounts and currencies for a buy order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        outboundCurrency,
        outboundAmount,
        inboundUnits,
        outboundUnits,
      } = UnitConverter.calculateInboundOutboundAmounts(
        quantity,
        price,
        true,
        pairId
      );
      expect(inboundCurrency).toEqual('LTC');
      expect(inboundAmount).toEqual(quantity);
      expect(inboundUnits).toEqual(
        unitConverter['UNITS_PER_CURRENCY']['LTC'] * quantity
      );
      expect(outboundCurrency).toEqual('BTC');
      expect(outboundAmount).toEqual(quantity * price);
      expect(outboundUnits).toEqual(
        unitConverter['UNITS_PER_CURRENCY']['BTC'] * quantity * price
      );
    });

    test('calculate inbound and outbound amounts and currencies for a sell order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        outboundCurrency,
        outboundAmount,
        inboundUnits,
        outboundUnits,
      } = UnitConverter.calculateInboundOutboundAmounts(
        quantity,
        price,
        false,
        pairId
      );
      expect(inboundCurrency).toEqual('BTC');
      expect(inboundAmount).toEqual(quantity * price);
      expect(inboundUnits).toEqual(
        unitConverter['UNITS_PER_CURRENCY']['BTC'] * quantity * price
      );
      expect(outboundCurrency).toEqual('LTC');
      expect(outboundAmount).toEqual(quantity);
      expect(outboundUnits).toEqual(
        unitConverter['UNITS_PER_CURRENCY']['LTC'] * quantity
      );
    });

    test('calculate 0 outbound amount for a market buy order', () => {
      const {
        outboundCurrency,
        outboundAmount,
        outboundUnits,
      } = UnitConverter.calculateInboundOutboundAmounts(
        quantity,
        0,
        true,
        pairId
      );
      expect(outboundCurrency).toEqual('BTC');
      expect(outboundAmount).toEqual(0);
      expect(outboundUnits).toEqual(0);
    });

    test('calculate 0 inbound amount for a market sell order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        inboundUnits,
      } = UnitConverter.calculateInboundOutboundAmounts(
        quantity,
        Number.POSITIVE_INFINITY,
        false,
        pairId
      );
      expect(inboundCurrency).toEqual('BTC');
      expect(inboundAmount).toEqual(0);
      expect(inboundUnits).toEqual(0);
    });

    test('calculate inbound and outbound amounts and currencies for a Connext order', () => {
      const {
        inboundCurrency,
        inboundAmount,
        outboundCurrency,
        outboundAmount,
        inboundUnits,
        outboundUnits,
      } = UnitConverter.calculateInboundOutboundAmounts(
        quantity,
        price,
        true,
        'ETH/BTC'
      );
      expect(inboundCurrency).toEqual('ETH');
      expect(inboundAmount).toEqual(quantity);
      expect(inboundUnits).toEqual(
        unitConverter['UNITS_PER_CURRENCY']['ETH'] * quantity
      );
      expect(outboundCurrency).toEqual('BTC');
      expect(outboundAmount).toEqual(quantity * price);
      expect(outboundUnits).toEqual(
        unitConverter['UNITS_PER_CURRENCY']['BTC'] * quantity * price
      );
    });
  });
});
