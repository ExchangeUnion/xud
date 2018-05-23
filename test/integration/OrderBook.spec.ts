import path from 'path';
import GulpRunner from 'gulp-runner';
import { expect } from 'chai';
import uuidv1 from 'uuid/v1';

import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import OrderBook from '../../lib/orderbook/OrderBook';
import { orders } from '../../lib/types';

const gulpfile = path.resolve(__dirname, '../../dist/gulpfile.js');
const gulp = new GulpRunner(gulpfile);

describe('OrderBook', () => {
  let db: DB;
  let orderBook: OrderBook;

  before((done) => {
    gulp.on('log', log => console.log(`[GULP]: ${log.toString()}`));
    gulp.run('db.restart', { testDb: true }, async () => {
      const config = new Config(null);
      await config.load();

      db = new DB(config.testDb);
      await db.init();

      orderBook = new OrderBook({ internalmatching: false }, db);
      await orderBook.init();

      done();
    });
  });

  it('should have pairs and matchingEngines equivalent loaded', () => {
    expect(orderBook.pairs).to.be.an('array');
    orderBook.pairs.forEach((pair) => {
      expect(orderBook.matchingEngines).to.have.own.property(pair.id);
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

  after(async () => {
    await db.close();
  });
});
