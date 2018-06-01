import uuidv1 from 'uuid/v1';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import enums from '../../lib/constants/enums';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();

  const db = new DB(testDb ? config.testDb : config.db);
  await db.init();

  const orderBookRepository = new OrderBookRepository(db);
  const p2pRepository = new P2PRepository(db);

  await Promise.all([
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
};
