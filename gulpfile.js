var gulp = require('gulp');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var derequire = require('gulp-derequire');
var version;

var browserifyOpts = {
  entries: './src/index.js',
  debug: true,
  standalone: 'sbgnviz'
};

var logError = function( err ){
  notifier.notify({ title: 'sbgnviz', message: 'Error: ' + err.message });
  gutil.log( gutil.colors.red('Error in watch:'), gutil.colors.red(err) );
};

gulp.task('build', function(){
  return browserify( browserifyOpts )
    .bundle()
    .on( 'error', logError )
    .pipe( source('sbgnviz.js') )
    .pipe( buffer() )
    .pipe( derequire() )
    .pipe( gulp.dest('.') )
});