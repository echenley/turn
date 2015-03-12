'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var babelify = require('babelify');
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
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
// var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var exit = require('gulp-exit');

var sourceDir = './src';
var buildDir = './build';
var distDir = './dist';

function handleError() {
    var args = Array.prototype.slice.call(arguments);
    gutil.beep();
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file) {
    var props = watchify.args;
    props.entries = [sourceDir + '/jsx/' + file];
    props.debug = true;

    var bundler = browserify(props);
    bundler = watchify(bundler)
        .transform(reactify)
        .transform(babelify.configure({
            extensions: ['.jsx']
        }));

    function rebundle() {
        gutil.log('Rebundle...');
        var start = Date.now();
        return bundler.bundle()
            .on('error', handleError)
            .pipe(source('turn.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(buildDir))
            .pipe(notify(function() {
                console.log('Rebundle Complete [' + (Date.now() - start) + 'ms]');
            }));
    }

    bundler.on('update', rebundle);
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

gulp.task('svg', function() {
    return gulp.src('src/svg/*.svg')
        .pipe(svgmin())
        // .pipe(svgstore()) // inlines the svgs as <symbol>s
        .pipe(gulp.dest(buildDir +'/svg/'));
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

gulp.task('build', ['html', 'styles', 'svg'], function() {
    // NOTE: use boolean for watching/not watching
    return buildScript('turn.jsx');
});

gulp.task('dist', ['build'], function() {
    var assets = useref.assets();
    return gulp.src('build/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(distDir))
        .pipe(exit());
});

gulp.task('default', ['build', 'serve'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/svg/*.svg', ['svg']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
});