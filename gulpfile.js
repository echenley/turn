var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var notify = require('gulp-notify');
var size = require('gulp-size');
var rename = require('gulp-rename');

// styles
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');

// scripts
var source = require('vinyl-source-stream');


var scriptsDir = './src/jsx';
var buildDir = './dist';


function handleError() {
    /* jshint ignore:start */
    var args = Array.prototype.slice.call(arguments);
    $.util.beep();
    $.notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
    /* jshint ignore:end */
}

function buildScript(file, watch) {
    var props = watchify.args;
    props.entries = [scriptsDir + '/' + file];
    props.debug = true;

    var bundler = browserify(props);
    if (watch) {
        bundler = watchify(bundler);
    }
    bundler.transform(reactify);

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', handleError)
            .pipe(source(file))
            .pipe(gulp.dest(buildDir + '/'));
    }

    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });
    return rebundle();
}

gulp.task('styles', function() {
    return gulp.src('src/styles/**/*')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            style: 'expanded'
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(buildDir))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(buildDir));
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest(buildDir))
        .pipe(size());
});

gulp.task('serve', function() {
    return gulp.src(buildDir)
        .pipe(webserver({
            livereload: true,
            port: 9000,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('build', ['html', 'styles'], function() {
    return buildScript('turn.jsx', false);
});

gulp.task('default', ['build', 'serve'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
    return buildScript('turn.jsx', true);
});