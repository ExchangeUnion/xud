import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';

export default async (productionDb?: boolean) => {
  const config = new Config();
  await config.load();

  const dbName = productionDb ? config.db : config.testDb;
  const db = new DB(dbName);
  await db.init();

  const orderBookRepository = new OrderBookRepository(db.models);
  const p2pRepository = new P2PRepository(db);

  await orderBookRepository.addCurrencies([
    { id: 'BTC' },
    { id: 'LTC' },
    { id: 'ZRX' },
    { id: 'GNT' },
  ]);

  await Promise.all([,
    orderBookRepository.addPairs([
      { baseCurrency: 'BTC', quoteCurrency: 'LTC', swapProtocol: SwapProtocol.LND },
      { baseCurrency: 'ZRX', quoteCurrency: 'GNT', swapProtocol: SwapProtocol.RAIDEN },
    ]),
    p2pRepository.addHosts([
      { address: 'xud1.test.exchangeunion.com', port: 8885 },
      { address: 'xud2.test.exchangeunion.com', port: 8885 },
      { address: 'xud3.test.exchangeunion.com', port: 8885 },
    ]),
  ]);

  db.close();
};
