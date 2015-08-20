var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var request = require('request');
var source = require('vinyl-source-stream');
var fs = require('fs');

gulp.task('prepare', function() {
    var existed = fs.existsSync('./dist/data.csv');
    if (existed) {
        gutil.log('data.csv existed. download skipped...');
        return;
    }
    request('http://data.taipei.gov.tw/opendata/apply/file/NzExNEIyRUQtRDhFNS00OUZELTgxRjktRjQ3OTgwNkRCNjM1')
        .pipe(source('data.csv'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('node_modules', function() {
    return gulp.src(['./node_modules/**/*'])
        .pipe(gulp.dest('./dist/node_modules/'));
});

gulp.task('public', function() {
    return gulp.src(['./public/**/*'])
        .pipe(gulp.dest('./dist/public/'));
});

gulp.task('babel', function() {
    return gulp.src(['./src/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['prepare', 'public', 'babel', 'node_modules']);

gulp.task('default', ['build']);

