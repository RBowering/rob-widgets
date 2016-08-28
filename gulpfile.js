// TODO: Set up js/css minify

var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    browserify = require('browserify'),
    glob       = require('glob'),
    es         = require('event-stream'),
    babelify   = require('babelify'),
    watch      = require('gulp-watch'),
    batch      = require('gulp-batch'),
    cleanCSS   = require('gulp-clean-css');


gulp.task('browserify', function(done) {

    glob('./src/js/app/**/*.js', function(err, files) {

        var tasks;

        if(err) done(err);

        tasks = files.map(function(entry) {


            return browserify({ entries: [entry] })
                .transform(babelify, {presets: ['es2015', 'react']})
                .bundle()
                .pipe(source(entry))
                .pipe(gulp.dest('./public/scripts'));

        });
        es.merge(tasks).on('end', done);
    });
});

gulp.task('minify-css', function() {
    return gulp.src('./src/css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function () {

    gulp.start('browserify');
    gulp.start('minify-css');

    watch('./src/js/**/*.js', batch(function (events, done) {
        gulp.start('browserify', done);
    }));

    watch('./src/css/**/*.css', batch(function (events, done) {
        gulp.start('minify-css', done);
    }));
});