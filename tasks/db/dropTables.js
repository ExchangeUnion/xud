const gulp = require('gulp');
const { argv } = require('yargs');
const Config = require('../../lib/Config');
const DB = require('../../lib/db/DB');

gulp.task('db.dropTables', async () => {
  const config = new Config();
  await config.load();

  const db = new DB(argv.testDb ? config.testDb : config.db);
  await db.init();

  await db.dropTables();
  db.close();
});

