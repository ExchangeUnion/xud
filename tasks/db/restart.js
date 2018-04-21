const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('db.restart', (done) => {
  runSequence('db.dropTables', 'db.init', done);
});

