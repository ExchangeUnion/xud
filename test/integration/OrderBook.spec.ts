import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import tasks from '../../tasks';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import enums from '../../lib/constants/enums';
import OrderBook from '../../lib/orderbook/OrderBook';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import { db, orders } from '../../lib/types';
import P2PRepository from '../../lib/p2p/P2PRepository';

describe('OrderBook', () => {
  let db: DB;
  let orderBook: OrderBook;
  let orderBookRepository: OrderBookRepository;

  before(async () => {
    const config = new Config();
    await config.load();

    db = new DB(config.testDb);
    await db.init();

    orderBookRepository = new OrderBookRepository(db);
    const p2pRepository = new P2PRepository(db);

    await Promise.all([
      p2pRepository.addPeer(
        { address: '127.0.0.1', port: 8885 },
      ),
      orderBookRepository.addCurrencies([
        { id: 'BTC' },
        { id: 'LTC' },
      ]),
      orderBookRepository.addPairs([
        { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: enums.swapProtocols.LND },
      ]),
    ]);

    orderBook = new OrderBook({ internalmatching: true }, db);
    await orderBook.init();
  });

  async function getOrderQuantity(orderId: string): Promise<number> {
    const result = await db.models.Order.find({
      where: { id: orderId },
      raw: true,
      attributes: ['quantity'],
    }) as db.OrderInstance;
    return Number(result.quantity);
  }

  it('should have pairs and matchingEngines equivalent loaded', () => {
    expect(orderBook.pairs).to.be.an('array');
    orderBook.pairs.forEach((pair) => {
      expect(orderBook.matchingEngines).to.have.ownProperty(pair.id);
    });
  });

  it('should append new ownOrder', async () => {
    const order: orders.OwnOrder = { pairId: 'BTC/LTC',  quantity: 5, price: 55 };
    await orderBook.addOwnOrder(order);
  });

  it('should append new peerOrder', async () => {
    const order: orders.PeerOrder = { id: uuidv1(), pairId: 'BTC/LTC',  quantity: 5, price: 55, peerId: 1, invoice: 'dummyInvoice' };
    await orderBook.addPeerOrder(order);
  });

  it('should match new ownOrder and update matches', async () => {
    const order: orders.OwnOrder = { pairId: 'BTC/LTC', quantity: -6, price: 55 };
    const matches = await orderBook.addOwnOrder(order);
    expect(matches.remainingOrder).to.be.null;
    const firstMakerLeft = await getOrderQuantity(matches.matches[0].maker.id);
    expect(firstMakerLeft).to.be.equal(0);
    const secondMakerLeft = await getOrderQuantity(matches.matches[1].maker.id);
    expect(secondMakerLeft).to.be.equal(4);
  });

  after(async () => {
    await db.truncate();
    await db.close();
  });
});
