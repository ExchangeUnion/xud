import gulp from 'gulp';
import tasks from './tasks';

gulp.task('db.dropTables', tasks.db.dropTables) ;
gulp.task('db.init', tasks.db.init);
gulp.task('db.restart', tasks.db.restart);
gulp.task('db.truncate', tasks.db.truncate);
