const gulp = require('gulp');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const server = require('gulp-develop-server');

const paths = {
  styles: {
    files: './scss/**/*.scss',
    includePaths: ['./scss'],
    dest: './build/css',
  },
  javascripts: {
    files: './js/**/*.js',
    entry: './js/script.js',
    dest: './build/js/',
    output: 'bundle.js',
  },
  start: './app.js',
};

gulp.task('default', ['server:start', 'build'], () => {
  gulp.watch(paths.styles.files, ['sass']);
  gulp.watch(paths.javascripts.files, ['babel', 'lint']);
  gulp.watch(paths.start, ['server:restart']);
});

gulp.task('build', ['sass', 'babel']);

gulp.task('server:start', () => {
  server.listen({path: paths.start}, (error) => {
    if (error) {
      console.log(error);
    }
  });
});

gulp.task('server:restart', () => server.restart());

gulp.task('sass', () => {
  const sassy = sass({
    outputStyle: 'expanded',
    sourceComments: 'map',
    includePaths: paths.styles.includePaths
  });
  sassy.on('error', (error) => console.log(error));
  gulp.src(paths.styles.files)
    .pipe(sassy)
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('babel', () => {
  const webpacky = webpack({
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0'],
        },
      }]
    },
    output: {
      filename: paths.javascripts.output,
    }
  });
  webpacky.on('error', (error) => console.log(error));

  gulp.src(paths.javascripts.entry)
    .pipe(webpacky)
    .pipe(gulp.dest(paths.javascripts.dest));
});

gulp.task('lint', () => {
  return gulp.src(paths.javascripts.files)
    .pipe(jshint({esversion: 6}))
    .pipe(jshint.reporter('default'));
});
