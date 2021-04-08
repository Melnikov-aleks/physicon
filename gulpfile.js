const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');

const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');

const htmlmin = require('gulp-htmlmin');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const sync = require('browser-sync').create();

function html() {
  return src('src/**/*.html')
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function styles() {
  return src('src/**/*.css')
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(dest('dist/'))
    .pipe(sync.stream());
}

function scripts() {
  return (
    src('src/**/*.js')
      .pipe(plumber())
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      // .pipe(uglify())
      .pipe(dest('dist/'))
  );
}

function clear() {
  return del('dist');
}

function serve(cb) {
  sync.init({
    server: './dist',
    open: true,
  });
  cb();
}

function reload(cb) {
  sync.reload();
  cb();
}

function watching() {
  watch('src/**/*.html', series(html, reload));
  watch('src/**/*.css', series(styles));
  watch('src/**/*.js', series(scripts, reload));
}

exports.clear = clear;
exports.default = series(clear, parallel(html, styles, scripts), serve, watching);
