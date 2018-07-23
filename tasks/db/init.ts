import uuidv1 from 'uuid/v1';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();

  const db = new DB(testDb ? config.testDb : config.db);
  await db.init();

  const orderBookRepository = new OrderBookRepository(db.models);
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

  db.close();
};
