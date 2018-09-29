import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import DB from '../../lib/db/DB';
import OrderBook from '../../lib/orderbook/OrderBook';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';
import Logger, { Level } from '../../lib/Logger';
import { orders } from '../../lib/types';
import NodeKey from '../../lib/nodekey/NodeKey';
import { SwapClients } from '../../lib/types/enums';

describe('OrderBook', () => {
  let db: DB;
  let orderBook: OrderBook;
  let orderBookRepository: OrderBookRepository;

  before(async () => {
    const loggers = Logger.createLoggers(Level.Warn);

    db = new DB(loggers.db);

    const nodeKey = NodeKey['generate']();

    await db.init();

    orderBookRepository = new OrderBookRepository(loggers.orderbook, db.models);
    const p2pRepository = new P2PRepository(loggers.p2p, db.models);

    await p2pRepository.addNode(
      { nodePubKey: nodeKey.nodePubKey, addresses: [] },
    );
    await orderBookRepository.addCurrencies([
      { id: 'BTC', swapClient: SwapClients.Lnd, decimalPlaces: 8 },
      { id: 'LTC', swapClient: SwapClients.Lnd, decimalPlaces: 8 },
    ]);
    await orderBookRepository.addPairs([
      { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
    ]);

    orderBook = new OrderBook(loggers.orderbook, db.models);
    await orderBook.init();
  });

  const getOwnOrder = (order: orders.StampedOwnOrder): orders.StampedOwnOrder | undefined => {
    const ownOrders = orderBook.getOwnOrders(order.pairId);
    const arr = order.isBuy ? ownOrders.buy : ownOrders.sell;

    for (const orderItem of arr) {
      if (orderItem.id === order.id) {
        return orderItem;
      }
    }

    return;
  };

  it('should have pairs and matchingEngines equivalent loaded', () => {
    orderBook.pairs.forEach((pair) => {
      expect(orderBook.matchingEngines).to.have.key(pair.id);
    });
  });

  it('should append two new ownOrder', async () => {
    const order = { pairId: 'LTC/BTC', quantity: 5, price: 55, isBuy: true };
    await orderBook.addLimitOrder({ localId: uuidv1(), ...order });
    await orderBook.addLimitOrder({ localId: uuidv1(), ...order });
  });

  it('should fully match new ownOrder and remove matches', async () => {
    const order = { pairId: 'LTC/BTC', localId: uuidv1(), quantity: 6, price: 55, isBuy: false };
    const matches = await orderBook.addLimitOrder(order);
    expect(matches.remainingOrder).to.be.undefined;

    const firstMatch = matches.matches[0];
    const secondMatch = matches.matches[1];
    expect(firstMatch).to.not.be.undefined;
    expect(secondMatch).to.not.be.undefined;

    const firstMakerOrder = getOwnOrder(<orders.StampedOwnOrder>firstMatch.maker);
    const secondMakerOrder = getOwnOrder(<orders.StampedOwnOrder>secondMatch.maker);
    expect(firstMakerOrder).to.be.undefined;
    expect(secondMakerOrder).to.not.be.undefined;
    expect(secondMakerOrder!.quantity).to.equal(4);
  });

  it('should partially match new market order and discard remaining order', async () => {
    const order = { pairId: 'LTC/BTC', localId: uuidv1(), quantity: 10, isBuy: false };
    const result = await orderBook.addMarketOrder(order);
    const { taker } = result.matches[0];
    expect(result.remainingOrder).to.be.undefined;
    expect(getOwnOrder(<orders.StampedOwnOrder>taker)).to.be.undefined;
  });

  it('should create, partially match, and remove an order', async () => {
    const order: orders.OwnOrder = { pairId: 'LTC/BTC', localId: uuidv1(), quantity: 10, price: 10, isBuy: true };
    await orderBook.addLimitOrder(order);
    const takerOrder: orders.OwnMarketOrder = { pairId: 'LTC/BTC', localId: uuidv1(), quantity: 5, isBuy: false };
    await orderBook.addMarketOrder(takerOrder);
    expect(() => orderBook.removeOwnOrderByLocalId(order.localId)).to.not.throw();
  });

  it('should not add a new own order with a duplicated localId', async () => {
    const order: orders.OwnOrder = { pairId: 'LTC/BTC', localId: uuidv1(), quantity: 10, price: 100, isBuy: false };

    expect(() => orderBook.addLimitOrder(order)).to.not.throw();

    expect(() => orderBook.addLimitOrder(order)).to.throw();

    expect(() => orderBook.removeOwnOrderByLocalId(order.localId)).to.not.throw();

    expect(() => orderBook.removeOwnOrderByLocalId(order.localId)).to.throw();

    expect(() => orderBook.addLimitOrder(order)).to.not.throw();

    expect(() => orderBook.addLimitOrder(order)).to.throw();
  });

  after(async () => {
    await db.close();
  });
});
