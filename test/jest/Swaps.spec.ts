import LndClient from '../../lib/lndclient/LndClient';
import Swaps from '../../lib/swaps/Swaps';

describe('Swaps', () => {
  describe('calculateLockBuffer', () => {
    const ltcMinutesPerBlock = LndClient['MINUTES_PER_BLOCK_BY_CURRENCY']['LTC'];
    const btcMinutesPerBlock = LndClient['MINUTES_PER_BLOCK_BY_CURRENCY']['BTC'];
    const ethMinutesPerBlock = 0.25;

    test('it calculates a lock buffer with BTC first leg and LTC second leg', async () => {
      expect(Swaps['calculateLockBuffer'](1152, ltcMinutesPerBlock, btcMinutesPerBlock)).toMatchSnapshot();
    });

    test('it calculates a lock buffer with LTC first leg and BTC second leg', async () => {
      expect(Swaps['calculateLockBuffer'](80, btcMinutesPerBlock, ltcMinutesPerBlock)).toMatchSnapshot();
    });

    test('it calculates a lock buffer with BTC first leg and WETH second leg', async () => {
      expect(Swaps['calculateLockBuffer'](100, ethMinutesPerBlock, btcMinutesPerBlock)).toMatchSnapshot();
    });

    test('it calculates a lock buffer with WETH first leg and BTC second leg', async () => {
      expect(Swaps['calculateLockBuffer'](80, btcMinutesPerBlock, ethMinutesPerBlock)).toMatchSnapshot();
    });
  });
});
