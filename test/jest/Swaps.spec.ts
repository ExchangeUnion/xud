import LndClient from '../../lib/lndclient/LndClient';
import { SwapRequestPacketBody } from '../../lib/p2p/packets';
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

  describe('validateSwapRequest', () => {
    const quantity = 1000000;
    const takerCltvDelta = 144;
    const orderId = 'f8a85c66-7e73-43cd-9ac4-176ff4cc28a8';
    const rHash = '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2';

    const swapRequest: SwapRequestPacketBody = {
      takerCltvDelta,
      orderId,
      rHash,
      proposedQuantity: quantity,
      pairId: 'LTC/BTC',
    };

    it('should validate a good swap request', () => {
      expect(Swaps.validateSwapRequest(swapRequest)).toEqual(true);
    });

    it('should flag a swap request with a non-positive proposed quantity', () => {
      expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: 0 })).toEqual(false);
      expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: -1 })).toEqual(false);
    });

    it('should flag a swap request with an rHash that is not 64 characters', () => {
      expect(Swaps.validateSwapRequest({ ...swapRequest, rHash: 'notavalidhash' })).toEqual(false);
    });
  });
});
