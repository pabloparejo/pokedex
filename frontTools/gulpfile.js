'use strict';
var gulp = require('gulp');
var del = require('del');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');

gulp.task('default',  gulp.series(clean, copyIndex, copyAppJs, copyVendor, processCSS));
gulp.task('watch', gulp.series('default', watch));

var vendor_files = ['./node_modules/angular/angular.js'];

function clean(done) {
    del(['../dist/**/*.*'], {force: true});
    done();
}

function copyIndex(done) {
  var sources = gulp.src(vendor_files, {read: false});
  return gulp.src('../index.html')
             .pipe(inject(sources, {name: 'vendor', ignorePath: 'node_modules', addPrefix: 'js/vendor'}))
             .pipe(gulp.dest('../dist', {overwrite: true}));
}

function copyAppJs(done) {
  return gulp.src('../js/**/*.js')
             .pipe(ngAnnotate())
             .pipe(gulp.dest('../dist/js/', {overwrite: true}));
}

function copyVendor(done) {
  return gulp.src(vendor_files, {base: './node_modules'})
             .pipe(gulp.dest('../dist/js/vendor', {overwrite: true}));
}

function processCSS(done) {
  return gulp.src('../sass/**/*.scss')
             .pipe(sass().on('error', sass.logError))
             .pipe(gulp.dest('../dist/css/'));
}

function watch(done) {
  return gulp.watch(['../js/*.*', '../sass/*.*', '../*.html'],
                    gulp.series(clean, copyIndex, copyAppJs, copyVendor, processCSS));
}