const gulp = require('gulp');
const { argv } = require('yargs');
const uuidv1 = require('uuid/v1');
const Config = require('../../lib/Config');
const DB = require('../../lib/db/DB');
const enums = require('../../lib/constants/enums');
const OrderBookRepository = require('../../lib/orderbook/OrderBookRepository');
const P2PRepository = require('../../lib/p2p/P2PRepository');

gulp.task('db.init', async () => {
  const config = new Config();
  await config.load();

  const db = new DB(argv.testDb ? config.testDb : config.db);
  await db.init();

  const orderBookRepository = new OrderBookRepository(db);
  const p2pRepository = new P2PRepository(db);

  await Promise.all([
    p2pRepository.addPeers([
      { address: '127.0.0.1', port: '8885' },
      { address: '127.0.0.2', port: '8885' },
      { address: '127.0.0.3', port: '8885' },
      { address: '127.0.0.4', port: '8885' },
      { address: '127.0.0.5', port: '8885' },
      { address: '127.0.0.1', port: '8886' },
      { address: '127.0.0.2', port: '8886' },
      { address: '127.0.0.3', port: '8886' },
      { address: '127.0.0.4', port: '8886' },
      { address: '127.0.0.5', port: '8886' },
    ]),
    orderBookRepository.addCurrencies([
      { id: 'BTC' },
      { id: 'LTC' },
      { id: 'ZRX' },
      { id: 'GNT' },
    ]),
    orderBookRepository.addPairs([
      { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: enums.swapProtocols.LND },
      { baseCurrency: 'ZRX', quoteCurrency: 'GNT', swapProtocol: enums.swapProtocols.RAIDEN },
    ]),
  ]);

  await orderBookRepository.addOrders([
    {
      id: uuidv1(), pairId: 'BTC/LTC', peerId: 1, quantity: 10.01, price: 59.9679, createdAt: new Date(),
    },
    {
      id: uuidv1(), pairId: 'BTC/LTC', peerId: 2, quantity: -2, price: 60, createdAt: new Date(),
    },
    {
      id: uuidv1(), pairId: 'BTC/LTC', peerId: 3, quantity: 3, price: 60, createdAt: new Date(),
    },
    {
      id: uuidv1(), pairId: 'BTC/LTC', peerId: 4, quantity: -8.5, price: 66, createdAt: new Date(),
    },
  ]);


  db.close();
});

