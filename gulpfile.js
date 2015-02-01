var gulp = require('gulp'),
  less = require('gulp-less'),
  minify = require("gulp-mini-css"),
  autoprfixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  jsuglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  jade = require('gulp-jade'),
  imageop = require('gulp-image-optimization');


var paths = {
  src: {
    js: "src/js/**/*js",
    less: "src/less/**/*.less",
    jade: "src/jade/**/*.jade",
    img: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.gif', 'src/img/**/*.jpeg']
  },
  dest: {
    js: "build/js",
    less: "build/css",
    jade: "build",
    img: "build/img"
  }
};

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});


gulp.task("less", function() {
  return gulp.src(paths.src.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprfixer())
    .pipe(gulp.dest(paths.dest.less))
    .pipe(minify({
      ext: '.min.css'
    }))
    .pipe(gulp.dest(paths.dest.less))
    .pipe(connect.reload());

});

gulp.task("jade", function() {
  return gulp.src(paths.src.jade)
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(paths.dest.jade))
    .pipe(connect.reload());
});

gulp.task("js", function() {
  return gulp.src(paths.src.js)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(rename({
      extname: ".js"
    }))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(jsuglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(connect.reload());
});

gulp.task("image", function() {
  return gulp.src(paths.src.img)
    .pipe(plumber())
    .pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(paths.dest.img));
});

gulp.task("watch", function() {
  gulp.watch(paths.src.less, ['less']);
  gulp.watch(paths.src.js, ['js']);
  gulp.watch(paths.src.jade, ['jade']);
});

gulp.task('default', ["connect", "less", "jade", "js", "image", "watch"]);