//--------------------------------------------------------------------------------------------------------------------
//  gulp serve - Load up a webserver referencing build folder (dest).  Use to test the build process has worked.
//  gulp serve:dev - Load up a webserver referencing development folder (app). Watch for css and html changes and live reload.
//  gulp serve:build - Load up a webserver referencing build folder. Will run build process also.
//  gulp build - Use this command to package assets up. ie, concat, minify etc.
//--------------------------------------------------------------------------------------------------------------------

// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    webpack = require('webpack-stream');
 
// File destinations.
var paths = new (function(){
  this.app = './app';
  this.dist = './dist';
  this.assets = this.app + '/assets';
  this.distAssets = this.dist + '/assets';
  this.cssFrom = this.app + '/scss';
  this.cssTo = this.assets + '/css';
  this.img = this.assets + '/img';
  this.fonts = this.assets + '/fonts';
  this.js = this.assets + '/js';
})();

// Module configs.
var configs = {
  autoprefixer: {
    browsers: ['> 5%', 'last 2 versions'],
    cascade: false
  }
};

//-----------------------------------------------------------------
//  Shared tasks.
//-----------------------------------------------------------------

// Compile sass.
gulp.task('sass', function() {
  return gulp.src(paths.cssFrom+'/**/*.scss')
  .pipe(plumber())
  .pipe(sass({
      includePaths: [
        './node_modules/angular-material'
      ]
    }))
  //.pipe(autoprefixer(configs.autoprefixer))
  //.pipe(pxtorem(configs.pxtorem))
  .pipe(gulp.dest(paths.cssTo))
  .pipe(browserSync.stream());
});

// Lint our JS
gulp.task('jshint', function() { 
  return gulp.src(paths.js + '/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Webpack.
gulp.task('webpack', function() {
  return gulp.src(paths.js + '/entry.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest(paths.js));
});

//-----------------------------------------------------------------
//  Development tasks.
//-----------------------------------------------------------------

// Fire up a web server.
gulp.task('serve:dev', ['webpack'], function() {
  browserSync.init({
      server: {
          baseDir: "./app/"
      }
  });  

  // Watch main scss.
  gulp.watch(paths.cssFrom+'/**/*.scss', ['sass']);

  // Watch JS for changes.
  gulp.watch(paths.js + '/ng/**/*.js', ['webpack']);  
  //gulp.watch(paths.js + '/*.js', ['jshint']);  
  
  // Watch main files and reload browser.
  gulp.watch([paths.app + '/*.html', paths.cssTo + '/*.css', paths.js + '/bundle.js']).on('change', browserSync.reload);
});

//-----------------------------------------------------------------
//  Production build.
//-----------------------------------------------------------------
gulp.task('serve', function() { 
  browserSync.init({
      server: {
          baseDir: "./dist/"
      }
  }); 
});

gulp.task('serve:build', ['build'], function() { 
  browserSync.init({
      server: {
          baseDir: "./dist/"
      }
  }); 
});

gulp.task('build-clean', function () {
  return gulp.src(paths.dist +'/*')
    .pipe(gulp.dest(paths.dist +'/'))
    .pipe(vinylPaths(del));
});

// Package up js, css and minify.
gulp.task('build-package', function () {
  var jsFilter = filter("**/*.js"),
      cssFilter = filter("**/*.css"),
      assets = useref.assets();
    
  return gulp.src(paths.app + '/*.html')
    .pipe(assets)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss(configs.minifyCss))
    .pipe(uncss(configs.uncss))           
    .pipe(cssFilter.restore())
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest(paths.dist));
});

// Copy the rest of the assets.
gulp.task('build-assets', function() {
  return gulp.src([paths.assets + '/**', '!'+ paths.assets + '/css/**', '!'+ paths.assets + '/img/**', '!'+ paths.assets + '/js/**'])
    .pipe(gulp.dest(paths.distAssets));
});

gulp.task('build', function(cb) {
  //runSequence(['build-clean', 'bower', 'sass'], ['fonts', 'build-images', 'build-package', 'build-assets', 'build-root'], 'defer-scripts', 'critical-css', 'build-html', cb);
});