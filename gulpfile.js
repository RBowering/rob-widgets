// TODO: Set up js/css minify

var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    browserify = require('browserify'),
    glob       = require('glob'),
    es         = require('event-stream'),
    babelify = require('babelify'),
    watch      = require('gulp-watch'),
    batch      = require('gulp-batch');


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

gulp.task('watch', function () {
    watch('./src/js/**/*.js', batch(function (events, done) {
        gulp.start('browserify', done);
    }));
});