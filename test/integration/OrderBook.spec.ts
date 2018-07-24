import { expect } from 'chai';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBook from '../../lib/orderbook/OrderBook';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';
import { orders } from '../../lib/types';
import { StampedOrder } from '../../lib/types/orders';

describe('OrderBook', () => {
  let db: DB;
  let orderBook: OrderBook;
  let orderBookRepository: OrderBookRepository;

  before(async () => {
    const config = new Config();
    await config.load();

    db = new DB(config.testDb);
    await db.init();
    await db.truncate();

    orderBookRepository = new OrderBookRepository(db.models);
    const p2pRepository = new P2PRepository(db);

    await p2pRepository.addHost(
      { address: '127.0.0.1', port: 8885 },
    );
    await orderBookRepository.addCurrencies([
      { id: 'BTC' },
      { id: 'LTC' },
    ]);
    await orderBookRepository.addPairs([
      { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: SwapProtocol.LND },
    ]);

    orderBook = new OrderBook(db.models);
    await orderBook.init();
  });

  const getOrder = (order: orders.StampedOrder): orders.StampedOrder => {
    const ownOrders = orderBook.getOwnOrders(order.pairId, 0);
    let array: StampedOrder[];

    if (order.quantity > 0) {
      array = ownOrders.buyOrders;
    } else {
      array = ownOrders.sellOrders;
    }

    let result;

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
      expect(orderBook.matchingEngines).to.have.ownProperty(pair.id);
    });
  });

  it('should append two new ownOrder', async () => {
    const order: orders.OwnOrder = { pairId: 'BTC/LTC',  quantity: 5, price: 55 };
    await orderBook.addLimitOrder(order);
    await orderBook.addLimitOrder(order);
  });

  it('should fully match new ownOrder and remove matches', async () => {
    const order: orders.OwnOrder = { pairId: 'BTC/LTC', quantity: -6, price: 55 };
    const matches = await orderBook.addLimitOrder(order);
    expect(matches.remainingOrder).to.be.null;
    expect(getOrder(matches.matches[0].maker)).to.be.undefined;
    expect(getOrder(matches.matches[1].maker).quantity).to.be.equal(4);
  });

  it('should partially match new market order and discard remaining order', async () => {
    const order: orders.MarketOrder = { pairId: 'BTC/LTC', quantity: -10 };
    const matches = await orderBook.addMarketOrder(order);
    expect(matches.remainingOrder.quantity).to.be.greaterThan(order.quantity);
    expect((getOrder(matches.remainingOrder))).to.be.undefined;
  });

  after(async () => {
    await db.close();
  });
});
