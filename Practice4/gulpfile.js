var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

var path = {
    css: './src/**/*.css',
    html: './src/pages/**/*.html',
    build: {
        css:  './build/styles/',
        html: './build/'
    }
};

gulp.task('default', ['build', 'serve', 'watch']);
gulp.task('build', ['css', 'html']);

gulp.task('css', function () {
    return gulp.src(path.css)
        .pipe(concat('style.css'))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('html', function () {
    return gulp.src(path.html)
        .pipe(gulp.dest(path.build.html));
});

gulp.task('watch', function () {
    gulp.watch(path.css, ['css']);
    gulp.watch(path.html, ['html']);
});

gulp.task('serve', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: path.build.html
        }
    });
    gulp.watch('build/**').on('change', browserSync.reload);
});