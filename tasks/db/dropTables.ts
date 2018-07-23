import Config from '../../lib/Config';
import DB from '../../lib/db/DB';

export default async (testDb?: boolean) => {
  const config = new Config();
  await config.load();

  const db = new DB(testDb ? config.testDb : config.db);
  await db.init();

  await db.dropTables();
  db.close();
};
