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
  const rHash =
    '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2';
  const pairId = 'LTC/BTC';
  const peerPubKey =
    '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';

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
    makerAmount: quantity,
    takerAmount: quantity * price,
    makerUnits: Swaps['UNITS_PER_CURRENCY']['LTC'] * quantity,
    takerUnits: Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price,
    createTime: 1540716251106,
  };

  const buyDealEth = {
    ...buyDeal,
    pairId: 'WETH/BTC',
    makerCurrency: 'WETH',
    takerCurrency: 'BTC',
    makerAmount: quantity,
    takerAmount: quantity * price,
    makerUnits: Swaps['UNITS_PER_CURRENCY']['WETH'] * quantity,
    takerUnits: Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price,
  };

  /** A swap deal for a sell order, mirrored from the buy deal for convenience. */
  const sellDeal = {
    ...buyDeal,
    isBuy: false,
    takerCurrency: buyDeal.makerCurrency,
    makerCurrency: buyDeal.takerCurrency,
    takerAmount: buyDeal.makerAmount,
    makerAmount: buyDeal.takerAmount,
    takerUnits: buyDeal.makerUnits,
    makerUnits: buyDeal.takerUnits,
  };

  const swapRequest: SwapRequestPacketBody = {
    takerCltvDelta,
    orderId,
    rHash,
    proposedQuantity: quantity,
    pairId: 'LTC/BTC',
  };

  it('should calculate swap amounts and currencies for a buy order', () => {
    const {
      makerCurrency,
      makerAmount,
      takerCurrency,
      takerAmount,
      makerUnits,
      takerUnits,
    } = Swaps['calculateMakerTakerAmounts'](
      buyDeal.quantity!,
      buyDeal.price,
      buyDeal.isBuy,
      buyDeal.pairId
    );
    expect(makerAmount).to.equal(buyDeal.makerAmount);
    expect(takerAmount).to.equal(buyDeal.takerAmount);
    expect(makerUnits).to.equal(buyDeal.makerUnits);
    expect(takerUnits).to.equal(buyDeal.takerUnits);
    expect(makerCurrency).to.equal(buyDeal.makerCurrency);
    expect(takerCurrency).to.equal(buyDeal.takerCurrency);
  });

  it('should calculate swap amounts and currencies for a sell order', () => {
    const {
      makerCurrency,
      makerAmount,
      takerCurrency,
      takerAmount,
      makerUnits,
      takerUnits,
    } = Swaps['calculateMakerTakerAmounts'](
      sellDeal.quantity!,
      sellDeal.price,
      sellDeal.isBuy,
      sellDeal.pairId
    );
    expect(makerAmount).to.equal(sellDeal.makerAmount);
    expect(takerAmount).to.equal(sellDeal.takerAmount);
    expect(makerUnits).to.equal(sellDeal.makerUnits);
    expect(takerUnits).to.equal(sellDeal.takerUnits);
    expect(makerCurrency).to.equal(sellDeal.makerCurrency);
    expect(takerCurrency).to.equal(sellDeal.takerCurrency);
  });

  it('should calculate swap amounts and currencies for a WETH buy order', () => {
    const { makerCurrency, makerAmount, takerCurrency, takerAmount } = Swaps[
      'calculateMakerTakerAmounts'
    ](
      buyDealEth.quantity!,
      buyDealEth.price,
      buyDealEth.isBuy,
      buyDealEth.pairId
    );
    expect(makerAmount).to.equal(buyDealEth.makerAmount);
    expect(takerAmount).to.equal(buyDealEth.takerAmount);
    expect(makerCurrency).to.equal(buyDealEth.makerCurrency);
    expect(takerCurrency).to.equal(buyDealEth.takerCurrency);
  });

  it('should calculate inbound and outbound amounts and currencies for a buy order', () => {
    const {
      inboundCurrency,
      inboundAmount,
      outboundCurrency,
      outboundAmount,
      inboundUnits,
      outboundUnits,
    } = Swaps.calculateInboundOutboundAmounts(quantity, price, true, pairId);
    expect(inboundCurrency).to.equal('LTC');
    expect(inboundAmount).to.equal(quantity);
    expect(inboundUnits).to.equal(
      Swaps['UNITS_PER_CURRENCY']['LTC'] * quantity
    );
    expect(outboundCurrency).to.equal('BTC');
    expect(outboundAmount).to.equal(quantity * price);
    expect(outboundUnits).to.equal(
      Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price
    );
  });

  it('should calculate inbound and outbound amounts and currencies for a sell order', () => {
    const {
      inboundCurrency,
      inboundAmount,
      outboundCurrency,
      outboundAmount,
      inboundUnits,
      outboundUnits,
    } = Swaps.calculateInboundOutboundAmounts(quantity, price, false, pairId);
    expect(inboundCurrency).to.equal('BTC');
    expect(inboundAmount).to.equal(quantity * price);
    expect(inboundUnits).to.equal(
      Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price
    );
    expect(outboundCurrency).to.equal('LTC');
    expect(outboundAmount).to.equal(quantity);
    expect(outboundUnits).to.equal(
      Swaps['UNITS_PER_CURRENCY']['LTC'] * quantity
    );
  });

  it('should calculate 0 outbound amount for a market buy order', () => {
    const {
      outboundCurrency,
      outboundAmount,
      outboundUnits,
    } = Swaps.calculateInboundOutboundAmounts(quantity, 0, true, pairId);
    expect(outboundCurrency).to.equal('BTC');
    expect(outboundAmount).to.equal(0);
    expect(outboundUnits).to.equal(0);
  });

  it('should calculate 0 inbound amount for a market sell order', () => {
    const {
      inboundCurrency,
      inboundAmount,
      inboundUnits,
    } = Swaps.calculateInboundOutboundAmounts(
      quantity,
      Number.POSITIVE_INFINITY,
      false,
      pairId
    );
    expect(inboundCurrency).to.equal('BTC');
    expect(inboundAmount).to.equal(0);
    expect(inboundUnits).to.equal(0);
  });

  it('should calculate inbound and outbound amounts and currencies for a raiden order', () => {
    const {
      inboundCurrency,
      inboundAmount,
      outboundCurrency,
      outboundAmount,
      inboundUnits,
      outboundUnits,
    } = Swaps.calculateInboundOutboundAmounts(
      quantity,
      price,
      true,
      'WETH/BTC'
    );
    expect(inboundCurrency).to.equal('WETH');
    expect(inboundAmount).to.equal(quantity);
    expect(inboundUnits).to.equal(
      Swaps['UNITS_PER_CURRENCY']['WETH'] * quantity
    );
    expect(outboundCurrency).to.equal('BTC');
    expect(outboundAmount).to.equal(quantity * price);
    expect(outboundUnits).to.equal(
      Swaps['UNITS_PER_CURRENCY']['BTC'] * quantity * price
    );
  });

  it('should validate a good swap request', () => {
    expect(Swaps.validateSwapRequest(swapRequest)).to.be.true;
  });

  it('should flag a swap request with a non-positive proposed quantity', () => {
    expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: 0 }))
      .to.be.false;
    expect(Swaps.validateSwapRequest({ ...swapRequest, proposedQuantity: -1 }))
      .to.be.false;
  });

  it('should flag a swap request with an rHash that is not 64 characters', () => {
    expect(
      Swaps.validateSwapRequest({ ...swapRequest, rHash: 'notavalidhash' })
    ).to.be.false;
  });
});
