var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var request = require('request');
var source = require('vinyl-source-stream');
var convertEncoding = require('gulp-convert-encoding');
var fs = require('fs');

gulp.task('prepare', function() {
    return gulp.src('./data.json')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('node_modules', function() {
    return gulp.src(['./node_modules/**/*'])
        .pipe(gulp.dest('./dist/node_modules/'));
});

gulp.task('public', function() {
    return gulp.src(['./src/public/**/*'])
        .pipe(gulp.dest('./dist/public/'));
});

gulp.task('babel', function() {
    return gulp.src(['./src/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['prepare', 'public', 'babel', 'node_modules']);

gulp.task('default', ['build']);

