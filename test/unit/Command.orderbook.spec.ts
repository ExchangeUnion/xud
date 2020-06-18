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
  randomAmounts = false
): Order.AsObject[] => {
  assert(amount >= 1, 'amount must greater than 0');
  const randomNumber = () => {
    return Math.round(Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1);
  };
  return Array.from(Array(amount)).map(() => {
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
    const orders: Order.AsObject[] = createOrders(10000, 0.01216, 100000, true);
    const startTime = performance.now();
    createOrderbookSide(orders);
    const endTime = performance.now();
    const timeSpent = endTime - startTime;
    expect(timeSpent < 1000).to.equal(true);
  });

  it('precision 5', () => {
    const orders: Order.AsObject[] = createOrders(100, 0.01216, 100000)
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
      { price: 0.01216, quantity: 10000000 },
      { price: 0.01119, quantity: 11000000 },
      { price: 0.01118, quantity: 3000000 },
      { price: 0.01117, quantity: 4000000 },
      { price: 0.01116, quantity: 5000000 },
      { price: 0.01115, quantity: 6000000 },
      { price: 0.01114, quantity: 7000000 },
      { price: 0.01113, quantity: 18000000 },
    ]);
  });

  it('precision 3', () => {
    const orders: Order.AsObject[] = createOrders(100, 0.01216, 100000)
      .concat(createOrders(20, 0.011191, 100000))
      .concat(createOrders(90, 0.011187, 100000))
      .concat(createOrders(30, 0.011181, 100000))
      .concat(createOrders(40, 0.011171, 100000));
    expect(createOrderbookSide(orders, 3)).to.deep.equal([
      { price: 0.012, quantity: 10000000 },
      { price: 0.011, quantity: 18000000 },
    ]);
  });
});
