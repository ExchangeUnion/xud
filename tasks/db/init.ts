import uuidv1 from 'uuid/v1';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';
import { ContextLogger } from '../../lib/Logger';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();
  const logger = new ContextLogger(config.instanceId);

  const db = new DB(testDb ? config.testDb : config.db, logger);
  await db.init();

  const orderBookRepository = new OrderBookRepository(db.models, logger);
  const p2pRepository = new P2PRepository(db, logger);

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
