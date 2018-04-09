const gulp = require('gulp');
const { argv } = require('yargs');
const Config = require('../../../lib/Config');
const DB = require('../../../lib/db/DB');

gulp.task('db.data.clear', async () => {
  const config = new Config();
  const db = new DB(argv.testDb ? config.testDb : config.db);
  await db.init();

  const args = {
    where: {},
    truncate: true,
  };

  await db.Order.destroy(args);
  await db.Pair.destroy(args);
  await db.Currency.destroy(args);
  await db.Peer.destroy(args);

  db.close();
});
