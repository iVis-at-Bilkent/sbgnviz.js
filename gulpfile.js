var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

var paths = {
	sources: [
		"src/sbgn-extensions/*.js",
		"src/utilities/*.js"
	]
};

var version;

gulp.task('default', function() {

});

gulp.task('version', function() {
	//var now = new Date();
	//version = process.env['VERSION'];
	version = '1.0';
});

gulp.task('build', ['version'], function() {
	return gulp.src( paths.sources )
		//.pipe( replace('{{VERSION}}', version) )
		.pipe( concat('sbgnviz-core.js') )
		.pipe( gulp.dest('build') )
		.pipe( uglify({
			mangle: true,
			preserveComments: 'some'
		}) )
		.pipe( concat('sbgnviz-core.min.js') )
		.pipe( gulp.dest('build') );
});

gulp.task('clean', function() {
	return gulp.src(['build'])
		.pipe( clean({ read: false }) );
});


// TODO inject: js into debug.html
gulp.task('make', ['clean', 'build']);
