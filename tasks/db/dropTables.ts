import gulp from 'gulp';
import { argv } from 'yargs';

import Config from 'lib/Config';
import DB from 'lib/db/DB';

gulp.task('db.dropTables', async () => {
  const config = new Config(null);
  await config.load();

  const db = new DB(argv.testDb ? config.testDb : config.db);
  await db.init();

  await db.dropTables();
  db.close();
});

