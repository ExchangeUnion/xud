/*
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();
  const loggers = Logger.createLoggers(config.instanceId);

  const dbConfig = testDb ? config.testDb : config.db;
  const db = new DB(dbConfig, loggers.db);
  await db.init();

  await db.truncate();
  db.close();
};
*/
