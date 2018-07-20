import uuidv1 from 'uuid/v1';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();

  const db = new DB(testDb ? config.testDb : config.db, config.instanceId);
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
      { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: SwapProtocol.LND },
      { baseCurrency: 'ZRX', quoteCurrency: 'GNT', swapProtocol: SwapProtocol.RAIDEN },
    ]),
  ]);

  await orderBookRepository.addOrders([
    {
      id: uuidv1(), pairId: 'BTC/LTC', quantity: 10.01, price: 59.9679, createdAt: new Date(),
    },
    {
      id: uuidv1(), pairId: 'BTC/LTC', quantity: -2, price: 60, createdAt: new Date(),
    },
    {
      id: uuidv1(), pairId: 'BTC/LTC', quantity: 3, price: 60, createdAt: new Date(),
    },
    {
      id: uuidv1(), pairId: 'BTC/LTC', quantity: -8.5, price: 66, createdAt: new Date(),
    },
  ]);

  db.close();
};
