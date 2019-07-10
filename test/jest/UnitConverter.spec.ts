import { UnitConverter } from '../../lib/utils/UnitConverter';

describe('UnitConverter', () => {

  describe('amountToUnits', () => {

    test('converts BTC amount to units', () => {
      const unitConverter = new UnitConverter();
      unitConverter.init();
      const amount = 99999999;
      expect(unitConverter.
        amountToUnits({
          amount,
          currency: 'BTC',
        },
      )).toEqual(amount);
    });

    test('converts WETH amount to units', () => {
      const unitConverter = new UnitConverter();
      unitConverter.init();
      expect(unitConverter.
        amountToUnits({
          amount: 7500000,
          currency: 'WETH',
        },
      )).toEqual(75000000000000000);
    });

    test('throws error upon unknown currency', () => {
      expect.assertions(1);
      const unitConverter = new UnitConverter();
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
      const unitConverter = new UnitConverter();
      unitConverter.init();
      const units = 99999999;
      expect(unitConverter.
        unitsToAmount({
          units,
          currency: 'BTC',
        },
      )).toEqual(units);
    });

    test('converts WETH units to amount', () => {
      const unitConverter = new UnitConverter();
      unitConverter.init();
      expect(unitConverter.
        unitsToAmount({
          units: 75000000000000000,
          currency: 'WETH',
        },
      )).toEqual(7500000);
    });

    test('throws error upon unknown currency', () => {
      expect.assertions(1);
      const unitConverter = new UnitConverter();
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
});
