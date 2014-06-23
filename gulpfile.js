const LESS_ENTRY_FILE = './app/index.less';
const JS_ENTRY_FILE = './app/index.js';
const COMPILED_DIR = './app/compiled';

var path = require('path');
var vinyl_source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var gulp_less = require('gulp-less');
var gulp_uglify = require('gulp-uglify');
var gulp_minify_css = require('gulp-minify-css');
var replace_stream = require('replace-stream');

gulp.task( 'compile css', function(){
	gulp.src( LESS_ENTRY_FILE )
		.pipe( gulp_less({
			paths: [ path.join( __dirname, 'app' ) ]
		}))
		.pipe( gulp.dest( COMPILED_DIR ) );
});

gulp.task( 'compile js', function(){
	var w = watchify({
		entries: JS_ENTRY_FILE,
		insertGlobals: false,
		detectGlobals: false
	});
	w.transform('hbsfy');
	//w.transform('browserify-shim');
	var bundle = function(){
		return w.bundle()
			.pipe( replace_stream( 'require', 'requireClient' ) )
			.pipe( replace_stream( 'nequire', 'require' ) )
			.pipe( vinyl_source('index.js') )
			.pipe( gulp.dest( COMPILED_DIR ) );
	};
	w.on( 'update', bundle );
	w.on( 'error', function(){
		console.log('error', arguments);
	})
	return bundle();
});

gulp.task( 'minify', function(){
	gulp.src( COMPILED_DIR +'/**/*.js' )
		.pipe( gulp_uglify() )
		.pipe( gulp.dest( COMPILED_DIR ) );
	gulp.src( COMPILED_DIR +'/**/*.css')
		.pipe( gulp_minify_css({
			keepSpecialComments: 0
		}))
		.pipe( gulp.dest( COMPILED_DIR ) );
});

gulp.task( 'watch css', function(){
	gulp.watch( './app/index.less', ['compile css'] );
});

gulp.task( 'watch js', function(){
	gulp.watch( './app/index.js', ['compile js'] );
});

gulp.task( 'default', ['compile css', 'compile js', 'watch css', 'watch js'] );
