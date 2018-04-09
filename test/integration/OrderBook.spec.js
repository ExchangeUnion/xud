/* eslint-env mocha */
const path = require('path');
const GulpRunner = require('gulp-runner');
const { expect } = require('chai');
const Config = require('../../lib/Config');
const DB = require('../../lib/db/DB');
const OrderBook = require('../../lib/orderbook/OrderBook');
const utils = require('../../lib/utils/utils');

const gulpfile = path.resolve(__dirname, '../../gulpfile.js');
const gulp = new GulpRunner(gulpfile);

describe('OrderBook', () => {
  let db;
  let orderBook;

  before((done) => {
    gulp.on('log', log => console.log(log.toString())); // eslint-disable-line no-console
    gulp.run('db.tables.restart', { testDb: true }, async () => {
      const config = new Config();
      db = new DB(config.testDb);
      await db.init();
      orderBook = new OrderBook(db);
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
      id: utils.getGuid(), pairId: 'BTC/LTC', peerId: 1, quantity: 5, price: 55,
    });
  });

  after(async () => {
    await db.close();
  });
});

