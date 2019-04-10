import { expect } from 'chai';
import Swaps from '../../lib/swaps/Swaps';
import { SwapDeal } from '../../lib/swaps/types';
import { SwapPhase, SwapState, SwapRole } from '../../lib/constants/enums';
import { SwapRequestPacketBody } from '../../lib/p2p/packets';

describe('Swaps', () => {
  const quantity = 1000000;
  const price = 0.005;
  const takerCltvDelta = 144;
  const orderId = 'f8a85c66-7e73-43cd-9ac4-176ff4cc28a8';
  const rHash = '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2';
  const pairId = 'LTC/BTC';
  const peerPubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';

  /** A swap deal for a buy order. */
  const buyDeal: SwapDeal = {
    quantity,
    price,
    takerCltvDelta,
    orderId,
    rHash,
    pairId,
    peerPubKey,
    role: SwapRole.Maker,
    phase: SwapPhase.SwapCreated,
    state: SwapState.Active,
    localId: '1',
    proposedQuantity: quantity,
    isBuy: true,
    makerCurrency: 'LTC',
    takerCurrency: 'BTC',
    makerAmount: Swaps['UNITS_PER_CURRENCY']['LTC'] * quantity,
    takerAmount: Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price,
    createTime: 1540716251106,
  };

  const buyDealEth = {
    ...buyDeal,
    pairId: 'WETH/BTC',
    makerCurrency: 'WETH',
    takerCurrency: 'BTC',
    makerAmount: Swaps['UNITS_PER_CURRENCY']['WETH'] * quantity,
    takerAmount: Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price,
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

  const swapRequest: SwapRequestPacketBody = {
    takerCltvDelta,
    orderId,
    rHash,
    proposedQuantity: quantity,
    pairId: 'LTC/BTC',
  };

  it('should derive currencies for a buy order', () => {
    const { makerCurrency, takerCurrency } = Swaps['deriveCurrencies'](buyDeal.pairId, buyDeal.isBuy);
    expect(makerCurrency).to.equal(buyDeal.makerCurrency);
    expect(takerCurrency).to.equal(buyDeal.takerCurrency);
  });

  it('should derive currencies for a sell order', () => {
    const { makerCurrency, takerCurrency } = Swaps['deriveCurrencies'](sellDeal.pairId, sellDeal.isBuy);
    expect(makerCurrency).to.equal(sellDeal.makerCurrency);
    expect(takerCurrency).to.equal(sellDeal.takerCurrency);
  });

  it('should calculate swap amounts for a buy order', () => {
    const { makerAmount, takerAmount } = Swaps['calculateSwapAmounts'](
      buyDeal.quantity!, buyDeal.price, buyDeal.isBuy, buyDeal.pairId,
    );
    expect(makerAmount).to.equal(buyDeal.makerAmount);
    expect(takerAmount).to.equal(buyDeal.takerAmount);
  });

  it('should calculate swap amounts for a sell order', () => {
    const { makerAmount, takerAmount } = Swaps['calculateSwapAmounts'](
      sellDeal.quantity!, sellDeal.price, sellDeal.isBuy, sellDeal.pairId,
    );
    expect(makerAmount).to.equal(sellDeal.makerAmount);
    expect(takerAmount).to.equal(sellDeal.takerAmount);
  });

  it('should calculate swap amounts for a WETH buy order', () => {
    const { makerAmount, takerAmount } = Swaps['calculateSwapAmounts'](
      buyDealEth.quantity!, buyDealEth.price, buyDealEth.isBuy, buyDealEth.pairId,
    );
    expect(makerAmount).to.equal(buyDealEth.makerAmount);
    expect(takerAmount).to.equal(buyDealEth.takerAmount);
  });

  it(`should validate a good swap request`, () => {
    expect(Swaps.validateSwapRequest(swapRequest)).to.be.true;
  });

  it(`should flag a swap request with a non-positive proposed quantity`, () => {
    expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: 0 })).to.be.false;
    expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: -1 })).to.be.false;
  });

  it(`should flag a swap request with an rHash that is not 64 characters`, () => {
    expect(Swaps.validateSwapRequest({ ...swapRequest, rHash: 'notavalidhash' })).to.be.false;
  });
});
