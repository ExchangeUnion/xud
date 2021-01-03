import { expect } from 'chai';
import { SwapRequestPacketBody } from '../../lib/p2p/packets';
import Swaps from '../../lib/swaps/Swaps';

describe('Swaps', () => {
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
    expect(Swaps.validateSwapRequest(swapRequest)).to.be.true;
  });

  it('should flag a swap request with a non-positive proposed quantity', () => {
    expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: 0 })).to.be.false;
    expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: -1 })).to.be.false;
  });

  it('should flag a swap request with an rHash that is not 64 characters', () => {
    expect(Swaps.validateSwapRequest({ ...swapRequest, rHash: 'notavalidhash' })).to.be.false;
  });
});
