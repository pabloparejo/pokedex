'use strict';
var angularFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var vendorFiles = ['./node_modules/angular/angular.js', 
                   './node_modules/angular-ui-router/release/angular-ui-router.min.js'];

var cssFiles = ['../sass/main.scss']
var cssDest = '../dist/css/'
function clean(done) {
    del(['../dist/**/*.*'], {force: true});
    done();
}

function copyIndex(done) {
  var jsSources = gulp.src(vendorFiles, {read: false});
  var cssSources = gulp.src(cssDest + '**/*.css')
  return gulp.src('../index.html')
             .pipe(inject(jsSources, {name: 'vendor', ignorePath: 'node_modules', addPrefix: 'js/vendor'}))
             .pipe(inject(cssSources, {name: 'styles', ignorePath: '../dist/'}))
             .pipe(gulp.dest('../dist', {overwrite: true}));
}

function copyTemplates(done) {
  return gulp.src('../js/**/*.html')
             .pipe(rename({dirname: ''}))
             .pipe(gulp.dest('../dist/templates', {overwrite: true}));
}

function copyAppJs(done) {
  var options = {
    types: ['module', 'service', 'controller', 'directive', 'filter', 'routes', 'config']
  }
  return gulp.src('../js/**/*.js')
             .pipe(ngAnnotate())
             .pipe(angularFilesort())
             .pipe(concat('app.js'))
             .pipe(gulp.dest('../dist/js/', {overwrite: true}));
}

function copyVendor(done) {
  return gulp.src(vendorFiles, {base: './node_modules'})
             .pipe(gulp.dest('../dist/js/vendor', {overwrite: true}));
}

function processCSS(done) {
  return gulp.src(cssFiles)
             .pipe(sass().on('error', sass.logError))
             .pipe(gulp.dest(cssDest));
}

function build(done){
  return gulp.series(clean, copyTemplates, copyAppJs, copyVendor, processCSS, copyIndex)(done);
}

function watch(done) {
  return gulp.watch(['../js/**/*.js', '../sass/*.*', '../*.html', '../js/**/*.html'],
                    build);
}


gulp.task('default', build);
gulp.task('watch', gulp.series('default', watch));