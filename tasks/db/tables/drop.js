const gulp = require('gulp');
const Config = require('../../../lib/Config');
const DB = require('../../../lib/db/DB');

gulp.task('db.tables.drop', async () => {
  const config = new Config();
  const db = new DB(config.db);
  await db.init();

  await db.dropTables();

  db.close();
});

