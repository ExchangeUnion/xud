import uuidv1 from 'uuid';
import assert from 'assert';
import { expect } from 'chai';
import { Order } from '../../lib/proto/xudrpc_pb';
import { createOrderbookSide } from '../../lib/cli/commands/orderbook';
import { performance } from 'perf_hooks';

const createOrders = (
  amount: number,
  price: number,
  quantity: number,
  randomAmounts = false,
): Order.AsObject[] => {
  assert(amount >= 1, 'amount must greater than 0');
  const randomNumber = () => {
    return Math.round(Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1);
  };
  return Array.from(Array(amount))
    .map(() => {
      const id = uuidv1();
      return {
        id,
        price: randomAmounts ? randomNumber() : price,
        quantity: randomAmounts ? randomNumber() : quantity,
        localId: id,
        pairId: 'LTC/BTC',
        peerPubKey: '123',
        createdAt: Date.now(),
        side: 0,
        isOwnOrder: false,
        hold: 0,
      };
    });
};

describe('Command.orderbook.createOrderbookSide', () => {
  it.skip('generates orderbook from 10000 million orders', () => {
    const orders: Order.AsObject[] = createOrders(10000, 0.012160, 100000, true);
    const startTime = performance.now();
    createOrderbookSide(orders);
    const endTime = performance.now();
    const timeSpent = endTime - startTime;
    expect(timeSpent < 1000).to.equal(true);
  });

  it('precision 5', () => {
    const orders: Order.AsObject[] = createOrders(100, 0.012160, 100000)
      .concat(createOrders(20, 0.011191, 100000))
      .concat(createOrders(90, 0.011187, 100000))
      .concat(createOrders(30, 0.011181, 100000))
      .concat(createOrders(40, 0.011171, 100000))
      .concat(createOrders(50, 0.011156, 100000))
      .concat(createOrders(60, 0.011151, 100000))
      .concat(createOrders(70, 0.011141, 100000))
      .concat(createOrders(80, 0.011131, 100000))
      .concat(createOrders(100, 0.011111, 100000));
    expect(createOrderbookSide(orders)).to.deep.equal([
      { price: 0.01216, depth: 121600 },
      { price: 0.01119, depth: 123090 },
      { price: 0.01118, depth: 33540 },
      { price: 0.01117, depth: 44680 },
      { price: 0.01116, depth: 55800 },
      { price: 0.01115, depth: 66900 },
      { price: 0.01114, depth: 77980 },
      { price: 0.01113, depth: 200140 },
    ]);
  });

  it('precision 3', () => {
    const orders: Order.AsObject[] = createOrders(100, 0.012160, 100000)
      .concat(createOrders(20, 0.011191, 100000))
      .concat(createOrders(90, 0.011187, 100000))
      .concat(createOrders(30, 0.011181, 100000))
      .concat(createOrders(40, 0.011171, 100000));
    expect(createOrderbookSide(orders, 3)).to.deep.equal([
      { price: 0.012, depth: 120000 },
      { price: 0.011, depth: 198000 },
    ]);
  });
});
