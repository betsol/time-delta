//===============//
// CONFIGURATION //
//===============//

var pkg = require('./package.json');
var config = pkg.buildOptions;

//==============//
// DEPENDENCIES //
//==============//

var del = require('del');
var pathModule = require('path');
var argv = require('yargs').argv;
var browserify = require('browserify');
var source = require('vinyl-source-stream');

//-------------------//
// GULP DEPENDENCIES //
//-------------------//

var gulp = require('gulp');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var serverFactory = require('spa-server');

//================//
// INITIALIZATION //
//================//

// Environment configuration.
if ('undefined' !== typeof argv.dist) {
  config.dist = true;
}

// Global object to hold runtime data.
var runtime = {};

//=======//
// TASKS //
//=======//

//=======//
// CLEAN //
//=======//

gulp.task('clean', function (callback) {
  del([pathModule.join(config.targetDir, '/*')], callback);
});

//=======//
// BUILD //
//=======//

gulp.task('build', ['build:scripts']);

//----------------//
// BUILD: SCRIPTS //
//----------------//

gulp.task('build:scripts', function buildScripts() {

  var stream = browserify({
      standalone: 'timeDelta'
    })
    .add('./lib/time-delta.js')
    .bundle()
    .pipe(source('time-delta.js'))
  ;

  if (config.dist) {
    // Minifying code for production.
    stream
      // Actually minifying the code.
      .pipe(streamify(
        uglify()
      ))
    ;
  }

  return stream
    .pipe(gulp.dest(config.targetDir)
  );

});

//=======//
// MAIN //
//=======//

gulp.task('default', function (callback) {
  runSequence('clean', 'build', callback);
});

//============//
// WEB SERVER //
//============//

gulp.task('webserver', function () {

  serverFactory.create({
    path: './demos',
    serveStaticConfig: {
      index: 'index.html'
    }
  }).start();

});

//-------//
// START //
//-------//

gulp.task('start', function (callback) {
  runSequence('default', 'webserver', callback);
});

//===================//
// FUNCTIONS & UTILS //
//===================//

