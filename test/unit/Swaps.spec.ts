import { expect } from 'chai';
import Swaps from '../../lib/swaps/Swaps';
import { SwapDeal } from '../../lib/swaps/types';
import Logger, { Level } from '../../lib/Logger';
import { SwapPhase, SwapState, SwapRole } from '../../lib/types/enums';

const loggers = Logger.createLoggers(Level.Warn);

describe('Swaps', () => {
  const quantity = 0.01;
  const price = 0.005;

  /** A swap deal for a buy order. */
  const buyDeal: SwapDeal = {
    quantity,
    price,
    role: SwapRole.Maker,
    phase: SwapPhase.SwapCreated,
    state: SwapState.Active,
    peerPubKey: '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8',
    orderId: 'f8a85c66-7e73-43cd-9ac4-176ff4cc28a8',
    localId: '1',
    proposedQuantity: quantity,
    isBuy: true,
    pairId: 'LTC/BTC',
    makerCurrency: 'LTC',
    takerCurrency: 'BTC',
    makerAmount: Swaps['SATOSHIS_PER_COIN'] * quantity,
    takerAmount: Swaps['SATOSHIS_PER_COIN'] * quantity * price,
    makerCltvDelta: 144,
    takerCltvDelta: 144,
    r_hash: '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2',
    createTime: 1540716251106,
  };

  /** A swap deal for a sell order, mirrored from the buy deal for convenience. */
  const sellDeal = {
    ...buyDeal,
    isBuy: false,
    takerCurrency: buyDeal.makerCurrency,
    makerCurrency: buyDeal.takerCurrency,
    takerAmount: buyDeal.makerAmount,
    makerAmount: buyDeal.takerAmount,
  };

  it('should derive currencies for a buy order', () => {
    const { makerCurrency, takerCurrency } = Swaps['deriveCurrencies'](buyDeal.pairId, buyDeal.isBuy);
    expect(makerCurrency).to.equal(buyDeal.makerCurrency);
    expect(takerCurrency).to.equal(buyDeal.takerCurrency);
  });

  it('should calculate swap amounts for a sell order', () => {
    const { makerCurrency, takerCurrency } = Swaps['deriveCurrencies'](sellDeal.pairId, sellDeal.isBuy);
    expect(makerCurrency).to.equal(sellDeal.makerCurrency);
    expect(takerCurrency).to.equal(sellDeal.takerCurrency);
  });

  it('should calculate swap amounts for a buy order', () => {
    const { makerAmount, takerAmount } = Swaps['calculateSwapAmounts'](buyDeal.quantity!, buyDeal.price, buyDeal.isBuy);
    expect(makerAmount).to.equal(buyDeal.makerAmount);
    expect(takerAmount).to.equal(buyDeal.takerAmount);
  });

  it('should calculate swap amounts for a sell order', () => {
    const { makerAmount, takerAmount } = Swaps['calculateSwapAmounts'](sellDeal.quantity!, sellDeal.price, sellDeal.isBuy);
    expect(makerAmount).to.equal(sellDeal.makerAmount);
    expect(takerAmount).to.equal(sellDeal.takerAmount);
  });
});
