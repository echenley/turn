'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var notify = require('gulp-notify');
var size = require('gulp-size');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var sourceDir = './src';
var buildDir = './build';
var distDir = './dist';

function handleError() {
    /* jshint ignore:start */
    var args = Array.prototype.slice.call(arguments);
    gutil.beep();
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
    /* jshint ignore:end */
}

function buildScript(file) {
    var props = watchify.args;
    props.entries = [sourceDir + '/jsx/' + file];
    props.debug = true;

    var bundler = browserify(props);
    bundler = watchify(bundler);
    bundler.transform(reactify);

    function rebundle() {
        var start = Date.now();
        return bundler.bundle()
            .on('error', handleError)
            .pipe(source('turn.js'))
            .pipe(gulp.dest(buildDir))
            .pipe(notify(function() {
                console.log('Rebundle Complete - ' + (Date.now() - start) + 'ms');
            }));
    }

    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });
    return rebundle();
}

gulp.task('styles', function() {
    return gulp.src('src/scss/**/*')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            style: 'expanded'
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(buildDir))
        .pipe(size());
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest(buildDir))
        .pipe(size());
});

gulp.task('serve', function() {
    return gulp.src('build')
        .pipe(webserver({
            livereload: true,
            port: 9000,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('dist', ['build'], function() {
    var assets = useref.assets();
    return gulp.src('build/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(distDir));
});

gulp.task('build', ['html', 'styles'], function() {
    return buildScript('turn.jsx');
});

gulp.task('default', ['build', 'serve'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
});