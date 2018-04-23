import path from 'path';
import GulpRunner from 'gulp-runner';
import { expect } from 'chai';
import uuidv1 from 'uuid/v1';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import OrderBook from '../../lib/orderbook/OrderBook';

const gulpfile = path.resolve(__dirname, '../../gulpfile.ts');
const gulp = new GulpRunner(gulpfile);

describe('OrderBook', () => {
  let db;
  let orderBook;

  before((done) => {
    gulp.on('log', log => console.log(`[GULP]: ${log.toString()}`));
    gulp.run('db.restart', { testDb: true }, async () => {
      const config = new Config(null);
      await config.load();

      db = new DB(config.testDb);
      await db.init();

      orderBook = new OrderBook(db, null);
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

  it('should append new order', async () => {
    await orderBook.addOrder({
      id: uuidv1(), pairId: 'BTC/LTC', peerId: 1, quantity: 5, price: 55,
    });
  });

  after(async () => {
    await db.close();
  });
});

