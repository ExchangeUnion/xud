import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();
  const logger = new Logger(config.instanceId);
  const db = new DB(testDb ? config.testDb : config.db, logger);
  await db.init();

  await db.dropTables();
  db.close();
};
