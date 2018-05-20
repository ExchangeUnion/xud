import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('db.restart', (done) => {
  runSequence('db.dropTables', 'db.init', done);
});
