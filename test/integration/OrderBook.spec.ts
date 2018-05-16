import path from 'path';
import GulpRunner from 'gulp-runner';
import { expect } from 'chai';
import uuidv1 from 'uuid/v1';

import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import OrderBook from '../../lib/orderbook/OrderBook';
import Pool, { PoolConfig } from '../../lib/p2p/Pool';

const gulpfile = path.resolve(__dirname, '../../dist/gulpfile.js');
const gulp = new GulpRunner(gulpfile);
let poolconfig:PoolConfig;

describe('OrderBook', () => {
  let db;
  let orderBook;

  before((done) => {
    gulp.on('log', log => console.log(`[GULP]: ${log.toString()}`));
    gulp.run('db.restart', { testDb: true }, async () => {

      console.log('DEBUG: 0');

      const config = new Config(null);
      await config.load();

      console.log('DEBUG: 1');

      db = new DB(config.testDb);
      await db.init();
      poolconfig = {
        listen:false,
        port:1234,
      };

      console.log('DEBUG: 2');


      const pool = new Pool(poolconfig);
      orderBook = new OrderBook(db, pool);
      await orderBook.init();

      console.log('DEBUG: 3');


      done();

      console.log('DEBUG: 4');

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
