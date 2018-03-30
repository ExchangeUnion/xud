const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('db.data.restart', (done) => {
  runSequence('db.data.clear', 'db.data.populate', done);
});
