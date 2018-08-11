'use strict';
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var vendor_files = ['./node_modules/angular/angular.js', 
                    './node_modules/angular-ui-router/release/angular-ui-router.min.js'];

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

function copyTemplates(done) {
  return gulp.src('../js/**/*.html')
             .pipe(rename({dirname: ''}))
             .pipe(gulp.dest('../dist/templates', {overwrite: true}));
}

function copyAppJs(done) {
  return gulp.src('../js/**/*.js')
             .pipe(ngAnnotate())
             .pipe(concat('app.js'))
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

function build(done){
  return gulp.series(clean, copyIndex, copyTemplates, copyAppJs, copyVendor, processCSS)(done);
}

function watch(done) {
  return gulp.watch(['../js/**/*.js', '../sass/*.*', '../*.html', '../js/**/*.html'],
                    build);
}


gulp.task('default', build);
gulp.task('watch', gulp.series('default', watch));