import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBook from '../../lib/orderbook/OrderBook';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';
import Logger from '../../lib/Logger';
import { orders } from '../../lib/types';
import NodeKey from '../../lib/nodekey/NodeKey';

describe('OrderBook', () => {
  let db: DB;
  let orderBook: OrderBook;
  let orderBookRepository: OrderBookRepository;

  before(async () => {
    const config = new Config();
    await config.load();
    const loggers = Logger.createLoggers();

    db = new DB(config.testDb, loggers.db);

    const nodeKey = NodeKey.load(config.xudir);

    await db.init();
    await db.truncate();

    orderBookRepository = new OrderBookRepository(loggers.orderbook, db.models);
    const p2pRepository = new P2PRepository(loggers.p2p, db);

    await p2pRepository.addNode(
      { nodePubKey: nodeKey.nodePubKey, addresses: [] },
    );
    await orderBookRepository.addCurrencies([
      { id: 'BTC' },
      { id: 'LTC' },
    ]);
    await orderBookRepository.addPairs([
      { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: SwapProtocol.LND },
    ]);

    orderBook = new OrderBook(loggers.orderbook, db.models);
    await orderBook.init();
  });

  const getOwnOrder = (order: orders.StampedOrder): orders.StampedOwnOrder | undefined => {
    const ownOrders = orderBook.getOwnOrders(order.pairId, 0);
    let array: orders.StampedOwnOrder[];

    if (order.quantity > 0) {
      array = ownOrders.buyOrders as orders.StampedOwnOrder[];
    } else {
      array = ownOrders.sellOrders as orders.StampedOwnOrder[];
    }

    let result: orders.StampedOwnOrder | undefined;

    array.forEach((ownOrder) => {
      if (ownOrder.id === order.id) {
        result = ownOrder;
      }
    });

    return result;
  };

  it('should have pairs and matchingEngines equivalent loaded', () => {
    expect(orderBook.pairs).to.be.an('array');
    orderBook.pairs.forEach((pair) => {
      expect(orderBook.matchingEngines).to.have.key(pair.id);
    });
  });

  it('should append two new ownOrder', async () => {
    const order = { pairId: 'BTC/LTC', quantity: 5, price: 55 };
    await orderBook.addLimitOrder({ localId: uuidv1(), ...order });
    await orderBook.addLimitOrder({ localId: uuidv1(), ...order });
  });

  it('should fully match new ownOrder and remove matches', async () => {
    const order: orders.OwnOrder = { pairId: 'BTC/LTC', localId: uuidv1(), quantity: -6, price: 55 };
    const matches = await orderBook.addLimitOrder(order);
    expect(matches.remainingOrder).to.be.undefined;

    const firstMatch = matches.matches[0];
    const secondMatch = matches.matches[1];
    expect(firstMatch).to.not.be.undefined;
    expect(secondMatch).to.not.be.undefined;

    const firstMakerOrder = getOwnOrder(firstMatch.maker);
    const secondMakerOrder = getOwnOrder(secondMatch.maker);
    console.log(JSON.stringify(secondMatch));
    expect(firstMakerOrder).to.be.undefined;
    expect(secondMakerOrder).to.not.be.undefined;
    expect(secondMakerOrder!.quantity).to.equal(4);
  });

  it('should partially match new market order and discard remaining order', async () => {
    const order: orders.OwnMarketOrder = { pairId: 'BTC/LTC', localId: uuidv1(), quantity: -10 };
    const result = await orderBook.addMarketOrder(order);
    const { taker } = result.matches[0];
    expect(result.remainingOrder).to.be.undefined;
    expect(getOwnOrder(taker)).to.be.undefined;
  });

  after(async () => {
    await db.close();
  });
});
