const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssdeclsort = require('css-declaration-sorter');
const gcmq = require('gulp-group-css-media-queries');
const mode = require('gulp-mode')();
const browserSync = require('browser-sync');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const pug = require('gulp-pug');
const crypto = require('crypto');
const hash = crypto.randomBytes(8).toString('hex');
const replace = require('gulp-replace');
const tinypng = require("gulp-tinypng-extended");
const webp = require("gulp-webp");


const webpackStream = require("webpack-stream");
const webpack = require("webpack");

const webpackConfig = require("./webpack.config");


const bundleJs = (done) => {
  webpackStream(webpackConfig, webpack)
    .on('error', function (e) {
      console.error(e);
      this.emit('end');
    })
    .pipe(dest("dist/js"))
  done();
};

const compileSass = (done) => {
  const postcssPlugins = [
    autoprefixer({
      grid: "autoplace",
      cascade: false,
    }),
    cssdeclsort({order: 'alphabetical'})
  ];
  src('./src/scss/**/*.scss',{sourcemaps: true})
  .pipe(
    plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
  )
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(postcss(postcssPlugins))
  .pipe(mode.production(gcmq()))
  .pipe(dest('./dist/css',{ sourcemaps: './sourcemaps' }));
  done();
};

const buildServer = (done) => {
  browserSync.init({
    port: 8080,
    server: { baseDir: './dist/' },
    files: ["**/*"],
    open: true,
    watchOptions: {
      debounceDelay: 1000,
    },
  });
  done();
};

const browserReload = done => {
  browserSync.stream();
  done();
};

const compileEjs = done => {
  src(['./src/ejs/**/*.ejs', '!' + './src/ejs/**/_*.ejs'])
  .pipe(plumber(({ errorHandler: notify.onError('Error: <%= error.message %>') })))
  .pipe(ejs({
    pretty: true
  }))
  .pipe(ejs({}, {}, { ext: '.html'}))
  .pipe(rename({ extname: '.html'}))
  .pipe(dest('./dist'))
    .on("end", done);
};

const compilePug = done => {
  src(['./src/pug/**/*.pug', '!' + './src/pug/**/_*.pug'])
    .pipe(plumber(({ errorHandler: notify.onError('Error: <%= error.message %>') })))
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('./dist'))
      .on("end", done);
};

const tinyPing = done => {
  src("./src/img/**/*.{png,jpg,jpeg}")
    .pipe(plumber())
    .pipe(tinypng({
      key: "2kPxM1lrmDd3YzFzGNnC2DJZd73nlDb3",
      sigFile: "./src/img/.tinypng-sigs",
      log: true,
      summarise: true,
      sameDest: true,
      parallel: 10,
    }))
    .pipe(dest("./src/img"))
    .on("end", done);
};

const copyImages = done => {
  src(["./src/img/**/*"])
    .pipe(dest("./dist/img"))
    .on("end", done);
};

const generateWebp = done => {
  src("./dist/img/**/*.{png,jpg,jpeg}", {since: lastRun(generateWebp)})
    .pipe(webp())
    .pipe(dest("dist/img"));
  done();
};

const cacheBusting = done => {
  src('./dist/index.html')
    .pipe(replace(/\.(js|css)\?ver/g, ".$1?ver=" + hash))
    .pipe(replace(/\.(webp|jpg|jpeg|png|svg|gif)/g, ".$1?ver=" + hash))
    .pipe(dest('./dist'));
  done();
};

const watchFiles = () => {
  watch( './src/scss/**/*.scss', series(compileSass, browserReload))
  watch( './src/ejs/**/*.ejs', series(compileEjs, browserReload))
  watch( './src/pug/**/*.pug', series(compilePug, browserReload))
  watch( './src/js/**/*.js', series(bundleJs, browserReload))
  watch( './src/img/**/*', series(copyImages, generateWebp, browserReload))
};

module.exports = {
  sass: compileSass,
  ejs: compileEjs,
  pug: compilePug,
  cache: cacheBusting,
  bundle: bundleJs,
  tinypng: tinyPing,
  webp: generateWebp,
  image: series(tinyPing, generateWebp, copyImages),
  build: series(parallel(compileSass, bundleJs, compileEjs, compilePug), tinyPing, copyImages, generateWebp, cacheBusting),
  default: parallel(buildServer, watchFiles),
};




