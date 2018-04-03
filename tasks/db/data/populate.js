const gulp = require('gulp');
const Config = require('../../../lib/Config');
const DB = require('../../../lib/db/DB');
const enums = require('../../../lib/constants/enums');
const OrderBookRepository = require('../../../lib/orderbook/OrderBookRepository');
const P2PRepository = require('../../../lib/p2p/P2PRepository');

gulp.task('db.data.populate', async () => {
  const config = new Config();
  const db = new DB(config.db);
  await db.init();

  const orderBookRepository = new OrderBookRepository(db);
  const p2pRepository = new P2PRepository(db);


  await Promise.all([
    p2pRepository.addPeers([
      { nodeKey: '/xud/0.0.1', ipv4: '127.0.0.1', port: '3000' },
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
      pairId: 'BTC/LTC', peerId: 1, quantity: 10.01, price: 59.9679,
    },
  ]);


  db.close();
});

