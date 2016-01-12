"use strict";

let gulp = require('gulp');
let connect = require('gulp-connect');
let open = require('gulp-open');
let browserify = require('browserify');
let reactify = require('reactify');
let source = require('vinyl-source-stream');
let concat = require('gulp-concat');


let config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        mainJs: './src/main.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist/'
    }
};

gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
    console.log(config.devBaseUrl+":"+config.port+"/");
    gulp.src('')
        .pipe(open({ uri: `${config.devBaseUrl}:${config.port}/`}));
});

gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js'])
});

gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(`${config.paths.dist}/scripts`))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(`${config.paths.dist}/css`))
});

gulp.task('default', ['html', 'js', 'css', 'open', 'watch']);