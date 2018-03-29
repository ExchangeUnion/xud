const gulp = require('gulp');
const Config = require('../../../lib/Config');
const DB = require('../../../lib/db/DB');
const enums = require('../../../lib/constants/enums');

gulp.task('db.data.populate', async () => {
  const config = new Config();
  const db = new DB(config.db);
  await db.init();

  await Promise.all([
    db.Peer.bulkCreate([
      { nodeKey: '/xud/0.0.1', ipv4: '127.0.0.1', port: '3000' },
    ]),
    db.Currency.bulkCreate([
      { id: 'BTC' },
      { id: 'LTC' },
      { id: 'ZRX' },
      { id: 'GNT' },
    ]),
    db.Pair.bulkCreate([
      { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: enums.swapProtocols.LND },
      { baseCurrency: 'ZRX', quoteCurrency: 'GNT', swapProtocol: enums.swapProtocols.RAIDEN },
    ]),
  ]);

  await Promise.all([
    db.Order.bulkCreate([
      {
        pairId: 'BTC/LTC', makerPeerId: 1, side: enums.orderSides.BUY, quantity: 10.01, price: 59.9679,
      },
    ]),
  ]);

  db.close();
});

