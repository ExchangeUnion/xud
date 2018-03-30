const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('db.tables.restart', (done) => {
  runSequence('db.tables.drop', 'db.data.populate', done);
});

