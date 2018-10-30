import { expect } from 'chai';
import Swaps from '../../lib/swaps/Swaps';
import { SwapDeal } from '../../lib/swaps/types';
import Logger, { Level } from '../../lib/Logger';
import { SwapPhase, SwapState, SwapRole } from '../../lib/types/enums';

const loggers = Logger.createLoggers(Level.Warn);

describe('Swaps', () => {
  const quantity = 0.01;
  const price = 0.005;

  /** A swap deal where we are the taker. */
  const takerDeal: SwapDeal = {
    quantity,
    price,
    role: SwapRole.Taker,
    phase: SwapPhase.SwapCreated,
    state: SwapState.Active,
    peerPubKey: '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8',
    orderId: 'f8a85c66-7e73-43cd-9ac4-176ff4cc28a8',
    localId: '1',
    proposedQuantity: quantity,
    pairId: 'LTC/BTC',
    takerCurrency: 'LTC',
    makerCurrency: 'BTC',
    takerAmount: Swaps['SATOSHIS_PER_COIN'] * quantity,
    makerAmount: Swaps['SATOSHIS_PER_COIN'] * quantity * price,
    takerCltvDelta: 144,
    r_hash: '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2',
    createTime: 1540716251106,
  };

  /** A swap deal where we are the maker, mirrored from the taker deal for convenience. */
  const makerDeal = {
    ...takerDeal,
    role: SwapRole.Maker,
    takerCurrency: takerDeal.makerCurrency,
    makerCurrency: takerDeal.takerCurrency,
    takerAmount: takerDeal.makerAmount,
    makerAmount: takerDeal.takerAmount,
  };

  it(`should calculate swap amounts`, () => {
    expect(takerDeal.role).to.equal(SwapRole.Taker);
    expect(makerDeal.role).to.equal(SwapRole.Maker);

    const { baseCurrencyAmount, quoteCurrencyAmount } = Swaps['calculateSwapAmounts'](takerDeal.quantity!, takerDeal.price);
    expect(baseCurrencyAmount).to.equal(takerDeal.takerAmount);
    expect(quoteCurrencyAmount).to.equal(takerDeal.makerAmount);
    expect(baseCurrencyAmount).to.equal(makerDeal.makerAmount);
    expect(quoteCurrencyAmount).to.equal(makerDeal.takerAmount);
  });
});
