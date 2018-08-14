import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';
import { SwapProtocol } from '../../lib/types/enums';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';

export default async (productionDb?: boolean) => {
  const config = new Config();
  await config.load();
  const loggers = Logger.createLoggers(config.instanceId);

  const dbConfig = productionDb ? config.db : config.testDb;
  const db = new DB(dbConfig, loggers.db);
  await db.init();

  const orderBookRepository = new OrderBookRepository(loggers.orderbook, db.models);

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
  ]);

  db.close();
};
