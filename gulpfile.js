'use strict';

const gulp          = require('gulp'),
      clean         = require('gulp-clean'),
      surge         = require('gulp-surge'),
      child         = require('child_process'),
      path          = require('path'),
      glob          = require('glob');


// Clean all folders and files from previous build
gulp.task('clean', function() {
  return gulp.src('./build')
    .pipe(clean());
});

// Use Jekyll to build the files
gulp.task('jekyll', () => {
  return child.spawn('bundle', ['exec', 'jekyll', 'build', '--incremental']);
});


// Get an array of subdirectories under
const subDirectories = glob.sync('./build/*/');

// Copy assets files to build
gulp.task('copy', function () {
  // run the pipeline for each subDirectory
  subDirectories.forEach(function (subDirectory) {
    return gulp.src('./source/assets/**/' + path.basename(subDirectory) + '.jpg')
      .pipe(gulp.dest(subDirectory + '/assets'));
  });
});

// Deploy to Surge
gulp.task('deploy', function () {
  // run the pipeline for each subDirectory
  subDirectories.forEach(function (subDirectory) {
    return surge({
      project: subDirectory, // Path to your static build directory
      domain: path.basename(subDirectory) + '.surge.sh'  // Your domain or Surge subdomain
    });
  });
})

// Default Gulp
gulp.task('default', gulp.series('clean'));